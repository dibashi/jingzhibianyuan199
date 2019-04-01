cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {



        this.boxesMgrJS = cc.find('Canvas/game/boxes_mgr').getComponent('boxesMgr');
        this.gameJS = cc.find('Canvas/game').getComponent('game');


        this.jumpHeight = 50;
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
        this.jumpSpeed = 0.7;
        this.node.opacity = 255;
        this.node.zIndex = 1;

        this.node.scaleX = 1;
    },

    // called every frame
    update: function (dt) {

    },

    changeDir: function (touchPosition) {
        this.curDir = (touchPosition.x < 360 ? BoxDir.left : BoxDir.right);
    },



    jump: function () {

        cc.audioMgr.playEffect("jump");

        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + (this.curDir === BoxDir.right ? 1 : -1) * BoxX;

        this.node.scaleX = (this.curDir === BoxDir.right ? 1 : -1);

        this.node.stopAllActions();

        var resultBoxType = this.boxesMgrJS.getJumpedInfo(aimX, aimY, this.aimX, this.aimY, this.curDir);

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
               
                this.gameJS.openTouch();
            }.bind(this), jumpX, jumpY);

        } else if (resultBoxType === BoxType.noneBox) {
            //悬崖，阵亡了
            var jumpY = aimY;
            var jumpX = aimX;
            this.cliffJumping(function () {
                this.gameJS.gameOver();

            }.bind(this), aimX, aimY);

        }

    },

    jumpAinmation: function (callback) {
        var jumpAction = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), this.jumpHeight, 1);
        var resultAction = jumpAction;
        if (callback) {
            resultAction = cc.sequence(jumpAction, cc.callFunc(callback, this));
        }
        this.node.runAction(resultAction);
    },

    dizzyAnimation: function (callback, jumpX, jumpY) {
        this.gameJS.closeTouch();
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), this.jumpHeight, 1);
        var jump2 = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), this.jumpHeight, 1);
        var fadeout = cc.fadeOut(0.3);
        var fadein = cc.fadeIn(0.3);
        var repeat = cc.repeat(cc.sequence(fadeout, fadein), 3);
        var dizzAction = cc.sequence(jump1, jump2, repeat, cc.callFunc(callback));
        this.node.runAction(dizzAction);
    },

    cliffJumping: function (callback, jumpX, jumpY) {
       
        this.node.zIndex = -1;
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), this.jumpHeight, 1);
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -360));
        moveBy.easing(cc.easeIn(0.6));
        this.node.runAction(cc.sequence(jump1, cc.spawn(fadeout, moveBy), cc.callFunc(callback, this)));

        this.gameJS.closeTouch();
        this.gameJS.node_streak.active = false;

    },

    dropAni: function () {
        this.gameJS.closeTouch();
        this.gameJS.node_streak.active = false;
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -400));
        moveBy.easing(cc.easeIn(1.2));
        this.node.runAction(cc.sequence(cc.spawn(fadeout, moveBy),cc.callFunc(function(){

            this.gameJS.gameOver();
        }.bind(this))));

    },

    relive: function () {
        this.node.stopAllActions();

        this.node.opacity = 255;

        this.node.zIndex = 1;
    }


});
