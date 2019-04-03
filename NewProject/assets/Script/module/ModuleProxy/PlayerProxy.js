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