
cc.Class({
    extends: cc.Component,

    properties: {
        stone: {
            default: null,
            type: cc.Node
        },



    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {


    },

    start() {
        this.gameJS = cc.find('Canvas/game').getComponent('game');
    },

    stoneDroped:function() {
        console.log("石头落下来了");
        this.gameJS.stonePool.put(this.node);
    }
   

});
