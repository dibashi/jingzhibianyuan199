cc.Class({
    extends: cc.Component,

    properties: {
        initCount: {
            default: 6,
            displayName: "初始数量",
            tooltip: "游戏开始时，生成box的数量",
        },

        boxPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {

        this.boxX = 72;
        this.boxY = 72;

        this.lastBoxX = 72;
        this.lastBoxY = 72;


    },

    start: function () {


    },

    // called every frame
    update: function (dt) {

    },

    initBoxes: function (callback) {

        for (var i = 0; i < this.initCount; i++) {
            this.createBox();
        }

        callback();
    },

    createBox: function () {

        var box = cc.instantiate(this.boxPrefab);
        this.node.addChild(box);
        box.getComponent('box').initBox(cc.v2(posX, posY), BoxDir.left, BoxType.normalBox);
    }


});
