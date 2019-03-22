

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