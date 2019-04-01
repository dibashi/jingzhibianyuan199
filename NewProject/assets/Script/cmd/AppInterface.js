export default class AppInterface{
    snCount = 0
    constructor(){
       
    }
    GetSn(){
        this.snCount = this.snCount + 1
        return this.snCount
    }
    Login(account,password){
        var sn = this.GetSn()
        var jsonString = {"Id": 1000,"Sn": sn,"Info": account}
        cc.NewWebSocket.SendSocket(jsonString)
        return sn
    }
    ItemChange(id,count){
        let Items = []
        let old = cc.moduleMgr.itemModule.ItemCount(id)
        Items.push({id:id,count:old + count})
        window.Notification.emit("server_respond_1100",Items)
    }
    UpdateScore(score){
        window.Notification.emit("server_respond_1200",{score:score})
    }
    NewbieGuideChange(id,group_id){
        let arr = []
        arr.push({id:id,group_id:group_id,time:cc.tools.NowTime()})
        window.Notification.emit("server_respond_1300",arr)
    }
    SignChange(id){
        let arr = []
        arr.push({id:id,lock:true,time:cc.tools.NowTimeZero()})
        window.Notification.emit("server_respond_1400",arr)
    }
}