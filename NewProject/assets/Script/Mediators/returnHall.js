const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class returnHall extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        cc.uiMgr.Push("hallFrame",{},{add:false,parentName:"Canvas/UI2d/root"})
    }
    start() {
        this.nodeN = {}
       
        let self = this
        window.Notification.on("UIMgr_pop",function(data){
            self.node.getChildByName("closeBtn").active = data.length > 0 ? true : false
        },this)
        window.Notification.on("UIMgr_push",function(data){
            self.node.getChildByName("closeBtn").active = data.length > 0 ? true : false
        },this)
        window.Notification.on("loadcloudchange",function(data){
            if(data.type == 1){
                self.node.getChildByName("loadingNode").getComponent(cc.Animation).play("loading");
            }else if(data.type == 2){
                self.node.getChildByName("loadingNode").getComponent(cc.Animation).play("loading2");
            }else{

            }
        },this)
        //console.log("start -> controller")
        this.node.getChildByName("closeBtn").getComponent("ClickEventListener").onClick = function(){
            cc.uiMgr.pop()
            Notification.emit("cameraMove",{type:0,fun:function(){
                
            }})
            //console.log("!!!"+event.target.name)
            //cc.uiMgr.Push("orangeFrame",{name :"李四",id:7788})
        }
        
        this.loadData()
    }
    loadData(){
        
    }
    update(){}
}