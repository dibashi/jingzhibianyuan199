const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class tipsFrame extends cc.Component {
    onLoad(){
        //console.log("onLoad")
        //cc.audioMgr.playEffect("UI");
    }
    localInit(data){
        this.data = data
        this.nodeN = {}
        this.nodeN.desc = this.node.getChildByName("desc").getComponent(cc.Label)
    }
    start() {
        let self = this
        this.nodeN.desc.string = this.data
        
        let action = cc.moveTo(1, cc.v2(0,this.node.position.y+150))
        let action2 = cc.fadeOut(1.0)
        let together = cc.spawn(action, action2)
        let seq = cc.sequence(cc.delayTime(0.5),together, cc.callFunc(function(){
            //console.log("!")
            self.node.destroy()
        }))
        this.node.runAction(seq)
    }
    update(){}
}