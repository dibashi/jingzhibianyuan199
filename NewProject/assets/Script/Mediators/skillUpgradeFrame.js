const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class skillUpgradeFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        this.data = data
        Notification.on("SkillModuleUpdate",function(){
            this.loadSkillDesc(this.data.id)
        },this)
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.mask = this.node.getChildByName("mask").getComponent("ClickEventListener")
        this.nodeN.lvBtn = this.node.getChildByName("lvBtn").getComponent("ClickEventListener")
        this.nodeN.gold = this.node.getChildByName("lvBtn").getChildByName("gold").getComponent(cc.Label)
        this.nodeN.skillIcon = this.node.getChildByName("icon")
        this.nodeN.StageName = this.node.getChildByName("stage").getComponent(cc.Label)
        this.nodeN.skillName = this.node.getChildByName("name").getComponent(cc.Label)
        this.nodeN.skillDesc = this.node.getChildByName("desc").getComponent(cc.Label)
        this.nodeN.skilllv = this.node.getChildByName("lv").getComponent(cc.Label)
        this.nodeN.skillcd = this.node.getChildByName("cd").getChildByName("time").getComponent(cc.Label)
        this.nodeN.skillduration = this.node.getChildByName("duration").getChildByName("time").getComponent(cc.Label)
        this.nodeN.mask.onClick = function(){
            self.node.destroy()
        }
        this.nodeN.lvBtn.onClick = function(){
            let itemConf = cc.config("item")
            let roleConf = cc.config("role")
            let expend = Math.pow(2, cc.moduleMgr.skillModule.SkillLv(roleConf[self.data.id].skills))
            let fun = function () {
                if (cc.moduleMgr.itemModule.ItemCount(1000) >= expend) {
                    let Items = []
                    let id = 1000
                    let count = cc.moduleMgr.itemModule.ItemCount(id) - expend
                    Items.push({ id: id, count: count })
                    cc.moduleMgr.itemModule.AddOrUpdateDatas(Items)

                   let Skills = []
                   let lv = cc.moduleMgr.skillModule.SkillLv(roleConf[self.data.id].skills) + 1
                   Skills.push({ id: roleConf[self.data.id].skills, lv: lv })
                   cc.moduleMgr.skillModule.AddOrUpdateDatas(Skills)
                } else {
                    cc.tools.showlog(itemConf[1000].name + "不足")
                }
            }
            cc.tools.showchoose({ desc: "是否消耗" + expend + itemConf[1000].name + "升级技能", fun: fun })
        }
        this.loadSkillDesc(this.data.id)
    }
    loadSkillDesc(id){
        let roleConf = cc.config("role")
        let skilConf = cc.config("skills")[roleConf[id].skills]
        if (skilConf.icon != 0){
            cc.tools.changeSprite(this.nodeN.skillIcon,"skill/"+skilConf.icon)
        }else{
            cc.tools.changeSprite(this.nodeN.skillIcon)
        }
        let skillLv = cc.moduleMgr.skillModule.SkillLv(roleConf[id].skills)
        this.nodeN.StageName.string = "稀有度："+skilConf.stage
        this.nodeN.skillName.string = "名称："+skilConf.name
        this.nodeN.skillDesc.string = skilConf.desc
        this.nodeN.skillcd.string = skilConf.cd+"秒"
        let duration = (skillLv-1) * (skilConf.duration*skilConf.increase) + skilConf.duration
        this.nodeN.skillduration.string = duration+"秒 +" + Math.floor((skilConf.duration*skilConf.increase) * 100) / 100
        this.nodeN.skilllv.string = "Lv."+ skillLv
        let expend = Math.pow(2, skillLv)
        this.nodeN.gold.string = expend
    }
}