const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class CameraMove extends cc.Component {
    //用于规范摄像机区域的值  他不是对称的
    hallLeftWidth = 2800;
    hallRightWidth = 6400;
    hallUpHeight = 3400;
    hallDownHeight = 2500;
    screenW = cc.director.getWinSizeInPixels().width;
    screenH = cc.director.getWinSizeInPixels().height;
    onLoad(){
        //console.log("onLoad")
    }
    
    start() {
        //console.log(cc.director.getWinSize())
        //console.log(cc.director.getWinSizeInPixels())
        let self = this
        this.node.getComponent("ClickEventListener").onStart = function(event){
            let touchPos = event.getLocation();
            // console.log(touchPos);
            // console.log(cc.director.getVisibleSize());
            self._beginPos = touchPos;
        }
        this.node.getComponent("ClickEventListener").onMove = function(event){
            //console.log(self.node.name)
            if (self._beginPos) {
                //console.log('touch move by game');
                let movePos = event.getLocation();
                let addX = movePos.x - self._beginPos.x;
                let addY = movePos.y - self._beginPos.y;

                //移动相机

                let addPos = self.getAddPosition_v2(-addX, -addY)
                self.node.setPosition(cc.v2(self.node.x + addPos.x, self.node.y + addPos.y));
                self._beginPos = movePos;


            }
        }
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     console.log(self.node.name)
        // })
        this.loadData()
    }
    loadData(){
        
    }
    update(){}
    //输入相机的 dx，dy，根据限制来加工处理，返回一份要求的dx，dy，防止移动出最大范围
    getAddPosition_v2(addX,addY) {
        if (addX < -this.hallLeftWidth / 2 + this.screenW / 2 - this.node.x)
            addX = -this.hallLeftWidth / 2 + this.screenW / 2 - this.node.x;
        if (addX > this.hallRightWidth / 2 - this.screenW / 2 - this.node.x)
            addX = this.hallRightWidth / 2 - this.screenW / 2 - this.node.x;
        if (addY < -this.hallDownHeight / 2 + this.screenH / 2 - this.node.y)
            addY = -this.hallDownHeight / 2 + this.screenH / 2 - this.node.y;
        if (addY > this.hallUpHeight / 2 - this.screenH / 2 - this.node.y)
            addY = this.hallUpHeight / 2 - this.screenH / 2 - this.node.y;
        return cc.v2(addX, addY);
    }
}