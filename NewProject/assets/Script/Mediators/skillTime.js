const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class skillTime extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(arg){
        this.data = arg
        let self = this
        this.skillconf = cc.moduleMgr.playerModule.GetSkill(arg.id)
        cc.tools.changeSprite(this.node,"skill/"+this.skillconf.icon)
        this.node.active = true
        this.skillStartTime = cc.tools.NowTime()
        let time = this.skillconf.duration
        let seq = cc.sequence(cc.delayTime(time-2),cc.blink(2, 10),cc.callFunc(function(){
            self.stopAllActions()
        }))
        this.node.runAction(seq)
    }
    start(){}
    update(){
        if (this.skillStartTime && this.skillStartTime > 0){
            let time = cc.tools.TimeFormat(this.skillStartTime + this.skillconf.duration - cc.tools.NowTime())
            if (time == 0){
                this.node.children[0].getComponent(cc.Label).string = "00:00"
            }else{
                this.node.children[0].getComponent(cc.Label).string = time
            }
        }
    }
    stopAllActions(){
        this.skillStartTime = 0
        this.node.active = false
        this.node.stopAllActions();
        Notification.emit("skillstopAllActions",{id:this.data.id})
    }
}