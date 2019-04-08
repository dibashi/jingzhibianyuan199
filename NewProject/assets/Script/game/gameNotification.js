const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class gameNotification extends cc.Component {
    onLoad(){}
    start() {
        this.gameJS = this.node.getComponent('game');
        Notification.on("GameStart",function(arg){
            let conf = cc.tools.Getcheckpoint(1)
            this.gameJS.startGame(conf);
            //Notification.emit("skillShowTime", { id:  conf.skill});
        },this)
        Notification.on("reliveGame",function(arg){
            this.gameJS.reliveGame();
        },this)
    }
}