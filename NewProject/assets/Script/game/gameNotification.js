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
            this.gameJS.startGame();
        },this)
        Notification.on("reliveGame",function(arg){
            this.gameJS.reliveGame();
        },this)
    }
}