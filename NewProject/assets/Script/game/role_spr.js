
cc.Class({
    extends: cc.Component,

    properties: {
        

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

      
    },

    start() {
        
    },

     /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        /**
         * {
         *  tag= 0是stone
         * }
         */

        //console.log(other);
        if(other.tag === 0) {
            console.error("角色被碰到了！！");
        }
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;

        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;

        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;

        // // 碰撞框的世界矩阵
        // var t = world.transform;

        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;

        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
    },

});
