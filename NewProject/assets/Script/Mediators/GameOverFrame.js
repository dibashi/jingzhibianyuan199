const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class GameOverFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        cc.moduleMgr.playerModule.module.score = cc.moduleMgr.tempModule.module.score
    }
    localInit(data){
        this.data = data
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.bg = this.node.getChildByName("bg")
        this.nodeN.nowscore = this.node.getChildByName("nowscore").getComponent(cc.Label)
        this.nodeN.oldscore = this.node.getChildByName("oldscore").getComponent(cc.Label)
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
        this.nodeN.nowscore.string = cc.moduleMgr.playerModule.module.score
        this.nodeN.oldscore.string = cc.moduleMgr.playerModule.module.OldScore
    }
}