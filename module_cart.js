var ShoppingCart = function($){
    "use strict";
/*
 *service call
 */
var sendTime;
/*
 *url: "/Cart/RemoveCartItem"
 * @param {string} id
 * @param {array} checkedItem
 * @param function fn
 */
function callRemoveCartItem(id,checkedItem,fn){
	if(call && call.readyState != 4){
		call.abort();
	}
	var call = $.ajax({
		url: "/Cart/RemoveCartItem",
		data:{
			cartItemId:id,
			items: checkedItem.join(','),
			ts:function () {
				sendTime = Date.now();
				return sendTime;
			}
		}
	}).done(function(data){
		if(data.ts == sendTime){
			fn(data);
		}
	}).fail(function(){
		return null
	})
}

/*
* url:"/Cart/getQuantity"
* @param {string} id
* @param function fn
*/
function callGetQuantity(id,Item,fn){
	if(call && call.readyState != 4){
		call.abort();
	}
    var call = $.ajax({
        url:"/Cart/getQuantity",
        data:id
    }).done(function(data){
			fn(data);
    }).fail(function(){
    	return null;
    });
}

/*
* url:"/Cart/UpdateCartItem"
* @param {string} id
* @param {number} quantity
* @param {array} checkedItem
* @param function fn
* @param {Date} sendTime
*/
function callUpdateQuantity(id,quantities,checkedItem,fn){
	if(call && call.readyState != 4){
		call.abort();
	}
 	var call = $.ajax({
        url: "/Cart/UpdateCartItem",
        data: {
            cartItemId: id,
            quantity: quantities,
            items: function(){
            	return checkeItem.join(',');
            },
            ts: function (){
                sendTime = Date.now();
                return sendTime;
            }
        },
        type: "Get"
    }).done(function (data) {
        if (data.ts == sendTime) {
   			fn(data);
        }
    }).fail(function (data) {
        return null;
    });
}

/*
*url: "/Cart/GetCart",
*@param array checkeditem
*@param function fn
*@param date sendTime
*/

function callGetCart(checkedItem,fn){
	if(call && call.readyState != 4){
		call.abort();
	}
	var call = $.ajax({
		url: "/Cart/GetCart",
		data: {
			items: function () {
				return checkedItem.join(',');
			},
			ts: function () {
				sendTime = Date.now();
				return sendTime;
			}
		},
		type: "Get"
	}).done(function (data) {
		if (data.ts == sendTime) {
			fn(data);
		}
	}).fail(function () {
		return null;
	});
}
/*
 * @Class Item:
 * @constructor
 * @param {string} ruleid
 * @param {string} id
 * @param {bool} status
 * @param {number} quantity
 * @param {string} orginalPerPrice
 * @param {string} actualPerPrice
 * @param {string} finalAmount
 * @param {bool} inventoryShort
 */
 function Item(ruleid,id,status,quantity,originalPerPrice,actualPerPrice,finalAmount,inventoryShort){
     this._ruleid = ruleid;
     this._id = id;
     this._status = status;
     this._quantity = quantity;
     this._originalPerPrice = originalPerPrice;
     this._actualPerPrice = actualPerPrice;
     this._finalAmount = finalAmount;
     this._inventorShort = inventoryShort; //true : shortage
 }

 Item.prototype.updatePrice = function(op,ap,fa,i_notifyupdateprice){
     if(this._originalPerPrice !== op){
         this._originalPerPrice = op;
     }
     if(this._actualPerPrice !== ap){
         this._actualPerPrice = ap;
     }
     if(this._finalAmount !== fa){
         this._finalAmount = fa;
     }
     i_notifyupdateprice();
 };

 Item.prototype.updateQuantity = function(num){
     this._quantity = num;
 };

Item.prototype.updateStatus = function(status,i_notifyupdatestatus){
    this._status = status;
    i_notifyupdatestatus();
};

Item.prototype.updateInventory = function(inventorShort,i_notifyinventoryshort){
    this._inventorShort = inventoryShort;
    i_notifyinventoryshort();
};
/*
 * @Class Cart
 * @constructor
 */
 function Cart(){
 	this._itemGroups = {};
 	this._checkedItem = [];
 	this._finalAmount = 0;
 	this._discountAmount = 0;
 	this._minusAmount = 0;
 }

 Cart.prototype= {
 	clearAll: function(){
 		this.itemGroups = {}; //objecs
	 	this.checkedItem = []; //ids
	 	this.finalAmount = 0;
	 	this.discountAmount = 0;
	 	this.minusAmount = 0;
 	},
 	selectAll: function(callback){
 		var self = this;
 		for(var key in self.itemGroups){
 			if(self.itemGroups[key].status === false)
 			self.itemGroups[key].status = true;
 			self.checkedItem.push(i);
 		}

 		callGetCart(self.checkedItem,function(data){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (i,t) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);
 		});
 	},
 	deSelectAll:function(callback){
 		var self = this;
 		for (var key in self.itemGroups){
 			if(self.itemGroups[key].status === true)
 			self.itemGroups[key].status = false;
 		}
 		self.checkedItem = [];
 		callGetCart(Self.checkedItem,function(data){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (i,d) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);
 		});
 	},
 	addItem:function(Item){
 		this.itemGroups[Item.id] = Item;
 		if(Item.status && _.includes(this.checkeItem,Item.id) === false ){
 			this.checkedItem.push(Item.id);
 		}
 	},
 	removeItem: function(Item,callback){
 		var self = this;
 		delete self.itemGroups[Item.id];
 		_.remove(self.checkedItem,function(n){
 			return n === id;
 		});
 		callRemoveItems(Item.id, self.checkedItem,function(data){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (i,d) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);
 		});
 	},
 	removeItems:function(Items,callback){
		sendTime = Date.now();
 		var self = this;
 		for(var i =0; i<self.checkedItem.length;i++){
 			delete self.itemGroups(self.checkedItem[i])
 		}
 		self.checkedItem = [];
		self.discountAmount = 0;
 		self.finalAmount = 0;
 		self.minusAmount = 0;
 	},
 	changeQuantity:function(Item,c_notifychangequantity){
		/*
		 * Item has sizes, subItem, each has its inventory and quantity
		 * notify function returns inventory message
		*/
		function subItem(){
			this._quantity = 0;
			this._inventory = 0;
		}
		subItem.prototype.updateQuantity = function(quantity,notify){
			var self = this;
            var msg = "";
			if(quantity > self._inventory){
				this._quantity = self._inventory;
			    msg = "库存:" + self._inventory;
			}else if(quantity <== 0 ){
				this._quantity = 1;
			}else{
                this._quantity = quantity;
            }
            notify({msg:msg});
		}
		subItem.prototype.updateInventory = function(inventory){
			this._inventory = inventory;
		}
		// var quantity = Item.quantity; //Item sum quantity
		//init
		callGetQuantity(Item,function(data){
			for(var key in data){
				Item[key] = new subItem();
				Item[key]._inventory = data[key].inventory;
				Item[key]._quantity = data[key].quantity;
			}
            c_notifychangequantity();
		})
 	},
    saveQuantity:function(Item,c_notifysavequantity){
        var self = this;
        var quantities = {};
        for(var key in Item){
            quantities[key] = Item[key]._quantity;
            Item[key] = null; // delete subitem instances
        }
        // callUpdateQuantity(id,quantities,checkedItem,fn)
        callUpdateQuantity(Item.id,quantities,self.checkedItem,function(data){
            self._discountAmount = data.discountAmount;
            self._finalAmount = data.finalAmount;
            self._minusAmount = data.minuseAmount;
            Item._quantity = data.quantity;
            //observer item inventory and price
            $.each(data.items, function (i,d) {
                var id = d.itemId;
                self.observeItemPrice(self.itemGroups[id], d);
            });
            c_notifysavequantity();
        })
    }
 	changeCheck: function(Item,check,c_notifychangecheck){
		var self = this;
        // Item.updateStatus(check);
		if(check){
			self._checkedItem.push(Item.id);
		}else{
			_.remove(self._checkedItem,function(n){
				return n == Item.id;
			})
		}
        c_notifychangecheck();
    },
    checkedItemUpdate: function(){
        if(self._checkedItem.length > 0){
            setTimeout(function(){
                callGetCart(self.checkedItem,function(data){
                    self.discountAmount = data.discountAmount;
                    self.finalAmount = data.finalAmount;
                    self.minusAmount = data.minuseAmount;

                    //observer item inventory and price
                    $.each(data.items, function (i,d) {
                        var id = d.itemId;
                        self.observeItemPrice(self.itemGroups[id], d);
                    });
                    c_notifychangecheck();
                })
            },200)
        }else{
            sendTime = Date.now();
            self.discountAmount = 0;
            self.finalAmount = 0;
            self.minusAmount = 0;
            c_notifychangecheck();
        }
    },
 observeItemPrice: function(Item,dataitem){
 		var self = this;
        Item.updatePrice(dataitem.originalPrice,dataitem.actualPrice,dataitem.actualAmount);
    }
 }
 return {
     Cart: Cart,
     Item: Item
 }
 })(jQuery)
