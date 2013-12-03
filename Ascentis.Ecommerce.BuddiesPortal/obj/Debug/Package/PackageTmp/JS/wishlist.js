function WishPanel(tTag) {
    var target;
    target = $(tTag);
    var countHolder;
    var panel;
    var mainBt;
    var wishlistCount;
    var member = 0;

    this.init = init;
    this.update = update;
    this.addCount = addCount;
    this.close = onCloseClick;


    function init() {
        mainBt = target.find("div.link a");
        mainBtTxt = mainBt.find("div.text");
        mainBtLoader = mainBt.find("div.loader");
        countHolder = mainBt.find("div.count");
        panel = target.find("div.dropdown");
        wishlistCount = 100;

        var isTouch = IS_TOUCH;

        //mainBt.bind(isTouch ? "mousedown" : "mouseenter", onOpenClick);
        loadCartData();
        if (!isTouch) {
            target.mouseover(function () {
                target.addClass("notouch");
            });
        }
        panel.find("div.buttons a.view").unbind('click').click(function () {
            viewAllWishlist();
        });
        target.find("div.buttons a.close").click(onCloseClick);
    }

    function viewAllWishlist() {
        var _member = $.cookie("memberID");
        if (_member && !isNaN(_member) && _member > 0) {
            window.location.href = wsHubPath + "Product/ProductListings.aspx?memberID=" + $.cookie("memberID") + "&type=wishlist";
        } else {
            modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
        }
    }

    function getMemberAutoIDSuccess(e) {
        member = e.d;
    }

    function update(value) {
        countHolder.html(value);
    }

    function addCount() {
        var curValue = parseInt(countHolder.html());
        countHolder.html(curValue + 1);
    }

    function onOpenClick(e) {
        e.preventDefault();
        mainBtTxt.css({
            visibility: "hidden"
        });
        mainBtLoader.css({
            visibility: "visible"
        });
        //		panel.fadeIn(1000);
        cartPanel.close();
        loadCartData();
    }

    function onCloseClick(e) {
        if (e != undefined) e.preventDefault();
        //panel.fadeOut(1000);
        target.removeClass("notouch");
    }


    function loadCartData() {
        //  Modify by Sandy------------------------------------------------
        $.cookie("memberID", 0, {
            path: "/"
        });
        update(0);
        var tHolder = target.find("div.items");
        tHolder.html("");
        target.find("div.buttons a.view span.quantity").html(0);

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == null || data.d == "") {
                    $.setJSONCookie("wishlistData_" + member, "", {
                        path: "/"
                    });
                    //panel.find("div.buttons a.view").click(function () {
                    //    modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
                    //});
                } else {
                    data = $.parseJSON(data.d);

                    if (data.MemberAutoID == "0") {
                        $.setJSONCookie("wishlistData_" + member, "", {
                            path: "/"
                        });
                        //panel.find("div.buttons a.view").click(function () {
                        //    modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
                        //});
                    } else {
                        var member = data.MemberAutoID;
                        $.cookie("memberID", member, {
                            path: "/"
                        });
                        var data = $.cookie("wishlistData_" + member);

                        if (data && data.Items && data.Items.length > 0) {
                            parseData(data);
                        } else {
                            var langType = $.cookie("Language");
                            $.ajax({
                                type: "POST",
                                url: wsHubPath + "WSHub/wsProduct.asmx/GetWishlistGroupByMember",
                                data: "{'memberID':'" + member + "','langType':'" + langType + "','count':'" + wishlistCount + "'}",
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (e) {
                                    var p = $.parseJSON(e.d);
                                    if (p != undefined && p.Count != undefined) {
                                        parseData(p);
                                        mainBtTxt.css({
                                            visibility: "visible"
                                        });
                                        mainBtLoader.css({
                                            visibility: "hidden"
                                        });
                                        var wl = "", str = "";
                                        str = "{\"count\":" + p.Count + ",\"items\":[";
                                        for (var i = 0; i < p.Count; i++) {
                                            var item = p.Items[i];
                                            str += "{\"id\":\"" + item.ProductGroupAutoID + "\", \"retailID\":\"" + item.LP_ConcessionaireAutoID + "\", \"name\":\"" + item.ProductGroupTitle + "\",  \"image\":\"" + item.GroupImage + "\", \"branddetailurl\":\"" + item.BrandDetailURL + "\", \"brandCode\":\"" + item.LP_BrandCode + "\", \"brandID\":\"" + item.LP_BrandAutoID + "\" },";
                                        }
                                        str = str.substring(0, str.length - 1); str += "]}";                                        
                                        $.cookie("wishlistData_" + member, str, {
                                            path: "/"
                                        });
                                    }
                                }
                            });
                        }
                    }
                }
            }
        });        
    }
    
    function LoginCallbackFunction() {
        var target = $("#nav-right")
        var touchHover = TouchHoverHandler;
        var panel = target.find("div.dropdown");
        touchHover(null, panel);

        panel.find(" input[name='email']").focus();
    }

    function CallbackFunction() {
        return false;
    }
  
    function parseData(data) {
        var tHolder = target.find("div.items");
        tHolder.html("");
        //Added by ChenChi on Mar 09 2013
        if (data && data.Items && data.Count > 0) {
            //ascentis-glaissa updated mar 15 2013
            update(data.Count);
           
            for (var i = 0; i < data.Items.length && i < 5; i++) {
                var tData = data.Items[i];
                var temp = target.find("div.template ul.item").clone();
                temp.data("id", tData.ProductGroupAutoID);
                temp.data("retailID", tData.LP_ConcessionaireAutoID)
                temp.data("branddetailurl", tData.BrandDetailURL);
                temp.data("brandID", tData.LP_BrandAutoID);
                temp.find("li.item img").attr("src", tData.GroupImage.replace('_std.jpg', '_190x190.jpg')); //Modified by ChenChi on Apr 16 2013
                temp.find("span.name").html(tData.ProductGroupTitle);
                tHolder.append(temp);                
                temp.click(function () {
                    if ($(this).data("branddetailurl") != 'undefined' && $(this).data("branddetailurl") != null && $(this).data("branddetailurl") != "") {
                        window.location.href = wsHubPath + $(this).data("branddetailurl").replace('~/', '') + "?brandID=" + $(this).data("brandID") + "&groupId=" + $(this).data("id") + "&langType=en-US";
                    } else { window.location.href = wsHubPath + "Product/Product.aspx?groupID=" + $(this).data("id") + "&retailerID=" + $(this).data("retailID"); }
                });

            }
            target.find("div.buttons a.view span.quantity").html(data.Count);
        }

        //panel.find("div.buttons a.view").unbind('click').click(function () {
        //    if (data.Count > 0) {
        //        window.location.href = wsHubPath + "Product/ProductListings.aspx?memberID=" + $.cookie("memberID") + "&type=wishlist";
        //    } else {
        //        modal.showFree("Information", "wishlist not recorded.", CallbackFunction, 400, 100);
        //    }
        //});
    }
}
$(document).ready(function () {
    wishlist = new WishPanel($("#filter div.right div.wishlist-btn"));
    wishlist.init();
    ChangiProducts.setWidthForPriceAndWidth(); //Added by ChenChi on May 14 2013  
});