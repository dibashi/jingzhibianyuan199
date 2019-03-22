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
        console.log("改变方向了");
        this.curDir = (this.curDir === BoxDir.right ? BoxDir.left : BoxDir.right);
    },


    beginJump: function () {
        console.log("开始跳跃");

        this.schedule(this.jump, this, this.jumpSpeed);

    },

    jump: function () {
        this.jumpCount++;
        //通知ui显示?

        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + (this.curDir === BoxDir.right? 1:-1);

        this.node.stopAllActions();

        var jumpedInfo = this.boxesMgrJS.getJumpedInfo(aimX,aimY);

        aimX = jumpedInfo.aimX;
        aimY = jumpedInfo.aimY;
        
    },




});
