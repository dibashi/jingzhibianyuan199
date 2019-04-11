import SkillModule from 'SkillModule';
export default class SkillProxy{
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
            cc.sys.localStorage.setItem('SkillModule', JSON.stringify(this.DataIndex));
            Notification.emit("SkillModuleUpdate")
        }
    }
    AddOrUpdateSimpleData(data){
        if (data){
            if(this.DataModule[data.id]){
                this.DataModule[data.id].constructor(data)
                this.DataIndex[this.DataModule[data.id].index] = this.DataModule[data.id]._Data
            }else{
                this.DataModule[data.id] = new SkillModule(data,this.DataIndex.length)
                this.DataIndex[this.DataIndex.length] = this.DataModule[data.id]._Data
            }
        }
    }
    SkillLv(id){
        if (this.DataModule && this.DataModule[id]){
            return this.DataModule[id].lv
        }else{
            return 1
        }
    }
}