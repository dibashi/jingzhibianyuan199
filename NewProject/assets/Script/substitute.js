
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        this.roleJS = cc.find('Canvas/game').getComponent('game').roleJS;

       
    },

    roleBack:function() {
        this.roleJS.roleBack();
    }

});
