/*
* @method preview design
*/
function previewImg(){
        var $this = $(this);
        var init = false,source;
        if($('#modal_zoomIn').length === 0){
            init = true; //html template has not been inserted yet
        }else {
            init = false;
        }
        //init
        var getSource = function(target) {
            if (init) {
                source = {
                    "data": $this.data("decoration-url"),
                    "groupItem": $this.data("group-item")
                };
            } else {
                source = {
                    "data": $(target.relatedTarget).data("decoration-url"),
                    "groupItem": $(target.relatedTarget).data("group-item")
                };
            }
        };

        if(init){
            $.get('../scripts/html/_previewImgDialog.html',function(template){
                var tpl =$(template).html();
                $(tpl).appendTo('body');
                $("#modal_zoomIn").modal("show");
                $("#modal_zoomIn").on("shown.bs.modal",function(e){
                    getSource(e);
                    PreviewImg.show(source);
                });
                $("#modal_zoomIn").on("hidden.bs.modal",function(e){
                    init = false;
                    PreviewImg.close();
                });
            });
        }
}

var cart = new ShoppingCart.Cart();
/*
 * @Class CartPage
 * @constructor
 * @param Node emptyNode
 */
function CartPage(cart){
    var self = this;
    this._editQuantityBtn.on('click',function(e){
        var itemId = $(e.target).data(value);
        var item = cart._itemGroups[itemId];
        cart.changeQuantity(item,function(){
            self.changeQuantity(item);
        });
    });
    this._previewBtn.on('click',function(e){
        previewImg();
    });
    this._checkBtn.on('click',function(e){
        var target = e.target;
        var itemId = $(e.target).data(value);
        var item = cart._itemGroups[itemId];
        var status = $(e.target).is(":checked");
        item.updateStatus(status,function(){
            $(target).prop('checked',status);
        })
        cart.changeCheck(item,status,function(){
            self.changeCheck(item);
        })
    });
    this._selectAllBtn.on('click',function(e){
        notifySelectAll(this);
    });
    this._batchDeleteBtn.on('click',function(e){
        notifyBatchDelete();
    });
    this._placeOrderBtn.on('click',function(){
        notifyPlaceOrder();
    });
    this._discountAmountEle = $('#discountPrice');
    this._activityAmountEle = $('#minusPrice');
    this._finalAmountEle = $('#totalPrice');
}

CartPage.prototype={
    changeQuantity: function(item){
        $("#changeQuantity").on('shown.bs.modal',function(){
            var subitem = null,quantity_;
            $('button.reduce').on('click',function(e){
                var sizeV = $(e.target).data("value");
                subitem = item[sizeV];
                quantity_ = subitem._quantity;
                quantity_= quantity_-1;
            });
            $('button.add').on('click',function(){
                var sizeV = $(e.target).data("value");
                subitem = item[sizeV];
                quantity_ = subitem._quantity;
                quantity_= quantity_ +1;
            });
            $('input.amount').on('blur',function(){
                var sizeV = $(e.target).data("value");
                subitem = item[sizeV];
                quantity_ = $(this).val();
            });
            if(subitem !== null){
                subitem.updateQuantity(quantity_,function(args){
                    var node_ = input.size.sizeV;
                    $(node_).val(quantity);
                    $('.inventory-msg.'+sizeV).html(args.msg);
                });
            }
            $('#changeQuantitySave').on('click',function(){
                cart.saveQuantity(item,function(){
                    self._discountAmountEle.html(cart._discountAmount);
                    self._finalAmountEle.html(cart._finalAmount);
                    self._activityAmountEle.html(cart._minusAmount);
                    $('.num.'+item.id).val(item.quantity);
                });
            });
        })
    },
    changeCheck: function(){
        self._discountAmountEle.html(cart._discountAmount);
        self._finalAmountEle.html(cart._finalAmount);
        self._activityAmountEle.html(cart._minusAmount);
    },
}
/*
 * @method empty content
 */
 function alertEmptyContent(){
     var emptyNode = '<div class="text-center" style="margin-top: 20px;"><p><i class="fa fa-shopping-cart fa-3x cart-none-icon" aria-hidden="true"></i><div class="cart-none-title">购物车空空如也</div></p><div class="cart-pause"><a class="btn-cci btn-cci-primary go-shopping" href="/Product/Index" title="去逛逛">去逛逛</a></div></div>';
     $('#template_content').html(emptyNode).show();
 }
/*
 * @method init: get the items and render them into the itemdetails template
 */
 function init (){
     $.ajax({
         url: "/Cart/GetCart",
         data: {
             items: ""
         },
         type: "Get"
     }).done(function(data){
         var self = this;
         if (data.ruleGroups.length === 0 && data.items.length === 0 ){
             alertEmptyContent()
         }else{
             var tmpl;
             $.get('../scripts/html/_cart.html', function(template){
                 //item content view
                 tmpl = $(template).find("#cartTpl").html();
                 var view = Mustache.render(tmpl, data);
                 //order rule view
                 var tmpl_orderRule = '{{#canUseDiscountRules}} <div><span class="rule-title">满减</span> <span class="rule-name">{{ruleName}}</span></div> {{/canUseDiscountRules}}';
                 $('#template_content').html(view);
                 var dataGroups = $(".cart-item-group");
                 $.each(dataGroups, function(i, item) {
                     if ($(item).attr("data-rule") !== "0") {
                         $(item).find(".group-rule").removeClass("hide");
                     }
                 });
                 var viewOrderRule = Mustache.render(tmpl_orderRule, data);
                 $(".order-rule").html(viewOrderRule);
                 //shoppingCartContent excute
                 var maincart = new CartPage({
                     _previewBtn: $('.zoom-preview-btn'),
                     _editQuantityBtn:$('.modify-quantity'),
                     _checkBtn:$('#cart-items').find('.chk-cci'),
                     _selectAllBtn:$("#toggleNumTop") || $("#toggleNumBottom"),
                     _batchDeleteBtn:$("#batchDelete")
                 });
             })
         }
     });
