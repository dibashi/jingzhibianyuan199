cc.Class({
    extends: cc.Component,

    properties: {
        jumpSpeed: {
            default: 1.0,
            displayName: "跳跃速度",
            tooltip: "多长时间跳跃一次？越小越快",
        },
    },

    // use this for initialization
    onLoad: function () {


        this.jumpCount = 0;
        this.curDir = BoxDir.right;

        this.aimY = 0;
        this.aimX = 0;

        this.boxesMgrJS = cc.find('Canvas/game/boxes_mgr').getComponent('boxesMgr');

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

        this.schedule(this.jump,this.jumpSpeed);

    },

    jump: function () {
        this.jumpCount++;
        //通知ui显示?

        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + (this.curDir === BoxDir.right ? 1 : -1)*BoxX;

        this.node.stopAllActions();

        var jumpedInfo = this.boxesMgrJS.getJumpedInfo(aimX, aimY);

        this.aimX = jumpedInfo.aimX;
        this.aimY = jumpedInfo.aimY;

        if (jumpedInfo.boxType === BoxType.normalBox) {
            //播放跳跃声
            this.jumpAinmation();
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
