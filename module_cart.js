/*
 *service call
 */

/*
 *url: "/Cart/RemoveCartItem"
 * @param string id
 * @param array checkedItem
 * @param function fn

 */
function removeCartItem(id,checkedItem,fn){
	var sendTime;
	$.ajax({
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
			fn();
		}
	}).fail(function(){
		return null
	})
}

/*
* url:"/Cart/getQuantity"
* @param string id
* @param function fn
*/
function getQuantity(id，fn){
    $.ajax({
        url:"/Cart/getQuantity",
        data:id
    }).done(function(data){
       
    }).fail(function(){
    	return null;
    });	
}

/*
* url:"/Cart/UpdateCartItem"
* @param string id
* @param int quantity
* @param array checkedItem
* @param function fn
* @param date sendTime
*/
function updateCartItem(id,quantity,checkedItem,fn){
	var sendTime;
 $.ajax({
        url: "/Cart/UpdateCartItem",
        data: {
            cartItemId: id,
            quantity: quantity,
            items: function(){
            	return checkeItem.join(',')
            }
            ts: function () {
                sendTime = Date.now();
                return sendTime;
            }
        },
        type: "Get"
    }).done(function (data) {
        if (data.ts == sendTime) {
   			fn();
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

function getCart(checkedItem,fn){
	var sendTime;
	$.ajax({
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
			fn();
		}
	}).fail(function () {
		return null;
	});
}

/* 
 * cart model: array checkedItem,object itemGroups, int finalAmount, int discountAmount, int minusAmount
 * 
 */
 function Cart(){
 	this.itemGroups = {};
 	this.checkedItem = [];
 	this.finalAmount = 0;
 	this.discountAmount = 0;
 	this.minusAmount = 0;
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
 			self.checkedItem.push(i)
 		}

 		getCart(self.checkedItem,function(){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (id) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);			
 		})
 	},
 	deSelectAll:function(callback){
 		var self = this;
 		for (var key in self.itemGroups){
 			if(self.itemGroups[key].status === true)
 			self.itemGroups[key].status = false;
 		}
 		self.checkedItem = [];
 		getCart(Self.checkedItem,function(){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (id) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);	
 		})
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
 		})
 		removeItems(Item.id, self.checkedItem,function(){
 			self.discountAmount = data.discountAmount;
 			self.finalAmount = data.finalAmount;
 			self.minusAmount = data.minuseAmount;

 			//observer item inventory and price
 			$.each(data.items, function (id) {
				var id = d.itemId;
				self.observeItemPrice(self.itemGroups[id], d);
			});
			callback(self);	
 		})
 	},
 	removeItems:function(Items,callback){
 		var self = this;
 		for(var i =0; i<self.checkedItem.length;i++){
 			delete self.itemGroups(self.checkedItem[i]);
 		}
 		self.checkedItem = [];
		self.discountAmount = 0
 		self.finalAmount = 0
 		self.minusAmount = 0
 	},
 	changeQuantity:function(){

 	},
 	changeCheck: function(){

 	},
 	observeItemPrice: function(Item,dataitem){
 		var self = this;
		if (Item.originalPerPrice != dataitem.originalPrice || Item.actualPerPrice != dataitem.actualPrice || Item.finalAmount != dataitem.actualAmount) {
						Item.priceNeedRender = true;
						// Item.priceNeedRender = true;
			}
			if (Item.priceNeedRender) {
				Item.actualPerPrice = dataitem.actualPrice;
				Item.finalAmount = dataitem.actualAmount; //need render price again
				Item.originalPerPrice = dataitem.originalPrice;
			}
		 }
 }
