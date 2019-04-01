

const BoxX = 72;
const BoxY = 72;

const BoxType = {
    normalBox: 0,
    blockBox: 1,
    noneBox:2,//悬崖
}

const BoxDir = {
    left:0,
    right:1
}

const MaxZIndexOfBox = 9999;
//初始 生成的box数量
const InitBoxCount = 15;
//初始往右的box数量
const InitRightBoxCount = 4;

//跳跃动作时间
const JumpTime = 0.12;

//相机在多长时间内必须跟随到角色
const CameraFollewTime = 0.3;

//障碍物图片个数
const BlockImageCount = 5;

//对象池中 box的数量，用来优化程序性能
const BoxPoolSize = 30;
//脚印的偏移量
const FootY = -4;
//障碍物、道具 的偏移量
const PropY = -20;



var RoleType = {
    accelerateType: 0,//加速角色 根据次数进行加速 自动寻路
    slowDownType: 1,//减速角色  减速掉落
}

//加速过程中的跳跃间隔
const AccelerateInterval = 0.15
//加速跳跃次数
const AccelerateTotalCount = 50;