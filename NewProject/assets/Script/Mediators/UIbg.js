const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class UIbg extends cc.Component {
    start(){
        Notification.on("CurCheckPointChange",function(arg){
            let color = cc.moduleMgr.tempModule.module.CurcheckPoint.color
            cc.tools.changeSprite(this.node.getChildByName("bg"),"bg/cj0"+ color)
        },this)
    }
}