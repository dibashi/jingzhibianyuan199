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

    jump: function () {
        this.jumpCount++;
        //通知ui显示?

        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + (this.curDir === BoxDir.right ? 1 : -1) * BoxX;

        this.node.scaleX = (this.curDir === BoxDir.right ? 1 : -1);

        this.node.stopAllActions();

        var jumpedInfo = this.boxesMgrJS.getJumpedInfo(aimX, aimY);

        this.aimX = jumpedInfo.aimX;
        this.aimY = jumpedInfo.aimY;

        if (jumpedInfo.boxType === BoxType.normalBox) {
            //播放跳跃声
            this.jumpAinmation();
            this.boxesMgrJS.createBox();

        } else if (jumpedInfo.boxType === BoxType.blockBox) {
            //阵亡？眩晕？
        } else if (jumpedInfo.boxType === BoxType.noneBox) {
            //悬崖，阵亡了
        }

    },

    jumpAinmation: function (callback) {
        var jumpAction = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), 100, 1);
        var resultAction = jumpAction;
        if (callback) {
            resultAction = cc.sequence(jumpAction, cc.callFunc(callback, this));
        }
        this.node.runAction(resultAction);
    }

});
