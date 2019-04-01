cc.Class({
    extends: cc.Component,

    properties: {




        boxPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {

        // this.boxPool = new cc.NodePool('box');
        this.boxPool = new cc.NodePool();

        for (var i = 0; i < BoxPoolSize; i++) {
            let box = cc.instantiate(this.boxPrefab);
            this.boxPool.put(box);
        }

        this.gameJS = cc.find('Canvas/game').getComponent('game');

        this.prepareStart();

    },

    start: function () {


    },

    prepareStart: function () {
        var len = this.node.children.length;
        for (var i = len - 1; i >= 0; i--) {
            var box = this.node.children[i];
            this.boxPool.put(box);
        }

        this.boxQueue = [];
        this.generatedBox = 0;

        this.lastBoxX = -72;
        this.lastBoxY = -72;
        this.obstacleProbability = 0.2;
        this.dropSpeed = 0.8;

    },

    beginDrop: function () {
        this.schedule(this.drop, this.dropSpeed);
    },

    reduceDropTime: function () {
        this.dropSpeed = cc.misc.clampf(this.dropSpeed - ReduceTime, MinQuickly, 2);
    },

    pauseDrop: function () {
        this.unschedule(this.drop, this);
    },

    drop: function () {

        var toDropBoxes = this.boxQueue.pop();
        for (var i = 0; i < toDropBoxes.length; i++) {
            toDropBoxes[i].getComponent("box").drop(function (dropedBox) {
                //console.log("执行了！", this.boxPool.size());
                this.boxPool.put(dropedBox);
            }.bind(this));
        }
    },



    initBoxes: function (callback) {

        for (var i = 0; i < InitBoxCount; i++) {
            this.createBox();
        }

        callback();
    },

    createBox: function () {
        var curColorIndex = cc.moduleMgr.tempModule.module._bg_Color;
        //这里没算障碍物的，用于改变box的zIndex
        this.generatedBox++;

        this.boxQueue.unshift([]);

        var box = this.getBox();
        this.node.addChild(box);


        var dir = BoxDir.right;
        dir = (Math.random() > 0.5 ? BoxDir.left : BoxDir.right);
        if (this.generatedBox <= InitRightBoxCount) {
            dir = BoxDir.right;
        } else {
            dir = (Math.random() > 0.5 ? BoxDir.left : BoxDir.right);
        }
        var pos = this.getNextBoxPos(dir);
        box.getComponent('box').initBox(this.generatedBox, pos, dir, BoxType.normalBox, curColorIndex);

        this.boxQueue[0].push(box);

        if (Math.random() < this.obstacleProbability && this.generatedBox > InitBoxCount) {
            var blockDir = (dir === BoxDir.left ? BoxDir.right : BoxDir.left);
            var blockPos = this.getNextBoxPos(blockDir);
            var blockBox = this.getBox();
            this.node.addChild(blockBox);
            blockBox.getComponent('box').initBox(this.generatedBox, blockPos, blockDir, BoxType.blockBox, curColorIndex);

            this.boxQueue[0].push(blockBox);
        }

        this.lastBoxX = pos.x;
        this.lastBoxY = pos.y;

        if (this.generatedBox > 0 & this.generatedBox % 20 === 0) {
            //云龙那边监听到数据改变会自动修改背景
            curColorIndex = cc.moduleMgr.tempModule.randomBgColor();

            for (let i = 0, len = this.node.children.length; i < len; i++) {
                let box = this.node.children[i];
                box.getChildByName("spr_box").getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf("zz0" + curColorIndex);
                box.getChildByName("spr_block").getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf("zz0" + curColorIndex);
            }
  
        }

    },


    getBox: function () {
        let box = null;
        if (this.boxPool.size() > 0) {
            box = this.boxPool.get();
        } else {
            box = cc.instantiate(this.boxPrefab);
        }
        return box;
    },

    getNextBoxPos: function (dir) {
        let poxX = BoxX * (dir === BoxDir.left ? -1 : 1) + this.lastBoxX;
        let poxY = BoxY + this.lastBoxY;

        return cc.v2(poxX, poxY);
    },

    //处理脚印，以及返回下个目标块是什么类型的
    getJumpedInfo: function (aimX, aimY, curX, curY, curdir) {
        var resultBoxType = BoxType.noneBox;

        for (let i = 0, len = this.node.children.length; i < len; i++) {
            let box = this.node.children[i];

            if (Math.abs(curY - box.y) < 10 && Math.abs(curX - box.x) < 10 && this.gameJS.hasFoot()) {
                let boxJS = box.getComponent('box');
                boxJS.showFoot(curdir);
            }

            let dis = cc.v2(box.x - aimX, box.y - aimY).magSqr();
            if (dis < 100) {
                let boxJS = box.getComponent('box');
                if (boxJS.boxType === BoxType.blockBox) {
                    resultBoxType = BoxType.blockBox
                } else if (boxJS.boxType === BoxType.normalBox) {
                    resultBoxType = BoxType.normalBox;
                }
            }
        }

        return resultBoxType;
    },


    // called every frame
    update: function (dt) {

    },
});
