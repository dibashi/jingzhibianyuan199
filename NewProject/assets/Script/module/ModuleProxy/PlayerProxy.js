import PlayerModule from 'PlayerModule';
export default class PlayerProxy{
    DataModule = null
    Reset(){
        this.DataModule = null
    }
    get module(){
        return this.DataModule
    }
    set module(value){}
    AddOrUpdateDatas(data){
        if(data){
            for(let i = 0;i<data.length;i++){
                this.AddOrUpdateSimpleData(data[i])
            }
        }
    }
    AddOrUpdateSimpleData(data){
        if (data){
            if(this.DataModule){
                this.DataModule.constructor(data)
            }else{
                this.DataModule = new PlayerModule(data)
            }
            cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
        }
    }
    UpdateScore(data){
        this.module.score += data.score
        let stageConf = cc.config("stage")
        if (stageConf[this.module.score]){
            if (stageConf[this.module.score].desc != 0){
                //cc.tools.showlog("御赐华服")
                this.module.body = stageConf[this.module.score].desc
                cc.uiMgr.Push("imperialEdictFrame",{type:1},{add:false,parentName:"Canvas/UI2dTop"})
            }
            if (stageConf[this.module.score].house != 0){
                //cc.tools.showlog("御赐豪宅")
                this.module.house = stageConf[this.module.score].house
                cc.uiMgr.Push("imperialEdictFrame",{type:3},{add:false,parentName:"Canvas/UI2dTop"})
            }
            if (stageConf[this.module.score].earrings != 0){
                //cc.tools.showlog("御赐饰品")
                this.module.earrings = stageConf[this.module.score].earrings
                let equipConf = cc.config("equip")
                cc.uiMgr.Push("imperialEdictFrame",{type:2,desc:equipConf[cc.moduleMgr.playerModule.module.earrings].type_desc+"一对"},{add:false,parentName:"Canvas/UI2dTop"})
            }
            if (stageConf[this.module.score].item != 0){
                let itemConf = cc.config("item")
                //cc.tools.showlog("御赐"+itemConf[stageConf[this.module.score].item].name)
                cc.AppInterface.ItemChange(stageConf[this.module.score].item, stageConf[this.module.score].count)
                let desc = ""
                if(itemConf[stageConf[this.module.score].item].type == 1 ){
                    desc = "白银"+stageConf[this.module.score].count+"两"
                }else if (itemConf[stageConf[this.module.score].item].type == 2 ){
                    desc = itemConf[stageConf[this.module.score].item].name+"一幅"
                }
                cc.uiMgr.Push("imperialEdictFrame",{type:4,desc:desc,conf:itemConf[stageConf[this.module.score].item]},{add:false,parentName:"Canvas/UI2dTop"})
            }
            Notification.emit("UpdateHeroChange")
        }
        cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
    }
    UpdateTime(time){
        this.module.time = time
        cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
    }
    UpdateTitle(arg){
        this.module.title = arg
        Notification.emit("UpdateTitleChange")
        cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
        cc.tools.showlog("更换成功")
    }
    // UpdateBody(arg){
    //     this.module.body = arg
    //     cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
    // }
    // UpdateEarrings(arg){
    //     this.module.earrings = arg
    //     cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
    // }
    // UpdateHouse(arg){
    //     this.module.house = arg
    //     cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
    // }
}