
cc.Class({
    extends: cc.Component,

    properties: {
        streak_textures: {
            default: [],
            type: cc.Texture2D
        },

        vertigo: {
            default: null,
            type: cc.Node
        }

    },

    // use this for initialization
    onLoad: function () {




        this.jumpHeight = 50;
        //this.prepareStart();

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

        this.settingType();

        this.vertigo.active = false;

        //在特定关卡下跳跃的次数
        this.cpStep = 0;

        this.unscheduleAllCallbacks();
    },



    settingType: function () {
        this.boxesMgrJS = cc.find('Canvas/game/boxes_mgr').getComponent('boxesMgr');
        this.gameJS = cc.find('Canvas/game').getComponent('game');
        //------------------------------------------------↓↓↓↓↓↓↓角色衣服和拖尾修改↓↓↓↓↓↓↓↓↓-----------------------------------------------
        let roleConf = cc.config("role")
        if (roleConf[cc.moduleMgr.playerModule.module.Role]) {
            this.roleType = roleConf[cc.moduleMgr.playerModule.module.Role].skills
            cc.tools.changeSprite(this.node.getChildByName("spr_role"), "role/" + roleConf[cc.moduleMgr.playerModule.module.Role].Role)
            cc.tools.changeMotionStreak(this.gameJS.node_streak, "streak/" + roleConf[cc.moduleMgr.playerModule.module.Role].Streak)
        }

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

        var resultBoxJS = this.boxesMgrJS.getJumpedInfo(aimX, aimY, this.aimX, this.aimY, this.curDir);
        if (resultBoxJS === null) {
            //悬崖，阵亡了
            var jumpY = aimY;
            var jumpX = aimX;
            this.cliffJumping(this.deadCallback, aimX, aimY);

        } else if (resultBoxJS.boxType === BoxType.normalBox) {
            this.aimX = aimX;
            this.aimY = aimY;

            this.jumpAinmation(function () {

            });

            this.cpStep++;
            // console.log(this.cpStep);
            if (this.cpStep === cc.moduleMgr.tempModule.module.CurcheckPoint.step) {
                this.cpStep = 0;
                let conf = cc.tools.Getcheckpoint(cc.moduleMgr.tempModule.module.CurcheckPoint.id + 1);
                cc.moduleMgr.tempModule.module.CurcheckPoint = conf;

                
                for (let i = 0, len = this.boxesMgrJS.node.children.length; i < len; i++) {
                    let box = this.boxesMgrJS.node.children[i];
                    box.getChildByName("spr_box").getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf("zz0" + conf.color);
                    box.getChildByName("spr_block").getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf("zz0" + conf.color);
                }

            }

            this.boxesMgrJS.createBox();
            if (resultBoxJS.coinType !== CoinType.noneCoin) {
                resultBoxJS.spr_prop.active = false;
                cc.moduleMgr.itemModule.GameGoldAdd(resultBoxJS.coinType);
                cc.audioMgr.playEffect("coin");
            }

            cc.moduleMgr.tempModule.module.score += 1

        } else if (resultBoxJS.boxType === BoxType.blockBox) {
            var jumpY = aimY;
            var jumpX = aimX + (this.curDir === BoxDir.right ? -10 : 10);
            this.dizzyAnimation(function () {

                this.gameJS.openTouch();
                this.vertigo.getComponent(cc.Animation).stop();
                this.vertigo.active = false;
            }.bind(this), jumpX, jumpY);

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
        //3.2秒
        this.gameJS.closeTouch();
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), this.jumpHeight, 1);
        var jump2 = cc.jumpTo(JumpTime, cc.v2(this.aimX, this.aimY), this.jumpHeight, 1);
        var fadeout = cc.fadeOut(0.2);
        var fadein = cc.fadeIn(0.2);
        var repeat = cc.repeat(cc.sequence(fadeout, fadein), 2);
        // var dizzAction = cc.sequence(jump1, jump2, repeat, cc.callFunc(callback));
        var dizzAction = cc.sequence(jump1, jump2, repeat, cc.callFunc(function () {

            this.vertigo.active = true;
            this.vertigo.getComponent(cc.Animation).play();
            this.scheduleOnce(callback, 1.0);

        }.bind(this)));
        this.node.runAction(dizzAction);

        cc.audioMgr.playEffect("vertigo");
    },

    cliffJumping: function (callback, jumpX, jumpY) {

        this.node.zIndex = -1;
        var jump1 = cc.jumpTo(JumpTime, cc.v2(jumpX, jumpY), this.jumpHeight, 1);
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -360));
        moveBy.easing(cc.easeIn(0.6));
        this.node.runAction(cc.sequence(jump1, cc.spawn(fadeout, moveBy), cc.callFunc(callback, this)));

        this.gameJS.gameOver();
        this.gameJS.node_streak.active = false;

        cc.audioMgr.playEffect("dead");

    },

    dropAni: function () {
        this.gameJS.gameOver();
        this.gameJS.node_streak.active = false;
        var fadeout = cc.fadeOut(1.2);
        var moveBy = cc.moveBy(1.2, cc.v2(0, -400));
        moveBy.easing(cc.easeIn(1.2));
        this.node.runAction(cc.sequence(cc.spawn(fadeout, moveBy), cc.callFunc(this.deadCallback, this)));

        cc.audioMgr.playEffect("dead");

    },

    deadCallback: function () {
        cc.uiMgr.Push("GameOverFrame", {}, { add: false });
    },

    relive: function () {
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.node.zIndex = 1;
    },

    accelerateAndPathfinding: function (interval, count) {
        this.unschedule(this._accelerateAndPathfinding, this);
        this.accelerateCount = 0;
        this.totalAccelerateCount = count;
        this.gameJS.closeTouch();

        this.schedule(this._accelerateAndPathfinding, interval);
    },

    _accelerateAndPathfinding: function () {
        if (this.gameJS.currentGameState === gameStates.unStart) {
            this.unschedule(this._accelerateAndPathfinding, this);
            return;
        }


        let aimY = this.aimY + BoxY;
        let aimX = this.aimX + BoxX;


        var resultBoxJS = this.boxesMgrJS.getJumpedInfo(aimX, aimY);

        if (resultBoxJS === null) {
            this.changeDir(cc.v2(0, 0));
        }
        else if (resultBoxJS.boxType === BoxType.normalBox) {
            this.changeDir(cc.v2(500, 0));
        } else if (resultBoxJS.boxType === BoxType.blockBox) {
            this.changeDir(cc.v2(0, 0));

        }

        this.jump();

        this.accelerateCount++;
        if (this.accelerateCount === this.totalAccelerateCount) {
            this.unschedule(this._accelerateAndPathfinding, this);
            this.gameJS.openTouch();
        }

    }



});
