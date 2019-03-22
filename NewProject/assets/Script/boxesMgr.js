cc.Class({
    extends: cc.Component,

    properties: {
       

        obstacleProbability: {
            default: 0.2,
            displayName: "障碍物生成概率",
            tooltip: "0.2表示20%",
        },

        boxPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {

        this.lastBoxX = -72;
        this.lastBoxY = -72;

        //生成了多少个box了
        this.generatedBox = 0;

        this.dropSpeed = 1.5;
    },

    start: function () {


    },

    beginDrop:function() {
        this.schedule(this.drop,this.dropSpeed);
    },

    drop:function() {
        console.log("开始掉落了");
    },

    initBoxes: function (callback) {

        for (var i = 0; i < InitBoxCount; i++) {
            this.createBox();
        }

        callback();
    },

    createBox: function () {
        //这里没算障碍物的，用于改变box的zIndex
        this.generatedBox++;
        var box = cc.instantiate(this.boxPrefab);
        this.node.addChild(box);


        var dir = BoxDir.right;
        if (this.generatedBox <= InitBoxCount) {
            dir = BoxDir.right;
        } else {
            dir = (Math.random() > 0.5 ? BoxDir.left : BoxDir.right);
        }
        var pos = this.getNextBoxPos(dir);
        box.getComponent('box').initBox(this.generatedBox,pos, dir, BoxType.normalBox);

        if (Math.random() < this.obstacleProbability && this.generatedBox > InitBoxCount) {
            var blockDir = dir === BoxDir.left ? BoxDir.right : BoxDir.left;
            var blockPos = getNextBoxPos(blockDir);
            var blockBox = cc.instantiate(this.boxPrefab);
            this.node.addChild(blockBox);
            blockBox.getComponent('box').initBox(this.generatedBox,blockPos, blockDir, BoxType.blockBox);
        }

        this.lastBoxX = pos.x;
        this.lastBoxY = pos.y;

    },

    getNextBoxPos: function (dir) {
        let poxX = BoxX * (dir === BoxDir.left ? -1 : 1) + this.lastBoxX;
        let poxY = BoxY + this.lastBoxY;

        return cc.v2(poxX, poxY);
    },

    getJumpedInfo:function(aimX,aimY) {
        var jumpedInfo = {
            aimX:aimX,
            aimY:aimY,
            boxType:BoxType.normalBox,
        }
        return jumpedInfo;
    },

    
    // called every frame
    update: function (dt) {

    },
});
