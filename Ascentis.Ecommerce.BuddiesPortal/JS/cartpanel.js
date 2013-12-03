function CartPanel (tTag) {
	var target;
	target = $(tTag);
	
	var countHolder;
	var panel;
	var mainBt;
	
	this.init = init;
	this.update = update;
	this.addCount = addCount;
	this.close = onCloseClick;
	this.setCartCookie = setCartCookie;
	this.loadShoppingCart = loadShoppingCart;
	
	function init (){
		var isTouch = IS_TOUCH;
		mainBt =  target.find("div.link a");
		mainBtTxt = mainBt.find("div.text");
		mainBtLoader = mainBt.find("div.loader");
		countHolder = mainBt.find("div.count");
		mainBt.bind(isTouch ? "mousedown" : "mouseenter", onOpenClick);
		if (!isTouch) {
		    target.mouseover(function () {
		        target.addClass("notouch");
		    });
		}
		target.mouseleave(function () {
		    mainBtTxt.css({ visibility: "visible" });
		    mainBtLoader.css({ visibility: "hidden" });
		});

        //ASCENTIS-glaissa: 27022013
//        //load shopping cart
//        $("div.cart-btn div.buttons a.view").click(function () {
//            window.location.href = "../Cart/ShoppingCart.aspx";
//        });

		$.ajax({
		    type: "POST",
		    url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
		    contentType: "application/json; charset=utf-8",
		    dataType: "json",
		    success: function (data) {
		        data = $.parseJSON(data.d);
		        if (data != null) {
		            $("div.cart-btn div.buttons a.view").click(function () {
		                window.location.href = wsHubPath + "Cart/ShoppingCart.aspx";
		            });
		            loadShoppingCart(data.MemberAutoID, 1);
		        }
		        else {
		            $("div.cart-btn div.buttons a.view").click(function () {
		                if ($.cookie("memberID") == undefined || $.cookie("memberID") == null || $.cookie("memberID") == "") {
		                    modal.showFree("Login Required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
		                } else {
		                    window.location.href = wsHubPath + "Cart/ShoppingCart.aspx";
		                }
		            });
		        }
		    }
		});
		target.find("div.buttons a.close").click (onCloseClick);
		panel = target.find("div.dropdown");
    }

    //glaissa added may 23 2013
    function LoginCallbackFunction() {
        var target = $("#nav-right")
        var touchHover = TouchHoverHandler;
        var panel = target.find("div.dropdown");
        touchHover(null, panel);

        panel.find(" input[name='email']").focus();
    }

    //ASCENTIS-glaissa: 27022013
    function loadShoppingCart(memberID, reload) {
        var cartCookieName = "Cart-" + memberID;
        var cartCookieCount = "CartCount-" + memberID;
        var proceed = true;
        if (reload == 0) {
            proceed = ($.cookie(cartCookieName) == null);
        }
        else {
            $.cookie(cartCookieName, null, { path: '/' });
            $.cookie(cartCookieCount, null, { path: '/' });
        }

        if(proceed == true)
        {
            var sData = { LanguageCode: $.cookie("Language"), needAttributeSet: true };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url:  wsHubPath + "WSHub/wsShoppingCart.asmx/GetShoppingCart",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(saveCartToCookie);
        }

        var cartCookieCount = "CartCount-" + memberID;
        if (reload == 0) {            
            if ($.cookie(cartCookieCount) != null) {
                update(parseInt($.cookie(cartCookieCount)));
            }
        }
    }

    function saveCartToCookie(data) 
    {
        var objResult = $.parseJSON(data.d);
        if (objResult.length == 0) {
            cartPanel.update(0);

            var loc = window.location.href;
            var holder = $(".container_16").find("div.flightinfo");
            if (holder && loc.search("ShoppingCart") > -1) {
                holder.find("ul.flightNo li.info").empty();
                holder.find("ul.passport li.info").empty();
                holder.find("ul.flightDest li.info").empty();
                holder.find("ul.flightDate li.info").empty();
                holder.find("ul.flightTime li.info").empty();
            }

            return;
        }
        var memberID = 0;
        $.each(objResult, function (i, item) {
            var cartItem = { cartID: item.ShoppingCartItem_AutoID, name: item.ProductName, image: item.ImagePath, qty: item.Quantity, retailerID: item.Retailer_AutoID, productgroupID: item.ProductGroup_AutoID, branddtlurl: item.BrandDetailUrl, brandID: item.BrandAutoID };
            memberID = item.Member_AutoID;
            setCartCookie(memberID, cartItem, false);
        });
    }

    function setCartCookie(memberID, cartItem, addQty) {
        var cartCookieName = "Cart-" + memberID;
        var cartCookieCount = "CartCount-" + memberID;
        var cartJson = null;
        var cartCount = 0;        
        if ($.cookie(cartCookieName) == null) {
            cartItem.seqno = 1;
            cartJson = { params: [cartItem] };
            $.cookie(cartCookieName, JSON.stringify(cartJson), { path: '/' });
            $.cookie(cartCookieCount, 1, { path: '/' });
            cartCount = 1;
        }
        else {            
            cartJson = $.parseJSON($.cookie(cartCookieName));
            cartCount = parseInt($.cookie(cartCookieCount));

            var found = false;
            var exit = false;
            if (addQty == true) {
                $.each(cartJson.params, function (i, item) {
                    if (item.cartID == cartItem.cartID && exit == false) {
                        item.qty = parseInt(item.qty) + parseInt(cartItem.qty);
                        found = true;
                        exit = true;
                    }
                });
            }      
            
            if (!found) {
                cartCount = parseInt($.cookie(cartCookieCount)) + 1;
                cartItem.seqno = cartCount;
                cartJson.params.push(cartItem);
            }
            if (cartCount > 5) {
                var filter = cartCount - 5;
                cartJson.params = $.grep(cartJson.params, function (item, index) { return item.seqno > filter; });
            }

            $.cookie(cartCookieName, JSON.stringify(cartJson), { path: '/' });
            $.cookie(cartCookieCount, cartCount, { path: '/' });
        }
        cartPanel.update(cartCount);
    }

    function sortCartCookie(a, b) {
        return parseInt(a.seqno) - parseInt(b.seqno);
    }
	
	function update (value) {
		countHolder.html(value);
    }

	function addCount () {
	    var curValue = parseInt(countHolder.html());
	    countHolder.html(curValue);
	}

	function onOpenClick (e) {
	    e.preventDefault();

	    target = $("#filter div.right div.cart-btn");
	    mainBt = target.find("div.link a");
	    mainBtTxt = mainBt.find("div.text");
	    mainBtLoader = mainBt.find("div.loader");

		mainBtTxt.css({visibility:"hidden"});
		mainBtLoader.css({visibility:"visible"});
		//panel.fadeIn(1000);
		wishlist.close();
		
		loadCartData();
	}
	function onCloseClick (e) {
		if (e != undefined) e.preventDefault();
		//panel.fadeOut(1000);
		target.removeClass("notouch");
		
	}

	//ASCENTIS-glaissa: 27022013
	function loadCartData() {
	    var cartItems = null;
        var memberID = 0;
        $.ajax({
            type: "POST",
            url:  wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                data = $.parseJSON(data.d);
                if (data != null) {
                    memberID = data.MemberAutoID;
                    if ($.cookie("Cart-" + memberID) != null) {
                        cartItems = $.cookie("Cart-" + memberID);
                        loadCartDone(cartItems);
                    }
                }
            }
        });       
    }

    function loadCartDone(e) {
        var data = $.parseJSON(e);
        parseData(data);

        target = $("#filter div.right div.cart-btn");
        mainBt = target.find("div.link a");
        mainBtTxt = mainBt.find("div.text");
        mainBtLoader = mainBt.find("div.loader");

		mainBtTxt.css({visibility:"visible"});
		mainBtLoader.css({visibility:"hidden"});
	//	panel.fadeIn(1000);
    }

    function parseData(data) {      
		var tHolder = target.find("div.items");
		tHolder.html("");
		
		for (var i = 0; i < data.params.length; i++) {
		    var tData = data.params[i];
			var temp = panel.find("div.template ul.item").clone();
			temp.data("id", tData.cartID);
			temp.data("gid", tData.productgroupID);
			temp.data("retailID", tData.retailerID);
			temp.data("branddtlurl", tData.branddtlurl);
			temp.data("brandID", tData.brandID);
			temp.find("li.item img").attr("src", tData.image == null ? "" : tData.image.replace('_std.jpg', '_190x190.jpg'));			
			temp.find ("li.item span.name").html(tData.name);
			temp.find ("li.qty").html(tData.qty);
			tHolder.append(temp);			
			temp.click(function () {
			    if ($(this).data("branddtlurl") != null && $(this).data("branddtlurl") != "") {
			        window.location.href = wsHubPath + $(this).data("branddtlurl").replace('~/', '') + "?brandID=" + $(this).data("brandID") + "&groupId=" + $(this).data("gid") + "&langType=en-US";
			    } else { window.location.href = wsHubPath + "Product/Product.aspx?groupID=" + $(this).data("gid") + "&retailerID=" + $(this).data("retailID"); }
			});	
		}

		target.find("div.buttons a.view span.quantity").html(target.find("div.count").html());
	}
}



$(document).ready(function (){
	cartPanel = new CartPanel ($("#filter div.right div.cart-btn"));
	cartPanel.init();
});

















