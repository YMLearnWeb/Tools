;(function($) {
  "use strict";
    var cart = new ShoppingCart.Cart();
    var emptyNode =  '<div class="text-center" style="margin-top: 20px;"><p><i class="fa fa-shopping-cart fa-3x cart-none-icon" aria-hidden="true"></i><div class="cart-none-title">购物车空空如也</div></p><div class="cart-pause"><a class="btn-cci btn-cci-primary go-shopping" href="/Product/Index" title="去逛逛">去逛逛</a></div></div>';

    function previewImg(){
        $('.zoom-preview-btn').on('click',function(){
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
                    }
                } else {
                    source = {
                        "data": $(target.relatedTarget).data("decoration-url"),
                        "groupItem": $(target.relatedTarget).data("group-item")
                    }
                }
            }

            if(init){
                $.get('../scripts/html/_previewImgDialog.html',function(template){
                    var tpl =$(template).html();
                    $(tpl).appendTo('body');
                    $("#modal_zoomIn").modal("show");
                    $("#modal_zoomIn").on("shown.bs.modal",function(e){
                        getSource(e);
                        PreviewImg.show(source);
                    })
                    $("#modal_zoomIn").on("hidden.bs.modal",function(e){
                        init = false;
                        PreviewImg.close();
                    })
                })
            }
        })
    }
    function alertEmptyContent() {
        $('#template_content').html(emptyNode).show();
    }

    function updateTotalPrice(discountAmount, actualAmount) {
        $("#totalPrice").html(actualAmount);
        $("#discountPrice").html(discountAmount);
    }
    /*
      *find the DOM Node with id
    */
    function idToNode(id){
      var idNode = "#item_" + id;
      return idNode;
    }
    function updateItemPrice(item) {
        var $targetNode = $(idToNode(item.id));
        $targetNode.find('.original-price').html(item.originalPerPrice);
        $targetNode.find('.actual-price').html(item.actualPerPrice);
        $targetNode.find('.td-sum').find('.price').html(item.finalAmount);
    }

    function updateCheckedNum(checkedNum) {
        $("#selCartNum").html(checkedNum);
    }

    function displayInventoryMSG(id, action,ifValue) {
        var $targetNode = $(idToNode(id)).find(".noInventory");
        if (action === "show") {
            $targetNode.show();
        } else {
            $targetNode.hide();
        }
        if(ifValue !== undefined){
          $(stringId).find('.amount').val(ifValue);
        }
    }

    function jsonLength(object){
      var l = 0;
      for(var i in object){
        l = l +1;
      }
      return l;
    }

    function hideOriginalPrice(id){
      var $targetNode = $(idToNode(id));
      var $original =   $targetNode.find('.original-price');
      var $actual =  $targetNode.find('.actual-price');
      if($original.html() === $actual.html()){
         $original.hide();
      }else{
        $original.show();
      }
    }

    function renderResult(_cart){
      if(_cart !== null){
        $('#discountPrice').html(_cart.discountAmount);
        if(_cart.discountAmount > 0) {
          $(".discount-price-info").show();
        }
        $('#totalPrice').html(_cart.finalAmount);
        updateCheckedNum(_cart.checkedItem.length);

        for(var i in _cart.itemGroups){
          if(_cart.itemGroups[i].priceNeedRender){
            $(idToNode(i)).find('.original-price').html(_cart.itemGroups[i].originalPerPrice);
            $(idToNode(i)).find('.actual-price').html(_cart.itemGroups[i].actualPerPrice);
            $(idToNode(i)).find('.per-sum-price').html(_cart.itemGroups[i].finalAmount);
            hideOriginalPrice(i);
          }
          if(_cart.itemGroups[i].inventorySOShow){
             displayInventoryMSG(i,"show")
          }else{
             displayInventoryMSG(i,"hide")
          }
        }
      }
    }

    var _callback = function(i){
      renderResult(i)
    }

    function changeQuantity() {
        $('button.add').on('click', function() {
            var inputNode = $(this).siblings('.amount');
            var inputNodeVal = $(inputNode).val();
            var id = $(this).parents('.cart-item').attr("data-id");
            var stringId = "#item_" + id;
            $(stringId).find('.chk-cci').prop('checked', true);
            // var ruleid = $(this).parents('.cart-item-group').attr("data-rule");
            cart.changeQuantity('add', id, inputNodeVal, inputNode,_callback);
        });

        $('button.reduce').on('click', function() {
            var inputNode = $(this).siblings('.amount');
            var inputNodeVal = $(inputNode).val();
            var id = $(this).parents('.cart-item').attr("data-id");
            var stringId = "#item_" + id;
            $(stringId).find('.chk-cci').prop('checked', true);
            // var ruleid = $(this).parent('.cart-item-group').attr("data-rule");
            cart.changeQuantity('minus', id, inputNodeVal, inputNode,_callback);
        })

        $('input.amount').on('blur',function(){
          var id = $(this).parents('.cart-item').attr("data-id");
          var stringId = "#item_" + id;
          $(stringId).find('.chk-cci').prop('checked', true);
          var inputNodeVal = $(this).val();
          cart.changeQuantity('', id, inputNodeVal, this,_callback);
        })
    }

    function remove() {
        $('a.delete').on('click', function() {
            var itemNode = $(this).parents('.cart-item');
            var itemRuleNode = $(this).parents('.cart-item-group');
            var id = $(itemNode).attr("data-id");
            // var ruleid = $(itemRuleNode).attr("data-rule");
            $('#submitDel').on('click', function() {
                $(itemNode).remove();
                if ($(itemRuleNode).find('.cart-item').length === 0) {
                    $(itemRuleNode).remove();
                }
                if ($(".cart-item").length === 0) {
                    alertEmptyContent()
                }
                cart.remove(id,_callback);
            })
        })
    }

    function changeCheck() {
        $('#cart-items').find('.chk-cci').on('click', function() {
            var itemNode = $(this).parents('.cart-item');
            // var itemRuleNode = $(this).parents('.cart-item-group');
            var id = $(itemNode).attr("data-id");
            // var ruleid = $(itemRuleNode).attr("data-rule");
            if ($(this).is(":checked")) {
                cart.changeCheck(id, true,_callback);
            } else {
                cart.changeCheck(id, false,_callback);
            }
            if(cart.checkedItem.length === 0){
              $("#toggleNumTop").prop('checked',false);
              $("#toggleNumBottom").prop('checked',false);
            }else{
              var jsonlength = jsonLength(cart.itemGroups);
              if(cart.checkedItem.length === jsonlength){
                $("#toggleNumTop").prop('checked',true);
                $("#toggleNumBottom").prop('checked',true);
              }else{
                $("#toggleNumTop").prop('checked',false);
                $("#toggleNumBottom").prop('checked',false);
              }
            }
        });
    }

    function selectAll(btn) {
        var checkboxes = $('.chk-cci');
        btn.on('click', function() {
            if ($(this).is(":checked")) {
                $.each(checkboxes, function(i, t) {
                    $(t).prop("checked", true); //status changed without trigger click event
                })
                cart.selectAll(_callback)

            } else {
                $.each(checkboxes, function(i, t) {
                    $(t).prop("checked", false);
                })
                cart.deSelectAll(_callback);
            }
        })
    }


    $(document).ready(function() {
        /*
        init item is empty string will retreive all items in checked status
        */
        $.ajax({
            url: "/Cart/GetCart",
            data: {
                items: "",
                ts: function() {
                    var sendTime = Date.now();
                    return sendTime;
                }
            },
            type: "Get"
        }).done(function(data) {
            //if no data
            if (data.ruleGroups.length === 0 && data.items.length === 0 ) {
                alertEmptyContent()
            } else {
                var tmpl;
                $.get('../scripts/html/_cart.html', function(template) {
                    tmpl = $(template).find("#cartTpl").html();
                    var view = Mustache.render(tmpl, data);
                    var tmpl_orderRule = '{{#canUseDiscountRules}} <div><span class="rule-title">满减</span> <span class="rule-name">{{ruleName}}</span></div> {{/canUseDiscountRules}}';
                    var tmpl_orderDiscount = '<span class="discount-amount-title">优惠:</span><span id="discountPrice" class="disocunt-amount-price price money">{{discountAmount}}</span>';
                    $('#template_content').html(view);
                    var dataGroups = $(".cart-item-group");
                    $.each(dataGroups, function(i, item) {
                        if ($(item).attr("data-rule") !== "0") {
                            $(item).find(".group-rule").removeClass("hide");
                        }
                    })

                    var viewOrderRule = Mustache.render(tmpl_orderRule, data);
                    $(".order-rule").html(viewOrderRule);
                    var viewDiscountAmount = Mustache.render(tmpl_orderDiscount, data);
                    $(".discount-price-info").html(viewDiscountAmount);

                    if (data.discountAmount > 0) {
                      $(".discount-price-info").show();
                    }
                    $("#totalPrice").html(data.finalAmount);

                    $.each(data.ruleGroups, function(i, item) {
                        $.each(item.items, function(j, jtem) {
                            var ruleid = item.ruleId;
                            var id = jtem.itemId;
                            var quantity = jtem.quantity;
                            var originalPerPrice = jtem.originalPrice;
                            var actualPerPrice = jtem.actualPrice;
                            var finalAmount = jtem.actualAmount;
                            var inventory = jtem.inventoryQuantity;
                            var _item = new ShoppingCart.Item(ruleid, id, true, quantity, originalPerPrice, actualPerPrice, finalAmount, inventory);
                            //initialize inventory message
                            _item.inventorySOS();
                            if(_item.inventorySOShow){
                              displayInventoryMSG(id,"show")
                            }else{
                              displayInventoryMSG(id,"hide")
                            }
                            hideOriginalPrice(id);
                            cart.addItem(_item);
                        })
                        $.each(item.groupBuyItems, function(i, gtem) {
                                var ruleid = "";
                                var id = gtem.itemId;
                                var quantity = gtem.quantity;
                                var originalPerPrice = gtem.originalPrice;
                                var actualPerPrice = gtem.actualPrice;
                                var finalAmount = gtem.actualAmount;
                                var inventory = gtem.inventoryQuantity;
                                var _item = new ShoppingCart.Item(ruleid, id, true, quantity, originalPerPrice, actualPerPrice, finalAmount, inventory);
                                //initialize inventory message
                                _item.inventorySOS();
                                if(_item.inventorySOShow){
                                  displayInventoryMSG(id,"show")
                                }else{
                                  displayInventoryMSG(id,"hide")
                                }
                                hideOriginalPrice(id);
                                cart.addItem(_item);
                        });
                    });
                    updateCheckedNum(cart.checkedItem.length);
                    start();
                });
            }
            /*
             *finish init, start operation
             */

        }).fail(function() {
            alert("网络异常") //init failed
        })

        function start() {
            previewImg();
            remove();
            changeCheck();
            changeQuantity();
            selectAll($("#toggleNumTop"));
            selectAll($("#toggleNumBottom"));
            $('#placeOrder').on('click', function() {
                if(cart.checkedItem.length === 0){
                  alert('请至少选择一样商品!');
                }else{
                  $('#cart-detail').mask();
                  placeOrder(cart.checkedItem.join(','));
                }
            })
        }

      })
})(jQuery)
