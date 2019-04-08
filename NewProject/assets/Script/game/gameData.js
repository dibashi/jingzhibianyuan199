
window.gameStates = Object.freeze({
    unStart: 0,//游戏未开始
    preparing: 1,//游戏准备开始
    starting: 3,//游戏在进行中
    paused: 4//游戏暂停
});

window.BoxX = 72;
window.BoxY = 72;

window.BoxType = {
    normalBox: 0,
    blockBox: 1,
    noneBox: 2,//悬崖
}

window.BoxDir = {
    left: 0,
    right: 1
}

window.MaxZIndexOfBox = 9999;
//初始 生成的box数量
window.InitBoxCount = 15;
//初始往右的box数量
window.InitRightBoxCount = 4;

//跳跃动作时间
window.JumpTime = 0.12;

//相机在多长时间内必须跟随到角色
window.CameraFollewTime = 0.8;

//障碍物图片个数
window.BlockImageCount = 5;

//对象池中 box的数量，用来优化程序性能
window.BoxPoolSize = 80;
//脚印的偏移量
window.FootY = -4;
//障碍物、道具 的偏移量
window.PropY = -20;

//金币掉落概率
window.CoinProb = 0.015;
//金币掉落后  是小金币还是大金币？ 
window.SmallCoinProb = 1.0;
window.BigCoinProb = 0.0;
//新需求 不再是单个金币，而是钱串 需要一个持续生成钱串的时间，为了随机性 有个最长时间和最短时间
window.CoinGenMinTime = 1.0;
window.CoinGenMaxTime = 4.0;

//生成多少个砖块后加速一次
window.BoxAccelerateCount = 20;
//一次加速多少 砖块的掉落速度
window.DeltaOfBoxAcc = 0.02;

//砖块初始掉落速度
window.BoxInitSpeed = 0.4;
//砖块掉落的极限时间
window.BoxLimitDropTime = 0.22;

//金币类型的标示, 注！！！！！ 顺带定义了数量  类型===数量
window.CoinType = Object.freeze({
    noneCoin: 0,
    smallCoin: 1,
    bigCoin: 10,
});



window.RoleType = Object.freeze({
    normalType: 0,//什么技能也没有的角色
    accelerateType: 1001,//加速角色 根据次数进行加速 自动寻路
    slowDownType: 1002,//减速角色  减速掉落
});


window.Role_Normal_Data = Object.freeze(
    {

        Role_Image: "role_right1",
        Streak_Image: "role_streak1",
    }
);

window.Role_Accelerate_Data = Object.freeze(
    {
        AccelerateInterval: 0.15,//加速过程中的跳跃间隔
        AccelerateTotalCount: 50,//加速跳跃次数
        Role_Image: "role_right2",
        Streak_Image: "role_streak2",
    }
);

window.Role_SlowDown_Data = Object.freeze(
    {
        SlowCoefficient: 5,//慢多长时间 不在关联当前速度
        RestTime: 10,//慢多长时间
        Role_Image: "role_right3",
        Streak_Image: "role_streak3",
    }
)