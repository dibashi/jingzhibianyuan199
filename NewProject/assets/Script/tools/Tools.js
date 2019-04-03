import ImageController from 'ImageController';
const {
    ccclass,
    property
} = cc._decorator;Tools

@ccclass
export default class Tools extends cc.Component {
    //格式化字符串
    //a = "这是*一*个*测试"
    //b = "7,8,9"
    //return "这是7一8个9测试"
    stringFormat(a,b,s){
        let symbol = "*"
        if (s){
            symbol = s
        }
        let a1 = a.split(symbol)
       //let b1 = b.split(",")
        let c = ""
        for(let i = 0;i < a1.length;i++){
            c = c + a1[i]
            if (b[i]){
                c = c + b[i]
            }
        }
        return c
    }
    NowTime(){
        return parseInt(Date.now() / 1000);
    }
    NowTimeZero(){
        return parseInt(new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000);
    }
    TimeFormat(restSec){
        //var restSec = end - time
        var min = Math.floor(Math.floor(restSec/60)%60)
        if (min < 10){
            min = "0"+min
        }
        var sec = Math.floor(restSec%60)
        if (sec<10){
            sec = "0"+sec
        }
        if (restSec > 0){
            return (min+":"+sec)
        }else{
            return 0
        }
    }
    typingAni(label, text, cb) {
        var self = this;
        var html = '';
        var arr = text.split('');
        var len = arr.length;
        var step = 0;
        self.func = function () {
            if (cc.isValid(label)){
                html += arr[step];
                label.string = html;
                if (++step == len) {
                    self.unschedule(self.func, self);
                    cb && cb();
                }
            }
        }
        self.schedule(self.func,0.05, cc.macro.REPEAT_FOREVER, 0)
    }
    
