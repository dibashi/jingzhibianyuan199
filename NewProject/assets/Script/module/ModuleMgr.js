import PlayerProxy from 'PlayerProxy';
import ItemProxy from 'ItemProxy';
import SkillProxy from 'SkillProxy';
import TempProxy from 'TempProxy';
export default class ModuleMgr{
    tempModule = new TempProxy()
    playerModule = new PlayerProxy()
    itemModule = new ItemProxy()
    skillModule = new SkillProxy()
    InitModule(){
        this.playerModule.AddOrUpdateSimpleData(JSON.parse(this.module('PlayerModule')))
        //console.log(JSON.parse(cc.sys.localStorage.getItem('ItemModule')))
        this.itemModule.AddOrUpdateDatas(JSON.parse(this.module('ItemModule')))
        this.skillModule.AddOrUpdateDatas(JSON.parse(this.module('SkillModule')))
    }
    module(name){
        let temp = cc.sys.localStorage.getItem(name)
        if (!temp){
            return null
        }
        return temp
    }
}