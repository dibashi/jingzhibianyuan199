
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

       
        this.isLighting = false;
    },

    lasering:function() {
        //console.log("发射激光了");

        if(!this.box) {
            debugger;
        } else {
            // if(this.box.getComponent("box").checkRoleOnThisBox() === true) {
            //     //cc.audioMgr.playEffect("vertigo");//改为闪屏声
            //     console.log("闪屏");
            // }

            this.isLighting = true;
        }

        //cc.audioMgr.playEffect("stoneDroped");

       
    },

    laserEnd:function() {
        this.isLighting = false;
        this.gameJS.laserPool.put(this.node);
    },

    update:function(dt) {
        if(this.isLighting) {
             if(this.box.getComponent("box").checkRoleOnThisBox() === true) {
                //cc.audioMgr.playEffect("vertigo");//改为闪屏声
                if(this.gameJS.roleJS.isInvincible === false) {//非无敌状态
                    Notification.emit("skillShowTime",{id:2003});
                }
                //console.log("闪屏");
                this.isLighting = false;
            }
        }
    }
   

});