    changeSprite(_this,icon){
        //console.log(_this)
        if (icon){
            if (this.ImageController == null){
                this.ImageController = cc.find("Notification").getChildByName("imageController").getComponent("ImageController");
            }
            let url = 'texture/'+icon;
            let urls = icon.split("/")
            //console.log(urls);
            let image = this.ImageController.getpictures(urls[urls.length-1])
            if (image){
                _this.getComponent(cc.Sprite).spriteFrame = image
            }else{
                cc.loader.loadRes(url,cc.SpriteFrame,function(err,_spriteFrame){
                    if (err == null){
                        _this.getComponent(cc.Sprite).spriteFrame = _spriteFrame; 
                    }else{
                        console.log(err)
                    }
                });
            }
        }else{
            _this.getComponent(cc.Sprite).spriteFrame = null
        }
    }
    changeMotionStreak(_this,icon){
        if (icon){
            if (this.ImageController == null){
                this.ImageController = cc.find("Notification").getChildByName("imageController").getComponent("ImageController");
            }
            let url = 'texture/'+icon;
            let urls = icon.split("/")
            //console.log(urls);
            let image = this.ImageController.getpictures(urls[urls.length-1])
            if (image){
                _this.getComponent(cc.MotionStreak).texture = image
            }else{
                cc.loader.loadRes(url,function(err,_spriteFrame){
                    if (err == null){
                        _this.getComponent(cc.MotionStreak).texture = _spriteFrame; 
                    }else{
                        console.log(err)
                    }
                });
            }
        }else{
            _this.getComponent(cc.MotionStreak).texture = null
        }
    }
    shopBuy(conf){
        let sum = 0
        for (let i = 0;i<conf.probability.length;i++){
            sum = sum + conf.probability[i]
        }
        let random = Math.floor(Math.random()*sum)
        sum = 0
        for (let i = 0;i<conf.probability.length;i++){
            sum = sum + conf.probability[i]
            if (random <= sum){
                return {id:conf.items[i],count:conf.prices[i],index:i}
            }
        }
        return {id:conf.items[0],count:conf.prices[0],index:0}
    }
    showlog(desc){
        cc.uiMgr.Push("tipsFrame",desc,{add:false,parentName:"Canvas/UI2dUp"})
    }
    Notification = null
    getPrefab(name){
        if (this.Notification == null){
            this.Notification = cc.find("Notification").getComponent("Notification");
        }
        return this.Notification.getPrefab(name)
    }
    convetOtherNodeSpace(node, targetNode) {
		if (!node || !targetNode) {
			return null;
		}
		var worldPoint = this.localConvertWorldPoint(node);
		var tempPoint = this.worldConvertLocalPoint(targetNode, worldPoint);
		targetNode.setPosition(tempPoint.x+targetNode.position.x,tempPoint.y+targetNode.position.y);
	}
	localConvertWorldPoint(node) {
		if (node) {
			//console.log(node.convertToWorldSpace(cc.v2(0, 0)));
			//console.log("^^^^^^^^^^^^^^"+node.getPosition());
			return node.convertToWorldSpace(cc.v2(0, 0));
		}
		return null;
	}
	worldConvertLocalPoint(node,worldPoint) {
		if (node) {
			return node.convertToNodeSpace(worldPoint);
		}
		return null;
    }
    get isDebug(){
        return cc.config("param")[1].debug
    }
    _HandTutorial = null
    set HandTutorial(value){
        this._HandTutorial = value
    }
    showHandTutorial(id){
        if (this._HandTutorial == null){
            cc.uiMgr.Push("HandTutorial",{id:id},{add:false})//触发新手礼包引导
        }
    }
    //---------------------------------------------------------------------------------
    //↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓耦合封装↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
    //---------------------------------------------------------------------------------
    itemConfig = null
    itemFormat(thingType,thingLevel){
        if (this.itemConfig == null){
            this.itemConfig = []
            let itemConf = cc.config("item")
            for(var i in itemConf){
                if (this.itemConfig[itemConf[i].thingType] == null){
                    this.itemConfig[itemConf[i].thingType] = []
                }
                this.itemConfig[itemConf[i].thingType][itemConf[i].thingLevel] = itemConf[i]
            }
        }
        // console.log(this.itemConfig)
        // console.log(cc.config("item"))
        return this.itemConfig[thingType][thingLevel]
    }
    itemCompoundConfig = null 
    itemCompound(itemid){
        let itemConf = cc.config("item")
        if (this.itemCompoundConfig == null){
            this.itemCompoundConfig = []
            for(let i in itemConf){
                if (this.itemCompoundConfig[itemConf[i].compound] == null){
                    this.itemCompoundConfig[itemConf[i].compound] = []
                }
                this.itemCompoundConfig[itemConf[i].compound][itemConf[i].id] = itemConf[i]
            }
        }
        return this.itemCompoundConfig[itemid]
    }
    itemSyntheticData(thingType,thingLevel){
        let itemConf = cc.config("item")
        let conf = this.itemFormat(thingType,thingLevel)
        if (itemConf[conf.compound]){
            return {thingType:itemConf[conf.compound].thingType,thingLevel:itemConf[conf.compound].thingLevel}
        }
        return null
    }
    NovicePrefab(){
        let index = cc.moduleMgr.NewbieGuideModule.NewbieGuideIndex
        //console.log(index)
        let conf = cc.config("Novicecheckpoint")
        if (conf[index]){
            let name = conf[index].prefab
            let prefab = this.getPrefab(name)
            if (prefab){
                return prefab
            }
        }
        return null
    }
    checkpointConfig(x,y){
        let id = 0
        if (cc.moduleMgr.tempModule.module.nowNoviceData.id){
            let Novicecheckpoint_id = cc.moduleMgr.tempModule.module.nowNoviceData.idx+1
            let Novicecheckpoint = cc.config("Novicecheckpoint"+Novicecheckpoint_id)
            id = Novicecheckpoint[x][y+""]
        }else{
            let Checkpoint_id = cc.moduleMgr.tempModule.module.Checkpoint_id
            let CheckpointConf = cc.config("checkpoint"+Checkpoint_id)
            id = CheckpointConf[x][y+""]
        }
        return cc.config("checkpointItem")[id]
    }
}