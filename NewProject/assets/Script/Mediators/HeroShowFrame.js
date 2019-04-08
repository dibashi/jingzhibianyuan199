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
        this.nodeN.floor = this.node.getChildByName("floor")
        this.nodeN.skillIcon = this.node.getChildByName("skillBg").getChildByName("icon")
        this.nodeN.skillName = this.node.getChildByName("skillBg").getChildByName("skillName").getComponent(cc.Label)
        this.nodeN.skillDesc = this.node.getChildByName("skillBg").getChildByName("skillDesc").getComponent(cc.Label)
        this.nodeN.leftBtn = this.node.getChildByName("leftBtn").getComponent("ClickEventListener")
        this.nodeN.rightBtn = this.node.getChildByName("rightBtn").getComponent("ClickEventListener")
        this.nodeN.roleChangeBtn = this.node.getChildByName("roleChangeBtn").getComponent("ClickEventListener")
        this.nodeN.unlockBtn = this.node.getChildByName("unlockBtn").getComponent("ClickEventListener")
        let id = cc.moduleMgr.playerModule.module.Role
        this.shopIndex = 0
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
        this.nodeN.skillIcon.getComponent("ClickEventListener").onClick = function(){
            if (self.nodeN.skillIcon.getChildByName("up").active){

            }
        }
        this.nodeN.unlockBtn.onClick = function(){
            //cc.tools.showlog("正在解锁..."+id)
            let shopConf = cc.config("shop")
            let itemConf = cc.config("item")
            let fun = function(){
                if (cc.moduleMgr.itemModule.ItemCount(shopConf[6].item_id[self.shopIndex]) >= shopConf[6].price[self.shopIndex]){
                    let Items = []

                    let id = shopConf[6].item_id[self.shopIndex]
                    let count = cc.moduleMgr.itemModule.ItemCount(id) - shopConf[6].price[self.shopIndex]
                    Items.push({id:id,count:count})
    
                    id = shopConf[6].items[self.shopIndex]
                    count = cc.moduleMgr.itemModule.ItemCount(id) + shopConf[6].prices[self.shopIndex]
                    Items.push({id:id,count:count})
    
                    cc.moduleMgr.itemModule.AddOrUpdateDatas(Items)
                }else{
                    cc.tools.showlog(itemConf[shopConf[6].item_id[self.shopIndex]].name+"不足")
                }
            }
            cc.tools.showchoose({desc:"是否消耗"+shopConf[6].price[self.shopIndex]+itemConf[shopConf[6].item_id[self.shopIndex]].name+"解锁",fun:fun})
        }
        Notification.on("PlayerModuleUpdate",function(arg){
            self.RoleChange(id)
        },this)
        Notification.on("ItemModuleUpdate",function(){
            this.RoleChange(id)
        },this)
        cc.tools.changeSprite(this.nodeN.floor,"floor/zz0"+cc.moduleMgr.tempModule.module._bg_Color)
    }
    RoleChange(id){
        let roleConf = cc.config("role")
        let skilConf = cc.config("skills")
        if (roleConf[id]){
            cc.tools.changeSprite(this.nodeN.role,"role/"+ roleConf[id].Role)
            console.log(skilConf[roleConf[id].skills].icon)
            this.nodeN.skillIcon.getChildByName("up").active = skilConf[roleConf[id].skills].icon != "unknown" ? true : false
            if (skilConf[roleConf[id].skills].icon != 0){
                cc.tools.changeSprite(this.nodeN.skillIcon,"skill/"+skilConf[roleConf[id].skills].icon)
            }else{
                cc.tools.changeSprite(this.nodeN.skillIcon)
            }
            
            this.nodeN.skillName.string = skilConf[roleConf[id].skills].name
            this.nodeN.skillDesc.string = skilConf[roleConf[id].skills].desc
            //this.nodeN.desc.string = roleConf[id].name+"\n"+roleConf[id].desc+"\n技能："+skilConf[roleConf[id].skills].name+"\n"+skilConf[roleConf[id].skills].desc
        }
        this.nodeN.leftBtn.node.active = roleConf[id-1] ? true : false
        this.nodeN.rightBtn.node.active = roleConf[id+1] ? true : false
        this.nodeN.roleChangeBtn.node.active = false
        this.nodeN.unlockBtn.node.active = false
        if (cc.moduleMgr.itemModule.ItemCount(roleConf[id].item) >= roleConf[id].count){
            if (id != cc.moduleMgr.playerModule.module.Role){
                this.nodeN.roleChangeBtn.node.active = true
            }
        }else{
            let shopConf = cc.config("shop")
            for (let i = 0;i<shopConf[6].items.length;i++){
                if (shopConf[6].items[i] == roleConf[id].item){
                    this.shopIndex = i
                    this.nodeN.unlockBtn.node.active = true
                    //this.nodeN.roleChangeBtn.node.getChildByName("desc").getComponent(cc.Label).string = "解锁"+shopConf[6].price[i]
                    break
                }
            }
        }
    }
}