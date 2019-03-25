
cc.Class({
    extends: cc.Component,

    properties: {
        spr_box: {
            default: null,
            type: cc.Node
        },
        spr_block: {
            default: null,
            type: cc.Node
        },
        spr_prop: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.gameJS = cc.find('Canvas/game').getComponent('game');
        this.roleJS = cc.find('Canvas/game/role').getComponent('role');
        this.alive = false;

        this.boxType = null;//box的类型

       
    },

    start() {
        
    },

    initBox: function (countBox, aimPos, dir, boxType) {
        this.alive = true;
        this.node.zIndex = MaxZIndexOfBox - countBox;
        if (countBox > InitBoxCount) {
            this.node.setPosition(cc.v2(aimPos.x, aimPos.y + BoxY * 2));
            this.node.runAction(cc.fadeIn(0.15));
            this.node.runAction(cc.moveTo(0.2, aimPos));
        } else {
            this.node.setPosition(aimPos);
            this.node.runAction(cc.fadeIn(0.15));
            //为了无缝衔接 第一个为 node_start 中的台阶 游戏中第一个不显示
            //  if (countBox != 1)
            //  this.node.runAction(cc.fadeIn(0.15));
        }
        this.spr_box.color = cc.color(255, 255, 255, 255);
        this.boxType = boxType;
        if (this.boxType === BoxType.blockBox) {
            this.spr_block.active = true;
            this.spr_prop.active = true;
            this.spr_box.active = true;

            let randomImageId = parseInt(Math.random() * BlockImageCount) + 1;
            let blackName = 'zhangai0' + randomImageId;
            this.spr_prop.getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf(blackName);

            this.spr_prop.scale = 0;
            this.spr_prop.runAction(cc.sequence(cc.delayTime(0.2), cc.scaleTo(0.2, 1)));
            this.spr_prop.y = PropY;
            this.spr_block.setPosition(cc.v2((dir === BoxDir.left ? -1 : 1) * BoxX, BoxY));

            this.spr_box.color = cc.color(190, 190, 190, 255);
            //修改spriteFrame？


        } else if (this.boxType === BoxType.normalBox) {
            this.spr_block.active = false;
            this.spr_prop.active = false;
            this.spr_box.active = true;
        } else {
            debugger;
        }

    },

    drop: function (callback) {
        this.alive = false;
        this.node.stopAllActions();
        //要判断角色是否在这里
        var roleDroped = this.checkRoleOnThisBox();

        if(roleDroped) {
            this.roleJS.dropAni();
        }


        let moveBy = cc.moveBy(1.2, cc.v2(0, -400));
        moveBy.easing(cc.easeIn(1.2));
        let fadeOut = cc.fadeOut(1.2);
        let spawn = cc.spawn(moveBy, fadeOut);
        let seq = cc.sequence(spawn, cc.callFunc(callback));
        this.node.runAction(seq);
    },

    showFoot: function (curdir) {
        let footName = "jiaoyin01";
        this.spr_prop.getComponent(cc.Sprite).spriteFrame = this.gameJS.getGameFrame_sf(footName);
        this.spr_prop.active = true;
        this.spr_prop.scaleX = (curdir === BoxDir.right ? 1 : -1);
        this.spr_prop.y = FootY;
    },

    checkRoleOnThisBox:function() {
        let dis = cc.v2(this.roleJS.aimX - this.node.x,this.roleJS.aimY - this.node.y).magSqr();
        if(dis<100) {
            //角色被撞倒，有动作的回调会执行，要把动作咔嚓掉。
            this.roleJS.node.stopAllActions();
            this.gameJS.gameOver();

            return true;
        }

        return false;
    }

    // unuse: function () {

    //     this.spr_box.color = cc.color(255,255,255,255);
    // },

    // reuse: function () {

    // }


});
