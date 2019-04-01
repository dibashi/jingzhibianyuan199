import ItemModule from 'ItemModule';
export default class ItemProxy{
    DataModule = []
    DataIndex = []
    Reset(){
        this.DataModule = []
        this.DataIndex = []
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
            cc.sys.localStorage.setItem('ItemModule', JSON.stringify(this.DataIndex));
            window.Notification.emit("ItemModuleUpdate")
        }
    }
    AddOrUpdateSimpleData(data){
        if (data){
            if (data.count > 0){
                if(cc.moduleMgr.tempModule.module.is_hall){
                    let itemConf = cc.config("item")
                    if (itemConf[data.id] && itemConf[data.id].type == 4  && this.DataModule[data.id] && data.count > this.DataModule[data.id].count){
                    //出发开箱通知
                        window.Notification.emit("OpenBoxMessage",{item_id:data.id,count:1})
                    }
                }
            }
            if(this.DataModule[data.id]){
                this.DataModule[data.id].constructor(data)
                this.DataIndex[this.DataModule[data.id].index] = this.DataModule[data.id]._Data
            }else{
                this.DataModule[data.id] = new ItemModule(data,this.DataIndex.length)
                this.DataIndex[this.DataIndex.length] = this.DataModule[data.id]._Data
            }
            //this.DataIndex = []
            //console.log(this.DataModule[data.id]._Data)
            //cc.sys.localStorage.setItem('ItemModule', JSON.stringify(this.DataIndex));
        }
    }
    ItemCount(id){
        if (this.DataModule && this.DataModule[id]){
            return this.DataModule[id].count
        }else{
            return 0
        }
    }
    get warehouseList(){
        let list = []
        let itemConf = cc.config("item")
        for(let key in this.DataModule){
            let id = this.DataModule[key].id
            if (itemConf[id]){
                if (itemConf[id].type == 2 || itemConf[id].type == 5 || itemConf[id].type == 4 || itemConf[id].type == 6){
                    //植物或宝箱、自动礼包，手动礼包
                    list.push(this.DataModule[key])
                }
            }
        }
        return list
    }

   
}