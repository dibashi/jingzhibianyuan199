
const gameStates = Object.freeze({
    unStart: 0,//游戏未开始
    preparing: 1,//游戏准备开始
    starting: 3,//游戏在进行中
    paused: 4//游戏暂停
});

const BoxX = 72;
const BoxY = 72;

const BoxType = {
    normalBox: 0,
    blockBox: 1,
    noneBox: 2,//悬崖
}

const BoxDir = {
    left: 0,
    right: 1
}

const MaxZIndexOfBox = 9999;
//初始 生成的box数量
const InitBoxCount = 15;
//初始往右的box数量
const InitRightBoxCount = 4;

//跳跃动作时间
const JumpTime = 0.12;

//相机在多长时间内必须跟随到角色
const CameraFollewTime = 0.4;

//障碍物图片个数
const BlockImageCount = 5;

//对象池中 box的数量，用来优化程序性能
const BoxPoolSize = 50;
//脚印的偏移量
const FootY = -4;
//障碍物、道具 的偏移量
const PropY = -20;

//金币掉落概率
const CoinProb = 0.015;
//金币掉落后  是小金币还是大金币？ 
const SmallCoinProb = 1.0;
const BigCoinProb = 0.0;
//新需求 不再是单个金币，而是钱串 需要一个持续生成钱串的时间，为了随机性 有个最长时间和最短时间
const CoinGenMinTime = 1.0;
const CoinGenMaxTime = 4.0;

//生成多少个砖块后加速一次
const BoxAccelerateCount = 20;
//一次加速多少 砖块的掉落速度
const DeltaOfBoxAcc = 0.02;

//砖块初始掉落速度
const BoxInitSpeed = 0.4;
//砖块掉落的极限时间
const BoxLimitDropTime = 0.26;

//金币类型的标示, 注！！！！！ 顺带定义了数量  类型===数量
const CoinType = Object.freeze({
    noneCoin: 0,
    smallCoin: 1,
    bigCoin: 10,
});



const RoleType = Object.freeze({
    normalType: 0,//什么技能也没有的角色
    accelerateType: 1001,//加速角色 根据次数进行加速 自动寻路
    slowDownType: 1002,//减速角色  减速掉落
});


const Role_Normal_Data = Object.freeze(
    {

        Role_Image: "role_right1",
        Streak_Image: "role_streak1",
    }
);

const Role_Accelerate_Data = Object.freeze(
    {
        AccelerateInterval: 0.15,//加速过程中的跳跃间隔
        AccelerateTotalCount: 50,//加速跳跃次数
        Role_Image: "role_right2",
        Streak_Image: "role_streak2",
    }
);

const Role_SlowDown_Data = Object.freeze(
    {
        SlowCoefficient: 5,//慢多长时间 不在关联当前速度
        RestTime: 10,//慢多长时间
        Role_Image: "role_right3",
        Streak_Image: "role_streak3",
    }
)