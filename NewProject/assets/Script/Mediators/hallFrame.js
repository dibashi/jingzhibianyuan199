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
        this.skillNode = []
        this.nodeN = {}
        this.nodeN.startBtn = this.node.getChildByName("startBtn").getComponent("ClickEventListener")
        this.nodeN.roleBtn = this.node.getChildByName("roleBtn").getComponent("ClickEventListener")
        this.nodeN.goldBtn = this.node.getChildByName("gold").getComponent("ClickEventListener")
        this.nodeN.startMask = this.node.getChildByName("startMask").getComponent("ClickEventListener")
        this.nodeN.gold = this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label)
        this.nodeN.score = this.node.getChildByName("score").getChildByName("num").getComponent(cc.Label)
        this.nodeN.light = this.node.getChildByName("light")
        this.nodeN.skillEffect = this.node.getChildByName("skillEffect")
        this.nodeN.articuloMortis = this.node.getChildByName("articuloMortis")
        this.nodeN.resurgence = this.node.getChildByName("resurgence")
        this.nodeN.warning = this.node.getChildByName("warning")
        this.nodeN.skillLayout = this.node.getChildByName("skillLayout")
        this.nodeN.Skill_0 = this.nodeN.skillLayout.children[0]
        this.nodeN.score.string = cc.moduleMgr.playerModule.module.OldScore
        this.nodeN.gold.string = cc.moduleMgr.itemModule.ItemCount(1000)
        //this.nodeN.startBtn.onClick = function(){
        this.nodeN.startMask.onClick = function(){
            //cc.moduleMgr.tempModule.randomBgColor()
            self.node.getComponent(cc.Animation).play("start_hall")
            self.node.parent.getComponent(cc.Animation).play("start_root")

            let id = cc.moduleMgr.playerModule.module.Role
            let skillconf = cc.moduleMgr.playerModule.GetRoleSkill(id);
            cc.tools.changeSprite(self.nodeN.skillEffect,"bg/"+skillconf.conf.Effect)

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

            for (let i = 0;i<this.skillNode.length;i++){
                this.skillNode[i].getComponent("skillTime").stopAllActions()
            }
            this.skillStop()
        },this)
        Notification.on("reliveGame",function(arg){
            for (let i = 0;i<this.skillNode.length;i++){
                this.skillNode[i].getComponent("skillTime").stopAllActions()
            }
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
            let is_node = null
            for (let i = 0;i<this.nodeN.skillLayout.childrenCount;i++){
                if (i >0 && this.nodeN.skillLayout.children[i].active==false){
                    is_node = this.nodeN.skillLayout.children[i]
                }
            }
            if (is_node == null){
                is_node = cc.instantiate(this.nodeN.skillLayout.children[0])
                is_node.parent = this.nodeN.skillLayout
            }
            is_node.getComponent("skillTime").localInit(arg)
            this.skillNode.push(is_node)

            let skillconf = cc.moduleMgr.playerModule.GetSkill(arg.id);
            if (skillconf.type == 0){
                this.nodeN.resurgence.active = true
            }else{
                if (skillconf.Animation == 1){
                    this.nodeN.skillEffect.getComponent(cc.Animation).play("skilleffect")
                }else{
                    this.nodeN.skillEffect.getComponent(cc.Animation).stop("skilleffect")
                }
                this.nodeN.skillEffect.active = true
            }
        },this)
        let is_play = false
        Notification.on("warningDistanceUpdate",function(arg){
            //console.log(cc.moduleMgr.tempModule.module.warningDistance)
            //this.nodeN.warning.getChildByName("num").getComponent(cc.Label).string = cc.moduleMgr.tempModule.module.warningDistance
            if(cc.moduleMgr.tempModule.module.warningDistance <= 10){
                this.nodeN.warning.runAction(cc.fadeIn(1))
                this.nodeN.articuloMortis.active = true
                //this.nodeN.warning.scale = (10 - cc.moduleMgr.tempModule.module.warningDistance)*0.1 + 1
                if (cc.moduleMgr.tempModule.module.warningDistance <= 8){
                    if (!is_play){
                        is_play = true
                        this.nodeN.warning.getComponent(cc.Animation).play("warning")
                    }
                }else{
                    if (is_play){
                        is_play = false
                        this.nodeN.warning.getComponent(cc.Animation).stop("warning")
                        this.nodeN.warning.rotation = 0
                    }
                }
            }else{
                //this.nodeN.warning.scale = 1
                this.nodeN.warning.runAction(cc.fadeOut(1))
                this.nodeN.articuloMortis.active = false
            }
        },this)
        Notification.on("skillstopAllActions",function(arg){
            let skillconf = cc.moduleMgr.playerModule.GetSkill(arg.id);
            if (skillconf.type == 0){
                this.nodeN.resurgence.active = false
            }else{
                this.nodeN.skillEffect.active = false
            }
        },this)
    }
    skillStop(){//屏幕效果全部停止
        this.nodeN.skillEffect.active = false
        this.nodeN.resurgence.active = false
        this.nodeN.articuloMortis.active = false
    }
    RefHallLayout(arg){
        this.node.getChildByName("mask").active = arg.length > 0 ? true : false
        this.nodeN.startBtn.node.active = arg.length > 0 ? false : true
        this.nodeN.light.active = arg.length > 0 ? false : true
        this.node.parent.getChildByName("hero_box").active = arg.length > 0 ? false : true
        this.node.parent.getChildByName("bg").active = arg.length > 0 ? false : true
        //this.node.parent.getChildByName("title").active = arg.length > 0 ? false : true
        //this.node.parent.getChildByName("shadow").active = arg.length > 0 ? false : true
    }
}