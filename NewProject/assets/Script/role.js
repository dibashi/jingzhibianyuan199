cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {



        this.boxesMgrJS = cc.find('Canvas/game/boxes_mgr').getComponent('boxesMgr');
        this.gameJS = cc.find('Canvas/game').getComponent('game');

        this.prepareStart();
    },

    start: function () {


    },

    prepareStart: function () {
        this.curDir = BoxDir.right;
        this.node.x = 0;
        this.node.y = 0;
        this.aimX = 0;
        this.aimY = 0;
        this.jumpSpeed = 1;
        this.node.opacity = 255;
        this.node.zIndex = 1;
    },

    // called every frame
    update: function (dt) {

    },

    changeDir: function (touchPosition) {
        this.curDir = (this.curDir === BoxDir.right ? BoxDir.left : BoxDir.right);
    },


    beginJump: function () {
        console.log("开始跳跃");
        this.jump();
        this.schedule(this.jump, this.jumpSpeed);

    },

    pauseJump: function () {
        this.unschedule(this.jump);
    },

    jump: function () {


        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + (this.curDir === BoxDir.right ? 1 : -1) * BoxX;

        this.node.scaleX = (this.curDir === BoxDir.right ? 1 : -1);

        this.node.stopAllActions();

        var resultBoxType = this.boxesMgrJS.getJumpedInfo(aimX, aimY, this.aimX, this.aimY, this.curDir);

        // this.aimX = jumpedInfo.aimX;
        // this.aimY = jumpedInfo.aimY;

        if (resultBoxType === BoxType.normalBox) {
            this.aimX = aimX;
            this.aimY = aimY;

            this.jumpAinmation();
            this.boxesMgrJS.createBox();

            this.gameJS.addCurrentScore(1);
        } else if (resultBoxType === BoxType.blockBox) {
            var jumpY = aimY;
            var jumpX = aimX + (this.curDir === BoxDir.right ? -10 : 10);
            this.dizzyAnimation(function () {
                this.changeDir();
                this.beginJump();
                this.gameJS.openTouch();
            }.bind(this), jumpX, jumpY);

        } else if (resultBoxType === BoxType.noneBox) {
            //悬崖，阵亡了
            var jumpY = aimY;
            var jumpX = aimX;
            this.cliffJumping(function () {
                console.log("跳崖动作执行完毕");
                //发送消息游戏结束

            }.bind(this), aimX, aimY);

        }

    },

    jumpAinmation: function (callback) {
        var jumpAction = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), 100, 1);
        var resultAction = jumpAction;
        if (callback) {
            resultAction = cc.sequence(jumpAction, cc.callFunc(callback, this));
        }
        this.node.runAction(resultAction);
    },

    dizzyAnimation: function (callback, jumpX, jumpY) {
        this.pauseJump();
        this.gameJS.closeTouch();
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), 100, 1);
        var jump2 = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), 100, 1);
        var fadeout = cc.fadeOut(0.3);
        var fadein = cc.fadeIn(0.3);
        var repeat = cc.repeat(cc.sequence(fadeout, fadein), 3);
        var dizzAction = cc.sequence(jump1, jump2, repeat, cc.callFunc(callback));
        this.node.runAction(dizzAction);
    },

    cliffJumping: function (callback, jumpX, jumpY) {
        this.gameJS.gameOver();
        this.node.zIndex = -1;
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), 100, 1);
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -360));
        moveBy.easing(cc.easeIn(0.6));
        this.node.runAction(cc.sequence(jump1, cc.spawn(fadeout, moveBy), cc.callFunc(callback, this)));

    },

    dropAni:function() {
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -400));
        moveBy.easing(cc.easeIn(1.2));
        this.node.runAction(cc.spawn(fadeout,moveBy));
    },

    relive: function () {
        this.node.x = this.aimX;
        this.node.y = this.aimY;
        this.changeDir();
        this.node.opacity = 255;
    }
});
