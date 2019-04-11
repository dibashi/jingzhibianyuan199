const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class GameOverFrame extends cc.Component {
    onLoad() {
        cc.moduleMgr.playerModule.module.score = cc.moduleMgr.tempModule.module.score
        cc.moduleMgr.tempModule.module.ReliveCount += 1;
        cc.audioMgr.pauseBg();
        cc.audioMgr.resumeBg("bg");
    }
    localInit(data) {
        this.data = data
    }
    start() {
        let self = this
        this.nodeN = {}
        this.nodeN.bg = this.node.getChildByName("bg")
        this.nodeN.nowscore = this.node.getChildByName("nowscore").getComponent(cc.Label)
        this.nodeN.oldscore = this.node.getChildByName("oldscore").getComponent(cc.Label)
        this.nodeN.hallBtn = this.node.getChildByName("hallBtn").getComponent("ClickEventListener")
        this.nodeN.resetBtn = this.node.getChildByName("resetBtn").getComponent("ClickEventListener")

        this.nodeN.hallBtn.onClick = function () {
            cc.moduleMgr.tempModule.module.ReliveCount = 0
            Notification.emit("hallcallBack")
            self.node.destroy()
        }
        this.nodeN.resetBtn.onClick = function () {
            let relive = cc.config("param")[1].relive
            if (cc.moduleMgr.tempModule.module.ReliveCount <= relive) {
                self.Relive()
            } else {
                let itemConf = cc.config("item")
                let expend = Math.pow(2, cc.moduleMgr.tempModule.module.ReliveCount - 1)
                let fun = function () {
                    if (cc.moduleMgr.itemModule.ItemCount(1000) >= expend) {
                        let Items = []

                        let id = 1000
                        let count = cc.moduleMgr.itemModule.ItemCount(id) - expend
                        Items.push({ id: id, count: count })

                        cc.moduleMgr.itemModule.AddOrUpdateDatas(Items)

                        self.Relive()
                    } else {
                        cc.tools.showlog(itemConf[1000].name + "不足，这里方便测试，货币不足也让你复活")
                        self.Relive()//这里方便测试，货币不足也让你复活
                    }
                }
                cc.tools.showchoose({ desc: "是否消耗" + expend + itemConf[1000].name + "复活", fun: fun })
            }
        }
        cc.tools.changeSprite(this.nodeN.bg, "bg/cj0" + cc.moduleMgr.tempModule.module._bg_Color)
        this.nodeN.nowscore.string = cc.moduleMgr.playerModule.module.score
        this.nodeN.oldscore.string = cc.moduleMgr.playerModule.module.OldScore
    }
    Relive() {
        this.node.destroy()
        Notification.emit("reliveGame")
    }
}