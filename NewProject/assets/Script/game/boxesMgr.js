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
        this.dropSpeed = BoxInitSpeed;

        this.isInGenCoinTime = false;
        this.unscheduleAllCallbacks();
    },

    slowDownDrop: function (slowCoefficient, restTime) {
        //this.slowSpeed = this.dropSpeed * slowCoefficient;
        this.slowSpeed = slowCoefficient;
        this.restTime = restTime;
        this.unschedule(this.drop, this);
        this.schedule(this.slowDrop, this.slowSpeed);

    },

    slowDrop: function () {
        this.drop();
        this.restTime -= this.slowSpeed;
        if (this.restTime <= 0) {
            this.unschedule(this.slowDrop, this);
            this.beginDrop();
        }
    },

    beginDrop: function () {
        this.schedule(this.drop, this.dropSpeed);
    },

    reduceDropTime: function () {
        this.dropSpeed = cc.misc.clampf(this.dropSpeed - ReduceTime, MinQuickly, 2);
    },

    pauseDrop: function () {
        this.unschedule(this.drop, this);
        this.unschedule(this.slowDrop, this);

        this.isInGenCoinTime = false;
    },

    drop: function () {

        //console.log("执行了！", this.boxPool.size());

        var toDropBoxes = this.boxQueue.pop();

        //身后格子数
        var count = 0;
        for (var i = this.boxQueue.length - 1; i >= 0; i--) {
            
            if (this.boxQueue[i][0].getComponent("box").checkRoleOnThisBox() === true) {
                cc.moduleMgr.tempModule.module.warningDistance = count
                //console.log("角色身后的格子数量为--->  ", count);
                break;
            } else {
                count++;
            }
        }

        var isRoleDroped0 = toDropBoxes[0].getComponent("box").drop(function (dropedBox) {

            if (!isRoleDroped0) {
                this.boxPool.put(dropedBox);
            }

        }.bind(this));
        if (isRoleDroped0) {
            this.boxQueue.push([toDropBoxes[0]]);
            this.unschedule(this.drop, this);
        }
        if (toDropBoxes.length > 1) {
            toDropBoxes[1].getComponent("box").drop(function (dropedBox) {
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
        var curColorIndex = cc.moduleMgr.tempModule.module.CurcheckPoint.color;
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

            if(this.isInGenCoinTime === false) {
                if(Math.random() < CoinProb) {
                    this.isInGenCoinTime = true;
                   
                    let coinTime = Math.random()*(CoinGenMaxTime - CoinGenMinTime) + CoinGenMinTime;
                    this.scheduleOnce(function() {
                        this.isInGenCoinTime = false;
                    }.bind(this),coinTime);
                }
            }
        }
        var pos = this.getNextBoxPos(dir);
        box.getComponent('box').initBox(this.generatedBox, pos, dir, BoxType.normalBox, curColorIndex,this.isInGenCoinTime);

        this.boxQueue[0].push(box);

        if (Math.random() < this.obstacleProbability && this.generatedBox > InitBoxCount) {
            var blockDir = (dir === BoxDir.left ? BoxDir.right : BoxDir.left);
            var blockPos = this.getNextBoxPos(blockDir);
            var blockBox = this.getBox();
            this.node.addChild(blockBox);
            blockBox.getComponent('box').initBox(this.generatedBox, blockPos, blockDir, BoxType.blockBox, curColorIndex,this.isInGenCoinTime);

            this.boxQueue[0].push(blockBox);
        }

        this.lastBoxX = pos.x;
        this.lastBoxY = pos.y;


        if (this.generatedBox > 0 && this.generatedBox % BoxAccelerateCount === 0) {

            if (this.dropSpeed > BoxLimitDropTime) {
                this.dropSpeed -= DeltaOfBoxAcc;
                if (this.dropSpeed < BoxLimitDropTime) {
                    this.dropSpeed = BoxLimitDropTime;
                }
                if (cc.director.getScheduler().isScheduled(this.drop, this)) {
                    //console.log("this.drop定时器是开启的！！！")
                    this.unschedule(this.drop, this);
                    this.beginDrop();
                } else {
                    //console.log("this.drop定时未开启！！！");
                }
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

        var resultBoxJS = null;
        for (let i = 0, len = this.node.children.length; i < len; i++) {
            let box = this.node.children[i];
            if (curX !== undefined) {
                if (Math.abs(curY - box.y) < 10 && Math.abs(curX - box.x) < 10 && this.gameJS.hasFoot()) {
                    let boxJS = box.getComponent('box');
                    boxJS.showFoot(curdir);
                }
            }

            let dis = cc.v2(box.x - aimX, box.y - aimY).magSqr();
            if (dis < 100) {
                resultBoxJS = box.getComponent('box');
            }
        }

        return resultBoxJS;
    },


    // called every frame
    update: function (dt) {

    },
});
