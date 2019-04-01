const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {

    _audioSource_o = null;

    onLoad() {
        if(!cc.audioMgr){
            cc.audioMgr = this
        }
        this.init();
    }

    init() {
        this._audioSource_o = {};
        let node_sound = this.node
        if (node_sound) {
            for (let i = 0; i < node_sound.children.length; ++i) {
                let nodeN = node_sound.children[i];
                this._audioSource_o[nodeN.name] = nodeN.getComponent(cc.AudioSource);
            }
        }
    }

    //type_s 为这个音乐的名称
    playEffect(type_s) {
        //console.log(type_s)
        if (cc.moduleMgr.tempModule.module.is_sound) {
            let source = this._audioSource_o[type_s];
            if (source) {
                source.play();
            }
        }
    }

    stopEffect(type_s) {
        let source = this._audioSource_o[type_s];
        if (source) {
            source.stop();
        }
    }

    playBg() {
        if (cc.moduleMgr.tempModule.module.is_sound) {
            let source = this._audioSource_o["bg"];
            if (source) {
                source.play();
            }
        }
    }

    stopBg() {
        let source = this._audioSource_o.bg;
        if (source) {
            source.pause();
        }
    }

    pauseAll() {
        cc.audioEngine.pauseAll();
    }

    resumeAll() {
        cc.audioEngine.resumeAll();
    }
}