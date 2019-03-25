cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {


        this.jumpCount = 0;
        this.curDir = BoxDir.right;

        this.aimX = 0;
        this.aimY = 0;

        this.boxesMgrJS = cc.find('Canvas/game/boxes_mgr').getComponent('boxesMgr');
        this.gameJS = cc.find('Canvas/game').getComponent('game');

        this.jumpSpeed = 1;
    },

    start: function () {


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
        this.jumpCount++;
        //通知ui显示?

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
            console.log("阵亡了");
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

    dizzyAnimation: function (callback,jumpX,jumpY) {
        this.pauseJump();
        this.gameJS.closeTouch();
        var jump1 = cc.jumpTo(JumpTime,cc.v2(jumpX,jumpY),100,1);
        var jump2 = cc.jumpTo(JumpTime,cc.v2(this.aimX,this.aimY),100,1);
        var fadeout = cc.fadeOut(0.3);
        var fadein = cc.fadeIn(0.3);
        var repeat = cc.repeat(cc.sequence(fadeout,fadein),3);
        var dizzAction = cc.sequence(jump1,jump2,repeat,cc.callFunc(callback));
        this.node.runAction(dizzAction);
    }

});
