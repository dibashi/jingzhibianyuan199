
var gameStates = {
    unStart: 0,//游戏未开始
    preparing: 1,//游戏准备开始
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
        },

        debugUI: {
            default: null,
            type: cc.Node
        },

        node_streak: {
            default: null,
            type: cc.Node
        },
        node_hint: {
            default: null,
            type: cc.Node
        },
        skillBtnNode: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {

        // //游戏当前的状态
        this.currentGameState = gameStates.unStart;

        //游戏内的玩家角色脚本
        this.roleJS = this.role.getComponent('role');
        //游戏内的boxes管理脚本
        this.boxesMgrJS = this.boxesMgr.getComponent('boxesMgr');

        this._hasFoot = true;
        this._hasStreak = true;



        this.skillBtnNode.active = false;
    },

    start: function () {

        Notification.on("hallcallBack", function () {

            this.boxesMgrJS.prepareStart();

        }.bind(this), this);
    },

    openTouch: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.gameStateSwitch, this);
    },

    gameStateSwitch: function (touch) {
        var touchPosition = touch.getLocation();

        switch (this.currentGameState) {

            case gameStates.preparing:

                this.boxesMgrJS.beginDrop();
                this.currentGameState = gameStates.starting;
                this.node_hint.active = false;
                this.roleJS.changeDir(touchPosition);
                this.roleJS.jump();
                break;


            case gameStates.starting:
                if (this.roleJS.roleType !== RoleType.normalType) {
                    this.skillBtnNode.active = true;
                    this._skillActive = true;
                }

                this.roleJS.changeDir(touchPosition);
                this.roleJS.jump();
                break;
            case gameStates.paused:

                break;
        }
    },

    closeTouch: function () {
        this.node.off(cc.Node.EventType.TOUCH_START, this.gameStateSwitch, this);
    },

    hasFoot: function () {
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


    startGame: function () {

        cc.moduleMgr.tempModule.module.score = 0;

        this.boxesMgrJS.prepareStart();
        this.roleJS.prepareStart();

        this.gameCamera.position = cc.v2(0, 0);

        this.boxesMgrJS.initBoxes(function () {
            this._startGame();

        }.bind(this));
    },
    _startGame: function () {

        this.openTouch();
        this.node_hint.active = true;
        this.role.active = true;
        this.currentGameState = gameStates.preparing;


        if (this._hasStreak) {
            this.node_streak.position = cc.v2(this.roleJS.node.x, this.roleJS.node.y + 54);
            this.node_streak.active = true;
        }
    },

    addDifficulty: function () {
        this.roleJS.reduceJumpTime();
        this.boxesMgrJS.reduceDropTime();
    },

    gameOver: function () {
        this.closeTouch();
        this.boxesMgrJS.pauseDrop();

        this.skillBtnNode.active = false;
        this.node_streak.active = false;

        this.currentGameState = gameStates.unStart;
    },


    reliveGame: function () {
        this.roleJS.relive();

        var resultBoxJS = this.boxesMgrJS.getJumpedInfo(this.roleJS.aimX, this.roleJS.aimY);


        if (resultBoxJS && resultBoxJS.boxType === BoxType.normalBox) {
            //不用变 原地即可

            this.role.x = this.roleJS.aimX;
            this.role.y = this.roleJS.aimY;
            this.gameCamera.x = this.roleJS.aimX;
            this.gameCamera.y = this.roleJS.aimY;
            this._startGame();
        } else {

            this.role.opacity = 0;
            var fadeIn = cc.fadeIn(1.2);
            var moveBy = cc.moveBy(1.2, cc.v2(0, 400));
            moveBy.easing(cc.easeOut(1.2));
            this.role.runAction(cc.sequence(cc.spawn(fadeIn, moveBy), cc.callFunc(this._startGame, this)))


            var fadeIn1 = cc.fadeIn(1.2);
            var moveBy1 = cc.moveBy(1.2, cc.v2(0, 400));
            moveBy1.easing(cc.easeOut(1.2));

            this.boxesMgrJS.boxQueue[this.boxesMgrJS.boxQueue.length - 1][0].runAction(cc.spawn(fadeIn1, moveBy1));


        }

    },



    lateUpdate(dt) {
        if (this.currentGameState === gameStates.starting) {
            var dx = this.roleJS.aimX - this.gameCamera.x;
            var dy = this.roleJS.aimY - this.gameCamera.y;

            let moveX = 0;
            let moveY = 0;
            if (dx !== 0) {
                moveX = dx * dt / CameraFollewTime;
            }

            if (dy != 0) {
                moveY = dy * dt / CameraFollewTime;
            }

            this.gameCamera.x += moveX;
            this.gameCamera.y += moveY;
            if (this._hasStreak) {
                this.node_streak.position = cc.v2(this.roleJS.node.x, this.roleJS.node.y + 54);
            }

        }
    },

    skillComplete: function () {
        console.log("技能好了！！！！！！！！！！");
        this._skillActive = true;
    },

    skillClick: function () {

        if(this._skillActive === false) {
            return ;
        }


        let id = cc.moduleMgr.playerModule.module.Role
        let skillconf = cc.moduleMgr.playerModule.GetRoleSkill(id);
        // {cd:conf.cd 

        // ,icon:conf.icon,duration:conf.duration}

        switch (this.roleJS.roleType) {
            case RoleType.accelerateType:

                this.roleJS.accelerateAndPathfinding(0.15, Math.ceil(skillconf.duration / 0.15));
                Notification.emit("skillShowTime");
                this._skillActive = false;
                this.scheduleOnce(this.skillComplete, skillconf.cd);
                break;

            case RoleType.slowDownType:
                this.boxesMgrJS.slowDownDrop(5, skillconf.duration);
                Notification.emit("skillShowTime");
                this._skillActive = false;
                this.scheduleOnce(this.skillComplete, skillconf.cd);
                break;

            default:
                debugger;
                break;
        }
    }

});
