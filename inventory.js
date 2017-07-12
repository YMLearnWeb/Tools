var Inventory = (function(){
    function serviceInventory(url,args){
        $.ajax({
            url: url,
            data:args
        }).done(function(data){
            return data;
        });
    }

function Inventory(item){
    this._item = item;
    this._quantity = item.quantity;
    this._data = item.inventory;
    this._message_type = 0;
    this._message = "";
}

Inventory.prototype = {
    get: function(args){
        this._data = serviceInventory(args);
    },
    check: function(){
        if(this._data< this._item.quantity){
            this._message = "库存:" + this.__inventory;
            return 1 //'库存不足';
        }else if(this._data ===this._item.quantity){
            this._message = '库存紧张';
            return 2  //'库存紧张';
        }
    }
};
    return Inventory;
});
