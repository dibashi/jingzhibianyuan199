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
        if (cc.moduleMgr.playerModule.module){
            cc.tools.showlog("欢迎回来！")
            if (cc.moduleMgr.playerModule.module.time != cc.tools.NowTimeZero()){
                cc.moduleMgr.playerModule.UpdateTime(cc.tools.NowTimeZero())
                //cc.AppInterface.ItemChange(1022,5)
            }
        }else{
            cc.moduleMgr.playerModule.AddOrUpdateSimpleData({pid:9527,name:"托比昂",lv:1,time:cc.tools.NowTimeZero()})
            //cc.AppInterface.ItemChange(1022,5)
            cc.tools.showlog("首次登录！")
        }
    }
    start() {
        let self = this
        this.skillStartTime = 0
        this.nodeN = {}
        this.nodeN.startBtn = this.node.getChildByName("startBtn").getComponent("ClickEventListener")
        this.nodeN.roleBtn = this.node.getChildByName("roleBtn").getComponent("ClickEventListener")
        this.nodeN.goldBtn = this.node.getChildByName("gold").getComponent("ClickEventListener")
        this.nodeN.gold = this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label)
        this.nodeN.score = this.node.getChildByName("score").getChildByName("num").getComponent(cc.Label)
        this.nodeN.light = this.node.getChildByName("light")
        this.nodeN.skillLayout = this.node.getChildByName("skillLayout")
        console.log(this.nodeN.skillLayout)
        this.nodeN.Skill_0 = this.nodeN.skillLayout.children[0]
        this.nodeN.score.string = cc.moduleMgr.playerModule.module.OldScore
        this.nodeN.gold.string = cc.moduleMgr.itemModule.ItemCount(1000)
        this.nodeN.startBtn.onClick = function(){
            //cc.moduleMgr.tempModule.randomBgColor()
            self.node.getComponent(cc.Animation).play("start_hall")
            self.node.parent.getComponent(cc.Animation).play("start_root")
        }
        this.nodeN.roleBtn.onClick = function(){
            let id = cc.moduleMgr.playerModule.module.Role
            cc.uiMgr.Push("HeroShowFrame",{id:id})
        }
        this.nodeN.goldBtn.onClick = function(){
            // let id = 1000
            // let count = cc.moduleMgr.itemModule.ItemCount(id) + 1
            // cc.moduleMgr.itemModule.AddOrUpdateDatas([{id:id,count:count}])
            cc.moduleMgr.itemModule.itemAddCount(1000,1)
        }
        Notification.on("hallcallBack",function(arg){
            this.node.getComponent(cc.Animation).play("reset_hall")
            this.node.parent.getComponent(cc.Animation).play("reset_root")
            this.nodeN.score.string = cc.moduleMgr.playerModule.module.OldScore

            this.skillStartTime = 0
            this.nodeN.Skill_0.active = false
        },this)
        Notification.on("TempModuleScoreUpdate",function(arg){
            this.nodeN.score.string = cc.moduleMgr.tempModule.module.score
        },this)
        Notification.on("ItemModuleUpdate",function(){
            this.nodeN.gold.string = cc.moduleMgr.itemModule.ItemCount(1000)
        },this)
        Notification.on("UIMgr_pop",function(arg){
            this.RefHallLayout(arg)
        },this)
        Notification.on("UIMgr_push",function(arg){
            this.RefHallLayout(arg)
        },this)
        Notification.on("skillShowTime",function(arg){
            let id = cc.moduleMgr.playerModule.module.Role
            this.skillconf = cc.moduleMgr.playerModule.GetRoleSkill(id)
            cc.tools.changeSprite(this.nodeN.Skill_0,"skill/"+this.skillconf.icon)
            this.nodeN.Skill_0.active = true
            this.skillStartTime = cc.tools.NowTime()
            let time = this.skillconf.duration
            let seq = cc.sequence(cc.delayTime(time-2),cc.blink(2, 10),cc.callFunc(function(){
                self.skillStartTime = 0
                self.nodeN.Skill_0.active = false
            }))
            this.nodeN.Skill_0.runAction(seq)
        },this)
    }
    RefHallLayout(arg){
        this.node.getChildByName("mask").active = arg.length > 0 ? true : false
        this.nodeN.startBtn.node.active = arg.length > 0 ? false : true
        this.nodeN.light.active = arg.length > 0 ? false : true
        this.node.parent.getChildByName("hero_box").active = arg.length > 0 ? false : true
        this.node.parent.getChildByName("title").active = arg.length > 0 ? false : true
        this.node.parent.getChildByName("shadow").active = arg.length > 0 ? false : true
    }
    update(){
        if (this.skillStartTime && this.skillStartTime > 0){
            let time = cc.tools.TimeFormat(this.skillStartTime + this.skillconf.duration - cc.tools.NowTime())
            if (time == 0){
                this.nodeN.Skill_0.children[0].getComponent(cc.Label).string = "00:00"
            }else{
                this.nodeN.Skill_0.children[0].getComponent(cc.Label).string = time
            }
        }
    }
}