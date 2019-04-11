const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class UIMgr extends cc.Component {
    stack = new Array()
    onLoad(){
        
    }
    start() {
       console.log("!!")
    }
    update(){}
    onClickBtn(event, customeData) {
        if (event.target) {
            let btnN = event.target.name;
            if (btnN == "closeBtn") {
                //console.log(this.node.name)
            }else if (btnN == "addBtn"){
              
            }
        }
    }
    pop(){
        //console.log(this.stack.length)
        let name = "null"
        if (this.stack.length > 0){
            name = this.stack[this.stack.length-1].name
            this.stack[this.stack.length-1].destroy()
            this.stack.pop()
            if (this.stack.length > 0){
                this.stack[this.stack.length-1].active = true
            }
        }
        window.Notification.emit("UIMgr_pop",{length:this.stack.length,name:name})
    }
    Push(name,data,par){
        let _parentName = "Canvas/UI2d"
        let _parentObj = null
        let add = true//是否加载至堆栈存储
        let isCover = false//是否覆盖当前堆栈UI
        if(par){
            //console.log(name,par)
            if(par.parentName){
                _parentObj = cc.find(par.parentName)
            }else if(par.parentObj){
                _parentObj = par.parentObj
            }else{
                _parentObj = cc.find(_parentName)
            }
            if (par.add != null){
                add = par.add
            }
            isCover = par.isCover != null ? par.isCover : false
        }else{
            _parentObj = cc.find(_parentName)
        }
        let _Prefab = cc.tools.getPrefab(name)
        let Prefab = cc.Prefabs(name)
        if (_Prefab){
            return this.loadPrefab(name,data,{add:add,parentObj:_parentObj,isCover:isCover},_Prefab)
        }else if (Prefab){
            return this.loadPrefab(name,data,{add:add,parentObj:_parentObj,isCover:isCover},Prefab)
        }else{
            let self = this
            cc.loader.loadRes('prefab/'+name, function (err, prefab) {
                if (err) {
                    console.log(err,name)
                    //cc.error(err.message || err);
                    return;
                }
                
                //cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
                self.loadPrefab(name,data,{add:add,parentObj:_parentObj,isCover:isCover},prefab)
            })
            return null
        }
    }
    loadPrefab(name,data,parameter,prefab){
        if (!parameter || !prefab){
            return
        }
        let nodeCN = cc.instantiate(prefab);
        //let parent = this.node.getComponent("")
        if (parameter.parentName){
            cc.find(parameter.parentName).addChild(nodeCN);
        }
        if (parameter.parentObj){
            parameter.parentObj.addChild(nodeCN)
        }
        
        if (parameter.add){
            if(this.stack.length > 0){
                console.log(parameter.isCover)
                if (parameter.isCover){
                    this.stack[this.stack.length-1].destroy()
                    this.stack.pop()
                }else{
                    this.stack[this.stack.length-1].active= false
                }
            }
            this.stack.push(nodeCN)
            window.Notification.emit("UIMgr_push",{length:this.stack.length,name:name,data:data})
        }else{
            window.Notification.emit("UIMgr_loadPrefab",{length:this.stack.length,name:name,data:data})
        }
        if (parameter.audio){
            cc.audioMgr.playEffect("UI");
        }
        if (parameter.pos){
            nodeCN.position = parameter.pos
        }
        try {
            if (cc.js.getClassByName(name)){
                nodeCN.addComponent(name).localInit(data)
            }
        }catch(err){
            console.log(name,err)
        }
        return nodeCN
        //nodeCN.addComponent("test").localInit({name :"张三",id:9527})
    }
    
}