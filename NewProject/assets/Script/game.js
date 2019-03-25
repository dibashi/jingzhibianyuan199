
var gameStates = {
    unStart: 0,//游戏未开始
    showing: 1,//游戏正准备开始，动画结束才真正开
    starting: 3,//游戏在进行中
    paused: 4//游戏暂停
}

//有一首可以用的不错的背景歌，wolfred
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
        gameCamera: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

        //游戏当前的状态
        this.currentGameState = gameStates.unStart;

        //游戏内的玩家角色脚本
        this.roleJS = this.role.getComponent('role');
        //游戏内的boxes管理脚本
        this.boxesMgrJS = this.boxesMgr.getComponent('boxesMgr');

        this._hasFoot = true;
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

    hasFoot:function() {
        return this._hasFoot;
    },

     //获取精灵图片
    getGameFrame_sf: function (name) {
        let sf = this.atlasGame.getSpriteFrame(name);
        if (!sf)
            sf = this.atlasGame.getSpriteFrame("zz01");
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
            
            self.boxesMgrJS.beginDrop();

        });
    },


    lateUpdate(dt) {
        if (this.currentGameState === gameStates.starting) {
            var dx = this.roleJS.aimX - this.gameCamera.x;

            let moveX = BoxX * dt / (this.roleJS.jumpSpeed);
            let moveY = BoxY * dt / (this.roleJS.jumpSpeed);

            if (moveY + this.gameCamera.y > this.roleJS.aimY) {
                moveY = this.roleJS.aimY - this.gameCamera.y;
            }

            if (dx > 0) {
                if (moveX + this.gameCamera.x > this.roleJS.aimX) {
                    moveX = this.roleJS.aimX - this.gameCamera.x;
                }
            } else {
                moveX *= -1;
                if (moveX + this.gameCamera.x < this.roleJS.aimX) {
                    moveX = this.roleJS.aimX - this.gameCamera.x;
                }
            }

            this.gameCamera.x += moveX;
            this.gameCamera.y += moveY;


        }
    }

});
