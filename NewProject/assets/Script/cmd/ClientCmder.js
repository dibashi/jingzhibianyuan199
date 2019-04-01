
export default class ClientCmder{
    constructor(){
        window.Notification.on("server_respond_1000",function(data){
            if (data.Result == 0) {
                console.log("账号登录成功"+ data.Id)
                //ModuleMgr.GetModule().playerModule.AddOrUpdateSimpleData(data.Info) //.playerModule.AddOrUpdateSimpleData(1234)
                //console.log(ModuleMgr.GetModule().playerModule.GetData().getName())
                alert("登录成功")
            }else{
                console.log("账号登录失败"+ data.Result)
            }
            //console.log("!"+data[0],data[1],data[2])
        },true)
        window.Notification.on("server_respond_1100",function(data){
            cc.moduleMgr.itemModule.AddOrUpdateDatas(data)
        },true)
        window.Notification.on("server_respond_1200",function(data){
            cc.moduleMgr.playerModule.UpdateScore(data)
        },true)
        window.Notification.on("server_respond_1300",function(data){
            cc.moduleMgr.NewbieGuideModule.AddOrUpdateDatas(data)
        },true)
        window.Notification.on("server_respond_1400",function(data){
            cc.moduleMgr.SignModule.AddOrUpdateDatas(data)
        },true)
    }
}
