import {eventBus} from "./EventBus";
import {TimerService} from "./TimerService";
// import {navTo, safeBack, toHome} from "./Navigation";
import {TrackUtil} from "./TrackUtil";
import api from '../../../../api/cloudService'
export class RunningService extends TimerService {
    static shared = new RunningService()

    constructor() {
        super()
        this.onLocationChange = this.onLocationChange.bind(this)
    }
    mapContent = wx.createMapContext('running-map')
    status = 'idle';
    distance = 0;
    // calorie = 0;
    points = [];
    originalLocation;
    speed = 0;
    location;
    startTime = ''
    endTime = ''

    async onLocationChange(location) {
        console.log(location);
        eventBus.emit('location', this.location)
        this.speed = location.speed
        eventBus.emit('speed', location.speed)
        if (location.speed <= 0) {
            console.log('无速度，跳过')
            return;
        }
        console.log('已有轨迹点', this.points?.length)
        if (!this.points) {
            this.points = []
        }
        if (this.points.length > 2) {
            const prev = this.points[this.points.length - 1]
            if (location.latitude === prev.latitude && location.longitude === prev.longitude) {
                console.log('位置相同')
                return
            }
            // 计算距离
            const distanceMeters = TrackUtil.distanceMeters(
                prev.latitude,
                prev.longitude,
                location.latitude,
                location.longitude
            )
            this.distance += distanceMeters
            // console.log('计算距离',distanceMeters,prev,location)
            eventBus.emit('distance', this.distance)
        }
        this.points.push({
            latitude: location.latitude,
            longitude: location.longitude,
            speed: location.speed,
            altitude: location.altitude
        })
        eventBus.emit('points', this.points)
        // this.calorie = TrackUtil.calculateCaloriesBurned(70, this.distance, this.duration)
        // eventBus.emit('calorie', this.calorie)
    }
    confrimStart () {
        // this.timerStop();
        // this.reset()
        this.status = 'start'
        this.timerStart()
        this.startTime = new Date()
        eventBus.emit('status', 'start')
         wx.onLocationChange(this.onLocationChange)
    }
    start(callback) {
        console.log('点击开始')
        // this.status = 'start'
        // this.timerStart()
        // eventBus.emit('status', 'start')
        wx.startLocationUpdateBackground({
            success: res => {
                console.log('startLocationUpdateBackground 用户开启使用小程序期间位置权限:', res)
                // wx.onLocationChange(this.onLocationChange)
                callback && callback()
            },
            fail: err => {
                wx.showToast({title: '位置功能无法进行', icon: 'none'})
                console.log('startLocationUpdate获取当前位置失败', err)
                this.status = "idle"
                eventBus.emit('status', 'idle')
                this.showAlert()
            },
            complete: msg => {
                console.log('startLocationUpdateBackground complete', msg)
            }
        })
    }
    async checkPermission(callback) {
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                console.log(res)
                this.location = res
                this.originalLocation= res
                eventBus.emit('location', this.location)
                callback && callback()
                if (res.accuracy > 100) {
                    wx.showModal({
                        title: '卫星定位信号弱',
                        content: '当前卫星定位信号弱，建议您在信号良好的空旷处使用，您也可以直接开始。',
                        cancelText: '稍后使用',
                        confirmText: '继续使用',
                        success: (result) => {
                            if (result.cancel) {
                                // safeBack()
                                console.log('报错', safeBack)
                            }
                            if (result.confirm) {
                                this.mapContent.moveToLocation(res)
                            }
                        }
                    })
                }
            },
            fail: err => {
                console.log('检查定位权限', err)
                this.status = "idle"
                eventBus.emit('status', 'idle')
                this.showAlert()
            },
        })
    }
    showAlert() {
        wx.showModal({
                title: '未获得定位权限',
                content: '跑步功能需要您手机授权后台定位功能，若您继续使用此功能请设置使用时和离开后权限。',
                cancelText: '退出使用',
                confirmText: '设置授权',
                success: (result) => {
                    if (result.cancel) {
                        // safeBack()
                    }
                    if (result.confirm) {
                        // return
                        wx.openSetting({
                            success(res) {
                                console.log(res.authSetting)
                                res.authSetting = {
                                    "scope.userLocation": true,
                                    "scope.userInfo": true,
                                    'scope.werun': true
                                }
                            }
                        })
                    }
                }
            }
        )
    }

    pause() {
        this.status = 'paused'
        eventBus.emit('status', this.status)

        this.timerPause()
        wx.stopLocationUpdate({
            complete: (res) => {
                console.log("跑步暂停，停止位置更新:", res)
            }
        })
    }

    resume() {
        this.status = 'start'
        eventBus.emit('status', this.status)

        this.timerResume()
        wx.startLocationUpdateBackground({
            success: res => {
                console.log('startLocationUpdateBackground 用户开启使用小程序期间位置权限:', res)
                wx.onLocationChange(this.onLocationChange)
            },
            fail: err => {
                wx.showToast({title: '位置功能无法进行', icon: 'none'})
                console.log('startLocationUpdate获取当前位置失败', err)
                this.showAlert()
            },
            complete: msg => {
                console.log('startLocationUpdateBackground complete', msg)
            }
        })
    }

    async offLocationChange(result) {
        console.log('定位停止了', result);
    }

    async stop(obj,callback) {
        if (this.distance < 10) {
            wx.showModal({
                title: '距离太短',
                content: '您似乎还没开始，本次轨迹不会被保存',
                showCancel: false,
                success: (result) => {
                    if (result.confirm) {
                        // 结束计时并获取总时间
                        this.timerStop();
                        this.status = 'idle'
                        eventBus.emit('status', this.status)
                        this.reset()
                        uni.navigateBack({ delta: 1 })
                    }
                }
            })
            return
        }
        try {
            wx.showLoading({title: '正在生成轨迹'})
            await wx.stopLocationUpdate()
            wx.offLocationChange(this.offLocationChange)
            // 结束计时并获取总时间
            this.timerPause();
            this.status = 'idle'
            eventBus.emit('status', this.status)
            // 构建需要存储的数据
            const track = {
                ...obj,
                startTime: this.startTime,
                endTime: new Date(),
                duration: this.duration,
                distance: TrackUtil.metersToKilometers(this.distance),
                trajectory: JSON.stringify(this.points),
            }
            console.log('upload track',track);
            const res = await api.call({
                path: '/practiceRecord/savePracticeRecord',
                method: 'POST',
                data: track
            })
            console.log(res,' resresresres测试返回')
            this.reset()
            this.timerStop()
            callback && callback(res.data)

            // if (res.success && res.result?.id) {
            //     this.reset()
                
            //     this.timerStop()
            // } else {
            //     uni.showToast({title: '上传失败', icon: 'none'})
            // }
        } catch (e) {
            console.log('轨迹生成或保存错误', e)
        } finally {
            setTimeout(() => {
                wx.hideLoading()
            }, 200)
        }

    }
    resetMap () {
        console.log()
        wx.createMapContext('running-map').moveToLocation()
    }

    reset() {
        this.status = 'idle'
        eventBus.emit('status', this.status)
        this.duration = 0
        eventBus.emit('duration', this.duration)
        this.points = []
        eventBus.emit('points', this.points)
        this.distance = 0
        eventBus.emit('distance', this.distance)
        // this.calorie = 0
        // eventBus.emit('calorie', this.calorie)
    }
}