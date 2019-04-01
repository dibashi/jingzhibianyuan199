const {
    ccclass,
    property
} = cc._decorator;

@ccclass
export default class ImageController extends cc.Component {
    @property(cc.SpriteFrame)
    pictures = []
    getpictures(name){
        for(let i = 0;i<this.pictures.length;i++){
            //console.log(this.pictures[i],name)
            if (this.pictures[i].name == name){
                return this.pictures[i]
            }
        }
        return null
    }
}