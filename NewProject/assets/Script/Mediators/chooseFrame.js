const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class chooseFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
    }
    localInit(data){
        this.data = data
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.title = this.node.getChildByName("title").getComponent(cc.Label)
        this.nodeN.desc = this.node.getChildByName("desc").getComponent(cc.Label)
        this.nodeN.yBtn = this.node.getChildByName("yBtn").getComponent("ClickEventListener")
        this.nodeN.nBtn = this.node.getChildByName("nBtn").getComponent("ClickEventListener")
        this.nodeN.title.string = this.data.title ? this.data.title : "提示"
        this.nodeN.desc.string = this.data.desc
        this.nodeN.yBtn.onClick = function(){
            self.data.fun()
            self.node.destroy()
        }
        this.nodeN.nBtn.onClick = function(){
            self.node.destroy()
        }
    }
}