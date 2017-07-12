// ;(function (root,factory){
//   if(typeof exports === 'object'){
//     module.exports = factory();
//   }else if(typeof define === 'function' && define.amd){
//       define(function(){
//       root.shoppingCart = factory();
//       return root.shoppingCart;
//     });
//   }else{
//     root.shoppingCart = factory();
//   }
// })(this,function(){
var ShoppingCart = (function ($) {
	"use strict";
	var sendTime,
	function Item(ruleid, id, status, quantity, originalPerPrice, actualPerPrice, finalAmount, inventoryShort) {
		this.id = id.toString();
		this.ruleid = ruleid.toString();
		this.quantity = quantity.toString(); //sum quantity
		this.finalAmount = finalAmount;
		this.status = status;
		this.originalPerPrice = originalPerPrice;
		this.actualPerPrice = actualPerPrice;
		this.inventoryShort = inventoryShort;
		//   this.inventory = inventory.toString();
		this.priceNeedRender = false;
		// this.inventorySOShow = false;// show no inventory in UI
		this.subItems = {};
	}

	Item.prototype.inventorySOS = function () {
		if (this.inventory.toString() === this.quantity.toString()) {
			this.inventorySOShow = true;
		} else {
			this.inventorySOShow = false;
		}
	};

	function subItem(item) {
        console.log(this);
        this._Inventory = new Inventory(item);
        this._quantity = item.quantity;
        this.inventorySOSShow = false;
        this.inventoryShortShow = false;
	}

    sumItem.prototype.changeQuantity = function (type,value,obj,callback) {
        var self = this;
        var call = true;
        switch (type) {
            case "add":
                if (self._message !== "") {
                    value = Number(value) + 1;
                } else {
                    value = Number(value) + 1;
                }
                break;
            case "minus":
                if (value === "1") {
                    call = false;
                } else {
                    value = Number(value) - 1;
                }
                break;
            case "":
            //input value
                if (value > self._inventory) {
                    //input value bigger than inventory
                    value = self._inventory._data;
                    Item.inventorySOShow = true;
                }
                break;
        }

    };

	function Cart() {
		this.itemGroups = {}; //Item groups
		this.checkedItem = [];
		this.finalAmount = 0;
		this.discountAmount = 0;
		// this.emptyHTML = '<div class="text-center" style="margin-top: 20px;"><p><i class="fa fa-shopping-cart fa-3x cart-none-icon" aria-hidden="true"></i><div class="cart-none-title">购物车空空如也</div></p><div class="cart-pause"><a class="btn-cci btn-cci-primary go-shopping" href="/Product/Index" title="去逛逛">去逛逛</a></div></div>';
	}

	Cart.prototype = {
		clearAll: function () {
			this.itemGroups = {}; //Item groups
			this.checkedItem = [];
			this.finalAmount = 0;
			this.discountAmount = 0;
		},
		/*
       *add item inventory, item price, item id
       */
		addItem: function (Item) {
			this.itemGroups[Item.id] = Item;
			if (Item.status) {
				this.checkedItem.push(Item.id);
			}
		},
		/*
       *remove item
       */
		remove: function (id,callback) {
			var self = this;
			delete self.itemGroups[id];
			_.remove(self.checkedItem, function (n) {
				return n == id;
			});
			//   self.checkedItem.remove(id);
			setTimeout(function () {
				$.ajax({
					url: "/Cart/RemoveCartItem",
					data: {
						cartItemId: id,
						items: function () {
							if (self.checkedItem.join(',') === "") {
								return "0";
							} else {
								return self.checkedItem.join(',');
							}
						},
						ts: function () {
							sendTime = Date.now();
							return sendTime;
						}
					}
				}).done(function (data) {
					if (data.ts == sendTime) { //data.ts is stirng but sentTime is number
						// lastTimeReturn = true;
						// updateTotalPrice(data.discountAmount, data.finalAmount);
						// updateCheckedNum(self.checkedItem.length);
						self.discountAmount = data.discountAmount;
						self.finalAmount = data.finalAmount;
						/*
                       * observe item inventory and price
                       */
						$.each(data.items, function (i,
						d) {
							var id = d.itemId;
							self.itemGroups[id].inventory = d.inventoryQuantity;
							self.observeInventory(self.itemGroups[id]);
							self.observeItemPrice(self.itemGroups[id], d);
						});
						callback(self); //get price and checkedNum
					}
				}).fail(function () {
					return null;
				});
			}, 200);
			// self.itemGroups[id].status = "removed";
		},
		/*
       *change quantity would click its item
       * return @msg
       */
		changeQuantity: function (id) {
			var self = this;
            var Item = self.itemGroups[id];
            if (!Item.status) {
                self.checkedItem.push(id);
                Item.status = true; //checked item if user change its quantity
            }
            $.ajax({
                url:"/Cart/getQuantity",
                data:id
            }).done(function(data){
                for(var qkey in data.quantities){
                    var subitem =  new subItem(data.quantities.akey);
                    subitem._quantity = data.quantities.qkey;
                    Item.subItems[data.quantities.qkey] = subitem;
                }
                for(var ikey in data.inventories){
                    var subitem_ = Item.subItems[data.inventories.ikey];
                    subitem_._inventory._data= data.inventories.ikey;
                    subitem_._message = subitem_.check();
                }
            });
		},
        updateQuantity: function(data){
                setTimeout(function () {
                    changeQuantityAjax = $.ajax({
                        // beforeSend: function() {
                        //     self.lastTimeReturn = false;
                        // },
                        url: "/Cart/UpdateCartItem",
                        data: {
                            cartItemId: id,
                            quantity: value,
                            items: function () {
                                if (self.checkedItem.join(',') === "") {
                                    return "0";
                                } else {
                                    return self.checkedItem.join(',');
                                }
                            },
                            ts: function () {
                                sendTime = Date.now();
                                return sendTime;
                            }
                        },
                        type: "Get"
                    }).done(function (data) {
                        if (data.ts == sendTime) {
                            // self.lastTimeReturn = true;
                            self.discountAmount = data.discountAmount;
                            self.finalAmount = data.finalAmount;
                        /*
                         * observe item inventory and price
                         */
                            $.each(data.items, function (i,d) {
                                var id = d.itemId;
                                self.itemGroups[id].inventory = d.inventoryQuantity;
                                self.observeInventory(self.itemGroups[id]);
                                self.observeItemPrice(self.itemGroups[id], d);
                            });
                            callback(self);
                        }
                    }).fail(function (data) {
                        return null;
                    });
                }, 200);
        },
		changeCheck: function (id,check,callback) {
			var self = this;
			if (check) {
				self.itemGroups[id].status = true;
				self.checkedItem.push(id);
			} else {
				self.itemGroups[id].status = false;
				_.remove(self.checkedItem, function (n) {
					return n == id;
				});
				//   self.checkedItem.remove(id);
			}

			setTimeout(function () {
				$.ajax({
					// beforeSend: function() {
					//     lastTimeReturn = false;
					// },
					url: "/Cart/GetCart",
					data: {
						items: function () {
							if (self.checkedItem.join(',') === "") {
								return "0";
							} else {
								return self.checkedItem.join(',');
							}
						},
						ts: function () {
							sendTime = Date.now();
							return sendTime;
						}
					},
					type: "Get"
				}).done(function (data) {
					if (data.ts == sendTime) {
						// self.lastTimeReturn = true;

						// updateTotalPrice(data.discountAmount, data.finalAmount);
						// updateCheckedNum(self.checkedItem.length);
						self.discountAmount = data.discountAmount;
						self.finalAmount = data.finalAmount;
						/*
                     * observe item inventory and price
                     */
						$.each(data.items, function (i,
						d) {
							var id = d.itemId;
							self.itemGroups[id].inventory = d.inventoryQuantity;
							self.observeInventory(self.itemGroups[id]);
							self.observeItemPrice(self.itemGroups[id], d);
						});
						callback(self);
					}
				}).fail(function () {
					return null;
				});
			}, 200);

		},

		selectAll: function (callback) {
			var self = this;
			for (var i in self.itemGroups) {
				if (self.itemGroups[i].status === false) {
					self.itemGroups[i].status = true;
					self.checkedItem.push(i);
				}
			}
			setTimeout(function () {
				$.ajax({
					// beforeSend: function() {
					//     lastTimeReturn = false;
					// },
					url: "/Cart/GetCart",
					data: {
						items: "",
						ts: function () {
							sendTime = Date.now();
							return sendTime;
						}
					},
					type: "Get"
				}).done(function (data) {
					if (data.ts == sendTime) {
						// updateTotalPrice(data.discountAmount, data.finalAmount);
						// updateCheckedNum(self.checkedItem.length);
						self.discountAmount = data.discountAmount;
						self.finalAmount = data.finalAmount;
						/*
                     * observe item inventory and price
                     */
						$.each(data.items, function (i,
						d) {
							var id = d.itemId;
							self.itemGroups[id].inventory = d.inventoryQuantity;
							self.observeInventory(self.itemGroups[id]);
							self.observeItemPrice(self.itemGroups[id], d);
						});
						callback(self);
					}
				}).fail(function () {
					return null;
				});
			}, 200);
		},
		deSelectAll: function (callback) {
			var self = this;
			for (var i in self.itemGroups) {
				if (self.itemGroups[i].status === true) {
					self.itemGroups[i].status = false;
				}
			}
            self.checkedItem = [];
			setTimeout(function () {
				$.ajax({
					url: "/Cart/GetCart",
					data: {
						items: "0",
						ts: function () {
							sendTime = Date.now();
							return sendTime;
						}
					},
					type: "Get"
				}).done(function (data) {
					if (data.ts == sendTime) {
						// self.lastTimeReturn = true;
						self.discountAmount = 0;
						self.finalAmount = 0;
						/*
                     * observe item inventory and price
                     */
						$.each(data.items, function (i,
						d) {
							var id = d.itemId;
							self.itemGroups[id].inventory = d.inventoryQuantity;
							self.observeInventory(self.itemGroups[id]);
							self.observeItemPrice(self.itemGroups[id], d);
						});
						callback(self);
					}
				}).fail(function () {
					return null;
				});
			}, 200);

		},
		observeInventory: function (Item) {
			Item.inventorySOS();
		},
		observeItemPrice: function (Item,
		dataitem) {
			var self = this;
			Item.priceNeedRender = false;
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
	};

	return {
		Cart: Cart,
		Item: Item
	};
})(jQuery);
