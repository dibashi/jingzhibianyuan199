const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class hallFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        cc.audioMgr.playEffect("bg");
    }
    localInit(data){
        this.data = data
        
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.startBtn = this.node.getChildByName("startBtn").getComponent("ClickEventListener")

        this.nodeN.startBtn.onClick = function(){
            //cc.moduleMgr.tempModule.randomBgColor()
            self.node.getComponent(cc.Animation).play("start_hall")
            self.node.parent.getComponent(cc.Animation).play("start_root")
        }

        Notification.on("hallcallBack",function(arg){
            this.node.getComponent(cc.Animation).play("reset_hall")
            this.node.parent.getComponent(cc.Animation).play("reset_root")
            this.node.parent.active = true
        },this)
    }
}