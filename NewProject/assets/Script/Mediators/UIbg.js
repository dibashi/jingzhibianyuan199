const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class UIbg extends cc.Component {
    start(){
        Notification.on("randomBgColorChange",function(arg){
            cc.tools.changeSprite(this.node.getChildByName("bg"),"bg/cj0"+ cc.moduleMgr.tempModule.module._bg_Color)
        },this)
    }
}