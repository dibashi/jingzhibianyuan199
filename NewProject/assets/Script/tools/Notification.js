import UIMgr from 'UIMgr';
import ModuleMgr from 'ModuleMgr';
import Tools from 'Tools';
import NewWebSocket from 'NewWebSocket';
import AppInterface from 'AppInterface';
import ClientCmder from 'ClientCmder';
const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class Notification extends cc.Component {
    @property(cc.Prefab)
    prefabs = []
    onLoad(){
        //console.log("onLoad")
        // 全局通知
        window.Notification = {
            _eventMap: [],

            on: function(type, callback, target) {
                if (this._eventMap[type] === undefined) {
                    this._eventMap[type] = [];
                }
                this._eventMap[type].push({ callback: callback, target: target });
            },

            emit: function(type, parameter) {
                let array = this._eventMap[type];
                if (array === undefined) return;
                
                for (let i = 0; i < array.length; i++) {
                    let element = array[i];
                    if (element){
                        //console.log(element.target)
                        if (cc.isValid(element.target)){
                            element.callback.call(element.target, parameter);
                        }else{
                            array[i] = undefined
                        }
                    } 
                }
            },

            off: function(type, callback) {
                let array = this._eventMap[type];
                if (array === undefined) return;

                for (let i = 0; i < array.length; i++) {
                    let element = array[i];
                    if (element && element.callback === callback) {
                        array[i] = undefined;
                        break;
                    }
                }
            },


            //李浩添加：用于取消某个对象身上的某个事件派发
            off_target: function(type, target) {
                let array = this._eventMap[type];
                if (array === undefined) return;

                for (let i = 0; i < array.length; i++) {
                    let element = array[i];
                    if (element && element.target === target) {
                        array[i] = undefined;
                        break;
                    }
                }
            },

            offType: function(type) {
                this._eventMap[type] = undefined;
            },
        };
        if (!cc.uiMgr) {
            cc.uiMgr = new UIMgr()
        }
        if (!cc.moduleMgr) {
            cc.moduleMgr = new ModuleMgr()
            cc.moduleMgr.InitModule()
        }
        if (!cc.tools) {
            cc.tools = new Tools()
        }
        if(!cc.NewWebSocket){
            cc.NewWebSocket = new NewWebSocket()
        }
        if(!cc.AppInterface){
            cc.AppInterface = new AppInterface()
        }
        if(!cc.ClientCmder){
            cc.ClientCmder = new ClientCmder()
        }
        cc.game.addPersistRootNode(this.node);
    }
    getPrefab(name){
        for(let i = 0;i<this.prefabs.length;i++){
            //console.log(this.prefabs[i])
            if (this.prefabs[i].name == name){
                return this.prefabs[i]
            }
        }
        return null
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start() {
        this.getPrefab()
        //console.log("start")
        //cc.uiMgr.loadPrefab("controller",{},{add:false,parentName:"Canvas/UI2d"})
        //cc.uiMgr.loadPrefab("ReturnHall",{},{add:false,parentName:"Canvas/UI2dUp"})
    }
    update(){}
}