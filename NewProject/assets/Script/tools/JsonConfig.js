export default class JsonConfig{
    constructor(jsonName) {
        this.start(jsonName)
    }
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start(list) {
        let self = this
        this.config = []
        this.loadjson(list,0)
    }
    loadjson(namelist,i){
        if (!namelist[i]){
            return
        }
        let name = namelist[i]
        let self = this
        window.Notification.emit("loadjsonTips",{name:name})
        cc.loader.loadRes("jsonConfig/"+name, function(err,res){
            if (err) {
                cc.log(err);
            }else{
                let list=res;
                //cc.log(Object.keys(list.json));
                //cc.log(list);
                //cc.log(Date.now())
                self.config[name] = list.json
                window.Notification.emit("loadjsonSuccess",{name:name,progress:namelist.length})
                self.loadjson(namelist,i+1)
            }
        })
    }
    SaveJsonData(data){

    }
    update(){

    }
}