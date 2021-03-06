const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class hallFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        cc.audioMgr.playBg("bg");
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
        this.skillEffect = []
        this.nodeN = {}
        this.nodeN.startBtn = this.node.getChildByName("startBtn").getComponent("ClickEventListener")
        this.nodeN.roleBtn = this.node.getChildByName("roleBtn").getComponent("ClickEventListener")
        this.nodeN.goldBtn = this.node.getChildByName("gold").getComponent("ClickEventListener")
        this.nodeN.startMask = this.node.getChildByName("startMask").getComponent("ClickEventListener")
        this.nodeN.gold = this.node.getChildByName("gold").getChildByName("num").getComponent(cc.Label)
        this.nodeN.score = this.node.getChildByName("score").getChildByName("num").getComponent(cc.Label)
        this.nodeN.light = this.node.getChildByName("light")
        this.nodeN.warning = this.node.getChildByName("warning")
        this.nodeN.skillRoot = this.node.getChildByName("skillRoot")
        this.nodeN.skillLayout = this.node.getChildByName("skillLayout")
        this.nodeN.Skill_0 = this.nodeN.skillLayout.children[0]
        this.nodeN.score.string = cc.moduleMgr.playerModule.module.OldScore
        this.nodeN.gold.string = cc.moduleMgr.itemModule.ItemCount(1000)
        //this.nodeN.startBtn.onClick = function(){
        this.nodeN.startMask.onClick = function(){
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

            for (let i = 0;i<this.skillNode.length;i++){
                this.skillNode[i].getComponent("skillTime").stopAllActions()
            }
            this.skillStopAll()
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
            if (skillconf.EffectPrefab != null && skillconf.EffectPrefab != ""){
                this.skillPlay(skillconf.id)
            }
        },this)
        let is_play = false
        Notification.on("warningDistanceUpdate",function(arg){
            //console.log(cc.moduleMgr.tempModule.module.warningDistance)
            //this.nodeN.warning.getChildByName("num").getComponent(cc.Label).string = cc.moduleMgr.tempModule.module.warningDistance
            if(cc.moduleMgr.tempModule.module.warningDistance <= 10){
                this.nodeN.warning.runAction(cc.fadeIn(1))
                this.skillPlay(2005)
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
                this.skillStop(2005)
            }
        },this)
        Notification.on("skillstopAllActions",function(arg){
            this.skillStop(arg.id)
        },this)
    }
    skillPlay(id){
        let skillconf = cc.moduleMgr.playerModule.GetSkill(id);
        if (skillconf && skillconf.EffectPrefab != null && skillconf.EffectPrefab != ""){
            if (this.skillEffect[id]){
                if (this.skillEffect[id].getComponent(cc.Animation).enabled){
                    return
                }
            }else{
                this.skillEffect[id] = cc.uiMgr.Push(skillconf.EffectPrefab,null,{add:false,parentObj:this.nodeN.skillRoot})
            }
            this.skillEffect[id].active = true
            this.skillEffect[id].getComponent(cc.Animation).enabled = true
            let clips = this.skillEffect[id].getComponent(cc.Animation).getClips()
            this.skillEffect[id].getComponent(cc.Animation).play(clips[0].name)
        }
    }
    skillStop(id){
        let skillconf = cc.moduleMgr.playerModule.GetSkill(id);
        if (skillconf && skillconf.EffectPrefab != null && skillconf.EffectPrefab != ""){
            if (this.skillEffect[id]){
                if (!this.skillEffect[id].getComponent(cc.Animation).enabled){
                    return
                }
                let clips = this.skillEffect[id].getComponent(cc.Animation).getClips()
                this.skillEffect[id].getComponent(cc.Animation).stop(clips[0].name)
                this.skillEffect[id].getComponent(cc.Animation).enabled = false
                this.skillEffect[id].active = false
            }
        }
    }
    skillStopAll(){//屏幕效果全部停止
        //console.log(this.skillEffect)
        for (let id in this.skillEffect){
            //console.log(id)
            this.skillStop(id)
        }
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