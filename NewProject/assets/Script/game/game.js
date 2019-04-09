


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
        },

        stonePre: {
            default: null,
            type: cc.Prefab
        },
        stones: {
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

        //用于标记玩家是否是复活开始的游戏，如果是会给其一个安全时间
        this.isReliveState = false;

        this.skillMaskSprite = this.skillBtnNode.getChildByName("mask").getComponent(cc.Sprite);

        this.curCheckPointID = CheckpointType.noneTrap;



    },

    start: function () {

        Notification.on("hallcallBack", function () {

            this.boxesMgrJS.prepareStart();

        }.bind(this), this);

        this.stonePool = new cc.NodePool();

        for (var i = 0; i < StonePoolSize; i++) {
            let stone = cc.instantiate(this.stonePre);
            this.stonePool.put(stone);
        }
    },

    openTouch: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.gameStateSwitch, this);
    },

    gameStateSwitch: function (touch) {
        var touchPosition = touch.getLocation();

        switch (this.currentGameState) {

            case gameStates.preparing:


                
                this.currentGameState = gameStates.starting;
                this.node_hint.active = false;
                this.roleJS.changeDir(touchPosition);

                this.boxesMgrJS.beginDrop();



                this.resumeAllScheduler();
                if (this.isReliveState) {
                    cc.audioMgr.resumeBg("bg1");
                    let skillconf = cc.moduleMgr.playerModule.GetSkill(2001)

                    this.boxesMgrJS.slowDownDrop(skillconf.duration, skillconf.duration);
                    Notification.emit("skillShowTime", { id: skillconf.id });
                } else {
                    cc.audioMgr.playBg("bg1");
                }

                this.roleJS.jump();
                if (this.roleJS.roleType !== RoleType.normalType) {
                    this.skillBtnNode.active = true;
                    this._skillActive = true;

                    this.skillMaskSprite.fillRange = 0;
                }

                break;


            case gameStates.starting:

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


    //用于游戏开始的调用
    startGame: function (cpdata) {

        cc.audioMgr.pauseBg();
        cc.moduleMgr.tempModule.module.CurcheckPoint = cpdata;

        // let conf = cc.tools.Getcheckpoint(cpdata.id + 1);
        // cc.moduleMgr.tempModule.module.CurcheckPoint = conf;
        cc.moduleMgr.tempModule.module.score = 0;

        this.isReliveState = false;

        this.boxesMgrJS.prepareStart();
        this.roleJS.prepareStart();
        this.closeAllTrap();

        this.gameCamera.position = cc.v2(0, 0);

        this.boxesMgrJS.initBoxes(function () {
            this._startGame();

        }.bind(this));

        let id = cc.moduleMgr.playerModule.module.Role
        let skillconf = cc.moduleMgr.playerModule.GetRoleSkill(id);
        cc.tools.changeSprite(this.skillBtnNode, "skill/" + skillconf.icon)
    },
    //内部的游戏开始调用，复活开始也需要用到
    _startGame: function () {

        cc.audioMgr.pauseBg();
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
        this.pauseAllScheduler();

        this.skillBtnNode.active = false;
        this.node_streak.active = false;

        this.currentGameState = gameStates.unStart;
    },


    reliveGame: function () {
        this.isReliveState = true;
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
        // this.gameCamera.x = this.roleJS.node.x;
        // this.gameCamera.y = this.roleJS.node.y;
    },


    skillClick: function () {

        if (this._skillActive === false) {
            return;
        }


        let id = cc.moduleMgr.playerModule.module.Role
        let skillconf = cc.moduleMgr.playerModule.GetRoleSkill(id);
        // {cd:conf.cd 

        // ,icon:conf.icon,duration:conf.duration}

        switch (this.roleJS.roleType) {
            case RoleType.accelerateType:

                this.roleJS.accelerateAndPathfinding(0.15, Math.ceil(skillconf.duration / 0.15));
                this.releaseSkill_common(skillconf.id, skillconf.cd);

                cc.audioMgr.playEffect("speed");
                break;

            case RoleType.slowDownType:
                this.boxesMgrJS.slowDownDrop(5, skillconf.duration);
                this.releaseSkill_common(skillconf.id, skillconf.cd);
                cc.audioMgr.playEffect("slowTime");
                break;

            default:
                //debugger;
                break;
        }
    },

    //开启当前关卡的陷阱
    startupTrap: function () {
        this.closeAllTrap();
        var traps = cc.moduleMgr.tempModule.module.CurcheckPoint.skill;

        for (var i = 0; i < traps.length; i++) {
            //落石
            if (traps[i] === CheckpointType.stoneTrap) {
                //先根据落石机关ID 获取所有内部数据
                var trapData = cc.moduleMgr.playerModule.GetSkill(traps[i]);

                this.schedule(this.dropStone, trapData.cd);
            }
        }

    },

    dropStone: function () {
        Notification.emit("skillShowTime", { id: 2002 });
        //console.log("?????");
        var dropCount = Math.floor(2 + Math.random() * (StoneLocs.length - 1));//2~length;
        var roleOnBoxIndex = this.boxesMgrJS.getRoleInBoxIndex();
        //console.log(roleOnBoxIndex);
        for (var i = 0; i < dropCount; i++) {
            let stone = null;
            if (this.stonePool.size() > 0) {
                stone = this.stonePool.get();
            } else {
                stone = cc.instantiate(this.stonePre);
            }
            this.stones.addChild(stone);
            stone.getChildByName("stone").y = 1000;
            stone.getChildByName("shadow").scale = 0;

            stone.getComponent(cc.Animation).play();
            //获得角色的当前块
            var tempBoxIndex = roleOnBoxIndex - StoneLocs[i];

            stone.position = this.boxesMgrJS.boxQueue[tempBoxIndex][0].position;

            stone.getComponent("stone").box = this.boxesMgrJS.boxQueue[tempBoxIndex][0];
        }
    },

    closeAllTrap: function () {
        this.unschedule(this.dropStone);
    },

    pauseAllScheduler: function () {
        cc.director.getScheduler().pauseTarget(this);
    },

    resumeAllScheduler: function () {
        cc.director.getScheduler().resumeTarget(this);
    },

    //释放技能的时候，需要的公共技能代码
    releaseSkill_common: function (skillID, skillCD) {
        this.skillCD = skillCD;
        Notification.emit("skillShowTime", { id: skillID });
        this._skillActive = false;
        this.skillMaskSprite.fillRange = 1;

        this.skillBeginTime = parseInt(Date.now() / 1000);
    },



    // called every frame
    update: function (dt) {
        if (this.skillBtnNode.active && this._skillActive === false) {

            this.skillMaskSprite.fillRange = 1 - (parseInt(Date.now() / 1000) - this.skillBeginTime) / this.skillCD;

            if (this.skillMaskSprite.fillRange <= 0) {
                this.skillMaskSprite.fillRange = 0;
                this._skillActive = true;
            }
        }
    },



});
