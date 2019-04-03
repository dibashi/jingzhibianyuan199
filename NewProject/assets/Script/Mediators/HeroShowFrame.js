const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class HeroShowFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //this.data = data
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.bg = this.node.getChildByName("bg")
        this.nodeN.role = this.node.getChildByName("role")
        this.nodeN.desc = this.node.getChildByName("desc").getComponent(cc.Label)
        this.nodeN.leftBtn = this.node.getChildByName("leftBtn").getComponent("ClickEventListener")
        this.nodeN.rightBtn = this.node.getChildByName("rightBtn").getComponent("ClickEventListener")
        this.nodeN.roleChangeBtn = this.node.getChildByName("roleChangeBtn").getComponent("ClickEventListener")
        let id = cc.moduleMgr.playerModule.module.Role
        let roleConf = cc.config("role")
        this.RoleChange(id)
        
        this.nodeN.leftBtn.onClick = function(){
            id -= 1
            self.RoleChange(id)
        }
        this.nodeN.rightBtn.onClick = function(){
            id += 1
            self.RoleChange(id)
        }
        this.nodeN.roleChangeBtn.onClick = function(){
            cc.moduleMgr.playerModule.AddOrUpdateSimpleData({Role:id})
        }
        Notification.on("PlayerModuleUpdate",function(arg){
            self.RoleChange(id)
        },this)
    }
    RoleChange(id){
        let roleConf = cc.config("role")
        let skilConf = cc.config("skills")
        if (roleConf[id]){
            cc.tools.changeSprite(this.nodeN.role,"role/"+ roleConf[id].Role)
            this.nodeN.desc.string = roleConf[id].name+"\n"+roleConf[id].desc+"\n技能："+skilConf[roleConf[id].skills].name+"\n"+skilConf[roleConf[id].skills].desc
        }
        this.nodeN.leftBtn.node.active = roleConf[id-1] ? true : false
        this.nodeN.rightBtn.node.active = roleConf[id+1] ? true : false
        this.nodeN.roleChangeBtn.node.active = id != cc.moduleMgr.playerModule.module.Role ? true : false
    }
}