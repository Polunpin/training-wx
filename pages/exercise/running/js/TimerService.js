import dayjs from "dayjs";
import {eventBus} from "./EventBus";

export class TimerService {
  duration = 0;
  isRunning = false;
  PausedTimeKey = "PAUSED_TIME";
  StartTimeKey = "START_TIME";
  timerId = null;

  constructor(){

  }

  // 启动计时
  timerStart() {
      if (this.isRunning) return;
      this.clearTimer(); // 清除现有计时器
      this.isRunning = true;
      this.setStartTime(this.getStartTime() || Date.now());
      this.timerId = setInterval(() => this.computeDuration(), 1000);
  }

  // 暂停计时
  timerPause() {
      if (!this.isRunning) return;
      this.isRunning = false;
      this.clearTimer();
      this.setPausedTime(Date.now());
  }

  // 继续计时
  timerResume() {
      const pauseTime = this.getPauseTime();
      console.log('上一次的暂停时间', dayjs(pauseTime).format("YYYY-MM-DD HH:mm:ss"));
      if (pauseTime) {
          this.calculateNewStartTime(pauseTime);
          this.setPausedTime(null);
      }
      this.timerStart();
  }

  // 结束计时
  timerStop() {
      this.clearTimer();
      this.isRunning = false;
      this.resetTimer();
  }

  setStartTime(time) {
      console.log("设置偏移时间：", dayjs(time).format("YYYY-MM-DD HH:mm:ss"));
      wx.setStorageSync(this.StartTimeKey, time);
  }

  getStartTime() {
      return wx.getStorageSync(this.StartTimeKey);
  }

  setPausedTime(time) {
      console.log("设置暂停时间：", dayjs(time).format("YYYY-MM-DD HH:mm:ss"));
      wx.setStorageSync(this.PausedTimeKey, time);
  }

  getPauseTime() {
      return wx.getStorageSync(this.PausedTimeKey);
  }

  // 计算持续时间的方法
  computeDuration() {
      const startTime = this.getStartTime();
      if (startTime) {
          this.duration = Math.floor((Date.now() - startTime) / 1000);
          // console.log((`${Date.now()} - ${startTime}) / 1000 = ${this.duration} s`));
          eventBus.emit('duration', this.duration)
      }
  }

  // 根据暂停时间计算新的起始时间
  calculateNewStartTime(pauseTime) {
      const now = Date.now();
      const startTime = this.getStartTime();
      if (startTime) {
          // 计算新的 startTime，将 startTime 向前移动暂停的时间间隔
          const adjustedStartTime = startTime + (now - pauseTime);
          console.log(`New Start Time ${startTime} + (${now} - ${pauseTime}) = ${adjustedStartTime}`);
          console.log("偏移后的开始时间", dayjs(adjustedStartTime).format("YYYY-MM-DD HH:mm:ss"));
          this.setStartTime(adjustedStartTime);
      }
  }

  // 清除计时器
  clearTimer() {
      if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
      }
  }

  // 重置计时器
  resetTimer() {
      this.setStartTime(null);
      this.setPausedTime(null);
      this.duration = 0;
      this.isRunning = false;
  }
}
