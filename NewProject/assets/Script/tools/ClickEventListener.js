const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class ClickEventListener extends cc.Component {
    onClick = null
    onPress = null
    onMove = null
    onStart = null
    onLoad(){
        //this.onClick = null
        //this.onPress = null
        //console.log("onLoad")
    }
    localInit(data){
        //console.log("localInit"+data.name+data.id)
    }
    start() {
        let self = this
        // this.clickEventHandler = this.node.getComponent(cc.Button).clickEvents[0]
        // this.clickEventHandler.target = this.node;
        // this.clickEventHandler.component = "ClickEventListener";
        // this.clickEventHandler.handler = "ClickCallBack";
        //this.clickEventHandler.customEventData = i+","+index;
        // cc.Node.EventType.TOUCH_START 当手按下时触发//当手指触摸到屏幕时。
        // cc.Node.EventType.TOUCH_END 当手抬起时候//当手指在目标节点区域内离开屏幕时。
        // cc.Node.EventType.TOUCH_MOVE 当手按下滑动时//当手指在屏幕上目标节点区域内移动时。
        // cc.Node.EventType.TOUCH_CANCEL 当手按下滑动后 抬起时//当手指在目标节点区域外离开屏幕时。
        this.node.on(cc.Node.EventType.TOUCH_START,function(event, customeData){
            if (self.onPress){
                self.onPress(true,event)
            }
            if (self.onStart){
                self.onStart(event)
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END,function(event, customeData){
            if (self.onPress){
                self.onPress(false,event)
            }
            if (self.onClick){
                cc.audioMgr.playEffect("btn_click");
                self.onClick.call(this)
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,function(event, customeData){
            if(self.onMove){
                self.onMove(event)
            }
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(event, customeData){
            if (self.onPress){
                self.onPress(false,event)
            }
        }, this);
    }
    ClickCallBack(event,customEventData){
        //console.log(event)
        // if (this.onClick){
        //     this.onClick()
        // }
    }
    update(){}
}