(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uni_modules/uv-popup/components/uv-popup/uv-popup"],{"1aa4":function(t,o,e){"use strict";(function(t){var i=e("47a9");Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var n,s,r=i(e("7ca3")),a=i(e("bca9")),u=i(e("94c4"));function l(t,o){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);o&&(i=i.filter((function(o){return Object.getOwnPropertyDescriptor(t,o).enumerable}))),e.push.apply(e,i)}return e}var c={name:"uv-popup",components:{},mixins:[a.default,u.default],emits:["change","maskClick"],props:function(t){for(var o=1;o<arguments.length;o++){var e=null!=arguments[o]?arguments[o]:{};o%2?l(Object(e),!0).forEach((function(o){(0,r.default)(t,o,e[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):l(Object(e)).forEach((function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(e,o))}))}return t}({mode:{type:String,default:"center"},duration:{type:[String,Number],default:300},zIndex:{type:[String,Number],default:10075},bgColor:{type:String,default:"#ffffff"},safeArea:{type:Boolean,default:!0},overlay:{type:Boolean,default:!0},closeOnClickOverlay:{type:Boolean,default:!0},overlayOpacity:{type:[Number,String],default:.4},overlayStyle:{type:[Object,String],default:""},safeAreaInsetBottom:{type:Boolean,default:!0},safeAreaInsetTop:{type:Boolean,default:!1},closeable:{type:Boolean,default:!1},closeIconPos:{type:String,default:"top-right"},zoom:{type:Boolean,default:!0},round:{type:[Number,String],default:0}},null===(n=t.$uv)||void 0===n||null===(s=n.props)||void 0===s?void 0:s.popup),watch:{type:{handler:function(t){this.config[t]&&this[this.config[t]](!0)},immediate:!0},isDesktop:{handler:function(t){this.config[t]&&this[this.config[this.mode]](!0)},immediate:!0},showPopup:function(t){}},data:function(){return{ani:[],showPopup:!1,showTrans:!1,popupWidth:0,popupHeight:0,config:{top:"top",bottom:"bottom",center:"center",left:"left",right:"right",message:"top",dialog:"center",share:"bottom"},transitionStyle:{position:"fixed",left:0,right:0},maskShow:!0,mkclick:!0,popupClass:this.isDesktop?"fixforpc-top":"top",direction:""}},computed:{isDesktop:function(){return this.popupWidth>=500&&this.popupHeight>=500},bg:function(){return""===this.bgColor||"none"===this.bgColor||this.$uv.getPx(this.round)>0?"transparent":this.bgColor},contentStyle:function(){var t={};if(this.bgColor&&(t.backgroundColor=this.bg),this.round){var o=this.$uv.addUnit(this.round),e=this.direction?this.direction:this.mode;t.backgroundColor=this.bgColor,"top"===e?(t.borderBottomLeftRadius=o,t.borderBottomRightRadius=o):"bottom"===e?(t.borderTopLeftRadius=o,t.borderTopRightRadius=o):"center"===e&&(t.borderRadius=o)}return this.$uv.deepMerge(t,this.$uv.addStyle(this.customStyle))}},destroyed:function(){this.setH5Visible()},created:function(){this.messageChild=null,this.clearPropagation=!1},methods:{setH5Visible:function(){},closeMask:function(){this.maskShow=!1},clear:function(t){t.stopPropagation(),this.clearPropagation=!0},open:function(t){if(!this.showPopup){if(t&&-1!==["top","center","bottom","left","right","message","dialog","share"].indexOf(t)?this.direction=t:t=this.mode,!this.config[t])return this.$uv.error("缺少类型：".concat(t));this[this.config[t]](),this.$emit("change",{show:!0,type:t})}},close:function(t){var o=this;this.showTrans=!1,this.$emit("change",{show:!1,type:this.mode}),clearTimeout(this.timer),this.timer=setTimeout((function(){o.showPopup=!1}),300)},touchstart:function(){this.clearPropagation=!1},onTap:function(){this.clearPropagation?this.clearPropagation=!1:(this.$emit("maskClick"),this.closeOnClickOverlay&&this.close())},top:function(t){var o=this;this.popupClass=this.isDesktop?"fixforpc-top":"top",this.ani=["slide-top"],this.transitionStyle={position:"fixed",zIndex:this.zIndex,left:0,right:0,backgroundColor:this.bg},t||(this.showPopup=!0,this.showTrans=!0,this.$nextTick((function(){o.messageChild&&"message"===o.mode&&o.messageChild.timerClose()})))},bottom:function(t){this.popupClass="bottom",this.ani=["slide-bottom"],this.transitionStyle={position:"fixed",zIndex:this.zIndex,left:0,right:0,bottom:0,backgroundColor:this.bg},t||(this.showPopup=!0,this.showTrans=!0)},center:function(t){this.popupClass="center",this.ani=this.zoom?["zoom-in","fade"]:["fade"],this.transitionStyle={position:"fixed",zIndex:this.zIndex,display:"flex",flexDirection:"column",bottom:0,left:0,right:0,top:0,justifyContent:"center",alignItems:"center"},t||(this.showPopup=!0,this.showTrans=!0)},left:function(t){this.popupClass="left",this.ani=["slide-left"],this.transitionStyle={position:"fixed",zIndex:this.zIndex,left:0,bottom:0,top:0,backgroundColor:this.bg,display:"flex",flexDirection:"column"},t||(this.showPopup=!0,this.showTrans=!0)},right:function(t){this.popupClass="right",this.ani=["slide-right"],this.transitionStyle={position:"fixed",zIndex:this.zIndex,bottom:0,right:0,top:0,backgroundColor:this.bg,display:"flex",flexDirection:"column"},t||(this.showPopup=!0,this.showTrans=!0)}}};o.default=c}).call(this,e("df3c")["default"])},"2b9c":function(t,o,e){},3381:function(t,o,e){"use strict";e.r(o);var i=e("56a1"),n=e("9565");for(var s in n)["default"].indexOf(s)<0&&function(t){e.d(o,t,(function(){return n[t]}))}(s);e("743c");var r=e("828b"),a=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,"5d1bda6c",null,!1,i["a"],void 0);o["default"]=a.exports},"56a1":function(t,o,e){"use strict";e.d(o,"b",(function(){return n})),e.d(o,"c",(function(){return s})),e.d(o,"a",(function(){return i}));var i={uvOverlay:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uv-overlay/components/uv-overlay/uv-overlay")]).then(e.bind(null,"cb88"))},uvTransition:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uv-transition/components/uv-transition/uv-transition")]).then(e.bind(null,"16fb"))},uvStatusBar:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uv-status-bar/components/uv-status-bar/uv-status-bar")]).then(e.bind(null,"e09e"))},uvSafeBottom:function(){return e.e("uni_modules/uv-safe-bottom/components/uv-safe-bottom/uv-safe-bottom").then(e.bind(null,"b0fc"))},uvIcon:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uv-icon/components/uv-icon/uv-icon")]).then(e.bind(null,"145a"))}},n=function(){var t=this.$createElement,o=(this._self._c,this.showPopup?this.__get_style([this.contentStyle]):null);this.$mp.data=Object.assign({},{$root:{s0:o}})},s=[]},"743c":function(t,o,e){"use strict";var i=e("2b9c"),n=e.n(i);n.a},9565:function(t,o,e){"use strict";e.r(o);var i=e("1aa4"),n=e.n(i);for(var s in i)["default"].indexOf(s)<0&&function(t){e.d(o,t,(function(){return i[t]}))}(s);o["default"]=n.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uni_modules/uv-popup/components/uv-popup/uv-popup-create-component',
    {
        'uni_modules/uv-popup/components/uv-popup/uv-popup-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('df3c')['createComponent'](__webpack_require__("3381"))
        })
    },
    [['uni_modules/uv-popup/components/uv-popup/uv-popup-create-component']]
]);
