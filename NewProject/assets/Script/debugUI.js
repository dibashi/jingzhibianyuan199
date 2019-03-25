
cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        diamondLabel: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.gameJS = cc.find('Canvas/game').getComponent('game');

        this.diamondCount = 100;
    },

    start() {

    },

    onEnable: function () {
        this.scoreLabel.string = "当前得分" + this.gameJS.getCurrentScore();
        this.diamondLabel.string = this.diamondCount;
    },


    reStart() {
        this.gameJS.startGame();

        this.node.active = false;
    },

    relive: function () {
        this.gameJS.reliveGame();
        this.node.active = false;
        this.diamondCount -= 3;
    }

});
