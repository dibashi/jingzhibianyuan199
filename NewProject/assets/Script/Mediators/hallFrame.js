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
        this.nodeN = {}
        this.nodeN.startBtn = this.node.getChildByName("startBtn").getComponent("ClickEventListener")
        this.nodeN.roleBtn = this.node.getChildByName("roleBtn").getComponent("ClickEventListener")
        this.nodeN.goldBtn = this.node.getChildByName("gold").getComponent("ClickEventListener")
        this.nodeN.gold = this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label)
        this.nodeN.score = this.node.getChildByName("score").getChildByName("num").getComponent(cc.Label)
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
            //this.node.parent.active = true
        },this)
        Notification.on("TempModuleScoreUpdate",function(arg){
            this.nodeN.score.string = cc.moduleMgr.tempModule.module.score
        },this)
        Notification.on("ItemModuleUpdate",function(){
            this.nodeN.gold.string = cc.moduleMgr.itemModule.ItemCount(1000)
        },this)
        Notification.on("UIMgr_pop",function(data){
            self.node.getChildByName("mask").active = data.length > 0 ? true : false
        },this)
        Notification.on("UIMgr_push",function(data){
            self.node.getChildByName("mask").active = data.length > 0 ? true : false
        },this)
    }
}