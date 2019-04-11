
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

       
        this.isStone = false;
    },

    stoneDroped:function() {
        // console.log("石头落下来了");

        if(!this.box) {
            debugger;
        } else {

            this.isStone = true;
            // if(this.box.getComponent("box").checkRoleOnThisBox() === true) {
               
            // }
        }

        cc.audioMgr.playEffect("stoneDroped");

       
    },

    stoneEnd:function() {
        this.isStone = false;
        this.gameJS.stonePool.put(this.node);
    },

    update:function(dt) {
        if(this.isStone) {
             if(this.box.getComponent("box").checkRoleOnThisBox() === true) {
                cc.audioMgr.playEffect("vertigo");
                if(this.gameJS.roleJS.isInvincible === false) {
                    this.gameJS.roleJS.dizzyAnimation(function () {

                        this.gameJS.openTouch();
                        this.vertigo.getComponent(cc.Animation).stop();
                        this.vertigo.active = false;
                    }.bind(this.gameJS.roleJS));
                }
                this.isStone = false;
            }
        }
    }
   
   

});
