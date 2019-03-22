
var gameStates = {
    unStart: 0,//游戏未开始
    showing: 1,//游戏正准备开始，动画结束才真正开
    starting: 3,//游戏在进行中
    paused: 4//游戏暂停
}


cc.Class({
    extends: cc.Component,

    properties: {

        role: {
            default: null,
            type: cc.Node
        },
        boxesMgr: {
            default: null,
            type: cc.Node
        },
        atlasGame: {
            default: null,
            type: cc.SpriteAtlas
        },
    },

    // use this for initialization
    onLoad: function () {

        //游戏当前的状态
        this.currentGameState = gameStates.unStart;

        //游戏内的玩家角色脚本
        this.roleJS = this.role.getComponent('role');
        //游戏内的boxes管理脚本
        this.boxesMgrJS = this.boxesMgr.getComponent('boxesMgr');
    },

    start: function () {
        var self = this;



        this.node.on(cc.Node.EventType.TOUCH_START, function (touch) {
            var touchPosition = touch.getLocation();

            switch (self.currentGameState) {
                case gameStates.unStart:
                    self.currentGameState = gameStates.showing;
                    self.showingGame();
                    break;

                case gameStates.showing:
                    break;
                case gameStates.starting:
                    //游戏已经开始，点击屏幕是改变方向
                    self.roleJS.changeDir(touchPosition);
                    break;
                case gameStates.paused:

                    break;
            }

        }, this);

    },

    //获取精灵图片
    getGameFrame_sf: function (name) {
        let sf = this.atlas_game.getSpriteFrame(name);
        if (!sf)
            sf = this.atlas_game.getSpriteFrame("zz01");
        return sf;
    },

    // called every frame
    update: function (dt) {

    },

    showingGame: function () {
        let self = this;
        //1发送事件通知ui层做动画，ui层将动画做完给我回调，然后改变游戏状态
        //2发送事件通知boxesMgr做初始生成动画
        //以上双层回调后执行以下代码
        console.log("showing game");
        //现在直接执行将来ui回调后的代码


        this.boxesMgrJS.initBoxes(function () {
            self.currentGameState = gameStates.starting;
            self.roleJS.beginJump();
        });
    },



    startGame: function () {
        console.log("游戏开始了");
    }

});
