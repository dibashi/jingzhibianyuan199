

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
const InitBoxCount = 6;

//跳跃动作时间
const JumpTime = 0.12;

//障碍物图片个数
const BlockImageCount = 5;

//对象池中 box的数量，用来优化程序性能
const BoxPoolSize = 30;
//脚印的偏移量
const FootY = -4;
//障碍物、道具 的偏移量
const PropY = -20;

