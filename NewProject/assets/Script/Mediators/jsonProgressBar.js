
import LoadResPrefab from 'LoadResPrefab';
import JsonConfig from 'JsonConfig';
const {
    ccclass,
    property
} = cc._decorator;

@ccclass

export default class jsonProgressBar extends cc.Component {
    is_scene = false
    is_json = false
    is_prefab = false
    onLoad(){
        this.jsonName = ["role",
                        "item",
                        "param",
                        "skills",
                        "language"]
        this.PrefabName = ["GameOverFrame",
                            "HeroShowFrame",
                            "hallFrame"]
    }
    start() {
        let self = this
        cc.director.preloadScene("main", this.callLoadBack);
        this.now_progress = 0
        this.Max_progress = this.jsonName.length + this.PrefabName.length
        
        window.Notification.on("loadjsonTips",function(data){
            self.node.getChildByName("desc").getComponent(cc.Label).string = "正在加载配置表:"+data.name+"Config"
        },this)
        window.Notification.on("loadjsonSuccess",function(data){
            self.now_progress = self.now_progress + 1
            //console.log(self.now_progress,self.Max_progress)
            self.node.getComponent(cc.ProgressBar).progress = self.now_progress/self.Max_progress
            //console.log(data.name+" "+data.progress)
            if (self.now_progress == data.progress){
                self.scheduleOnce(function(){
                    self.node.getChildByName("desc").getComponent(cc.Label).string = "配置表:Success"
                    self.is_json = true
                    self.loadData()
                },0.5)
            }
        },this)
        window.Notification.on("loadSceneSuccess",function(data){
            self.is_scene = true
            self.loadData()
        },this)
        window.Notification.on("loadPrefabTips",function(data){
            self.node.getChildByName("desc").getComponent(cc.Label).string = "正在加载Prefab:"+data.name
        },this)
        window.Notification.on("loadPrefabSuccess",function(data){
            self.now_progress = self.now_progress + 1
            self.node.getComponent(cc.ProgressBar).progress = self.now_progress/self.Max_progress
            //console.log(data.name+" "+data.progress)
            if (this.now_progress == this.Max_progress){
                self.scheduleOnce(function(){
                    self.node.getChildByName("desc").getComponent(cc.Label).string = "Prefab:Success"
                    self.is_prefab = true
                    self.loadData()
                },0.5)
            }
        },this)
        if (this.Max_progress == 0){
            this.node.getComponent(cc.ProgressBar).progress = 1
            this.node.getChildByName("desc").getComponent(cc.Label).string = "Success"
            this.is_scene = true
            this.is_json = true
            this.is_prefab = true
            this.loadData()
        }
    }
    loadData(){
        if (this.is_json && this.is_scene && this.is_prefab){
            cc.director.loadScene("main");
            //this.node.parent.active = false
            
            //cc.uiMgr.Push("hallFrame",{},{add:false,parentName:"Canvas/UI2d/root"})

            //cc.uiMgr.Push("hallFrame",{},{add:false})
        }
        if (this.is_scene){
            if (!cc.config) {
                let conf = new JsonConfig(this.jsonName)
                cc.config = function(name){
                    return conf.config[name]
                }
            }
        }
        if(this.is_json){
            if (!cc.Prefabs) {
                let Pre = new LoadResPrefab(this.PrefabName)
                cc.Prefabs = function(name){
                    return Pre.prefabs[name]
                }
            }
        }
    }
    callLoadBack(ret) {
        console.log("--- loadBack ---");
        //console.log(ret);
        //cc.director.loadScene("Game");
        Notification.emit("loadSceneSuccess")
    }
}