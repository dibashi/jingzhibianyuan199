
cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.box = null;
    },

    start() {
        this.gameJS = cc.find('Canvas/game').getComponent('game');

       
    },

    stoneDroped:function() {
        console.log("石头落下来了");

        if(!this.box) {
            debugger;
        } else {
            if(this.box.getComponent("box").checkRoleOnThisBox() === true) {
                cc.audioMgr.playEffect("vertigo");
                if(this.gameJS.roleJS.isInvincible === false) {
                    this.gameJS.roleJS.dizzyAnimation(function () {

                        this.gameJS.openTouch();
                        this.vertigo.getComponent(cc.Animation).stop();
                        this.vertigo.active = false;
                    }.bind(this.gameJS.roleJS));
                }
            }
        }

        cc.audioMgr.playEffect("stoneDroped");

        this.gameJS.stonePool.put(this.node);
    }
   

});
