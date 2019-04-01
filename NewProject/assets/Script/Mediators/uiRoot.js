const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class uiRoot extends cc.Component {
    @property(cc.SpriteFrame)
    pictures = []
    start(){
        this.nodeN = {}
        this.nodeN.node_box = this.node.getChildByName("node_box")
        Notification.on("randomBgColorChange",function(arg){
            this.node.getChildByName("hero_box").getChildByName("spr_box").getComponent(cc.Sprite).spriteFrame = this.pictures[cc.moduleMgr.tempModule.module._bg_Color-1]

            for (let i = 0;i<this.nodeN.node_box.childrenCount;i++){
                if(this.nodeN.node_box.children[i]){
                    this.nodeN.node_box.children[i].getComponent(cc.Sprite).spriteFrame = this.pictures[cc.moduleMgr.tempModule.module._bg_Color-1]
                }
            }
        },this)
        for (let i = 0; i < this.nodeN.node_box.children.length; ++i) {
            let nodeN = this.nodeN.node_box.children[i];
            let randY = Math.random() * 20 + 10;
            nodeN.runAction(cc.repeatForever(cc.sequence(cc.moveBy(1.8 + Math.random() * 2, cc.v2(0, randY)), cc.moveBy(1.2 + Math.random() * 2, cc.v2(0, -randY)))));
        }
    }
    start_root_stop(){
        this.node.active = false
        Notification.emit("GameStart")
    }
}