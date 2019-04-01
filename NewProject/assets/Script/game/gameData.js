

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

//难度递增间隔
const AddDifficultyInterval = 10;

//最小跳跃和掉落的时间 
const MinQuickly = 0.3;
//每次减少的时间量
const ReduceTime = 0.1;

