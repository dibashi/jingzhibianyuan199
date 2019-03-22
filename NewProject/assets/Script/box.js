// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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

    // onLoad () {},

    start() {
        this.boxType = null;//box的类型
    },

    initBox: function (countBox, aimPos, dir, boxType) {

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

        } else if(this.boxType === BoxType.normalBox) {
            this.spr_block.active = false;
            this.spr_prop.active = false;
        } else {
            debugger;
        }


    }


});
