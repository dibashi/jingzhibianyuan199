export default class LoadResPrefab{
    constructor(Name) {
        this.start(Name)
    }
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start(list) {
        let self = this
        this.prefabs = []
        this.loadPrefab(list,0)
    }
    loadPrefab(namelist,i){
        if (!namelist[i]){
            return
        }
        let name = namelist[i]
        let self = this
        window.Notification.emit("loadPrefabTips",{name:name})
        cc.loader.loadRes("prefab/"+name, function(err,prefab){
            if (err) {
                cc.log(err);
            }else{
                //cc.log(Object.keys(list.json));
                //cc.log(list);
                //cc.log(Date.now())
                self.prefabs[name] = prefab
                window.Notification.emit("loadPrefabSuccess",{name:name,progress:namelist.length})
                self.loadPrefab(namelist,i+1)
            }
        })
    }
}