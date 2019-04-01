export default class ItemModule{
    constructor(data,idx) {
        this.index = idx != null ? idx : this.index
        this._Data = {
                id:data.id != null ? data.id : this._playerData.id,
                count:data.count != null ? data.count : this._playerData.count,
            }
    };
    get id(){
        return this._Data.id
    }
    set id(value){
        this._Data.pid = value
    }
    get count(){
        return this._Data.count
    }
    set count(value){
        this._Data.count = value
    }
}