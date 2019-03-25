
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
        this.alive = false;
    },

    start() {
        this.boxType = null;//box的类型
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

            this.spr_block.setPosition(cc.v2((dir === BoxDir.left ? -1 : 1) * BoxX, BoxY));
            
            this.spr_box.color = cc.color(this.spr_box.color.r*0.72,this.spr_box.color.g*0.72,this.spr_box.color.b*0.72,255);
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

        let moveBy = cc.moveBy(1.2, cc.v2(0, -400));
        moveBy.easing(cc.easeIn(1.2));
        let fadeOut = cc.fadeOut(1.2);
        let spawn = cc.spawn(moveBy, fadeOut);
        let seq = cc.sequence(spawn, cc.callFunc(callback));
        this.node.runAction(seq);
    },

    unuse: function () {
       
        this.spr_box.color = cc.color(255,255,255,255);
    },

    reuse: function () {
        
    }


});
