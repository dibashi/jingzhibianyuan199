const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class GameOverFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        this.data = data
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.bg = this.node.getChildByName("bg")
        this.nodeN.hallBtn = this.node.getChildByName("hallBtn").getComponent("ClickEventListener")
        this.nodeN.resetBtn = this.node.getChildByName("resetBtn").getComponent("ClickEventListener")

        this.nodeN.hallBtn.onClick = function(){
            Notification.emit("hallcallBack")
            self.node.destroy()
        }
        this.nodeN.resetBtn.onClick = function(){
            self.node.destroy()
            Notification.emit("reliveGame")
        }
        cc.tools.changeSprite(this.nodeN.bg,"bg/cj0"+ cc.moduleMgr.tempModule.module._bg_Color)
    }
}