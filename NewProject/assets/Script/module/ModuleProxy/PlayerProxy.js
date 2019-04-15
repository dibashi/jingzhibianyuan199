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
                Notification.emit("PlayerModuleUpdate")
            }else{
                this.DataModule = new PlayerModule(data)
            }
            cc.sys.localStorage.setItem('PlayerModule', JSON.stringify(this.DataModule._playerData));
        }
    }
    GetRoleSkill(id){
        let roleConf = cc.config("role")
        if (roleConf[id] ){
            let skilConf = this.GetSkill(roleConf[id].skills)
            let skillLv = cc.moduleMgr.skillModule.SkillLv(roleConf[id].skills)
            if(skilConf){
                let duration = (skillLv-1) * (skilConf.duration*skilConf.increase) + skilConf.duration
                return {id:skilConf.id,cd:skilConf.cd,icon:skilConf.icon,duration:duration,conf:skilConf,type:skilConf.type}
            }
        }
        return {}
    }
    GetSkill(id){
        let skilConf = cc.config("skills")
        if(skilConf[id]){
            return skilConf[id]
        }
        return null
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