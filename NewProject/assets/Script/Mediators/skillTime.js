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
        if (time > 0){
            let seq = cc.sequence(cc.delayTime(time - 1),cc.blink(1, 5),cc.callFunc(function(){
                self.stopAllActions()
            }))
            this.node.runAction(seq)
        }else{

        }
    }
    start(){
        Notification.on("StopSkillTime",function(arg){
            if (arg.id == this.data.id){
                this.stopAllActions()
            }
        },this)
    }
    update(){
        if (this.skillStartTime && this.skillStartTime > 0){
            if (this.skillconf.duration > 0){
                let time = cc.tools.TimeFormat(this.skillStartTime + this.skillconf.duration - cc.tools.NowTime())
                if (time == 0){
                    this.node.children[0].getComponent(cc.Label).string = "00:00"
                }else{
                    this.node.children[0].getComponent(cc.Label).string = time
                }
            }else{
                this.node.children[0].getComponent(cc.Label).string = "∞"
            }
        }
    }
    stopAllActions(){
        this.skillStartTime = 0
        this.node.active = false
        this.node.stopAllActions();//停止当前对象动画
        Notification.emit("skillstopAllActions",{id:this.data.id})
    }
}