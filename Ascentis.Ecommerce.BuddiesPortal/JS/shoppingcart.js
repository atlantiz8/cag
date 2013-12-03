function ShoppingCartPg() {
    var target = $("div.groupbox");

    var cartID = 0;
    var newQty = 0;
    var oldQty = 0;
    var limitedQty = 0;
    var promoDtls = null;

    var memberID = 0;

    this.loadMyAcctCart = loadMyAcctCart;
    this.ClearCart = ClearCart;

    this.init = function init() {
        var targ = $(".container_16").find("#myAcctCart_Template");
        if (targ.html() == undefined) {
            targ = ".container_16";
            loadMemberFlightDetails(targ);
            loadMyAcctCart(targ);

            if ($.cookie("PromoDtls") != null) {
                $.cookie("PromoDtls", null, { path: '/' });
            }

            $(targ).find("div.buttons a.red").click(function () {
                if ($("#promocode").val() != "") {
                    validatePromoCode();
                } else {
                    validateBeforeCheckOut1();
                }
            });

            var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
            if (IsGuest == "true" || IsGuest == true) $(targ).find("a.updatebtn").parent().parent().parent().hide();

            $(targ).find("a.updatebtn").click(function () {
                $overlay.showFlightPanel(true, false, false, editFlightCallBack);
            });

            var isIE = $.browser.msie;
            var version = 0;
            if (isIE != undefined && isIE == true) { version = $.browser.version; }

            if (isIE == true && (version > 8)) {
                $("#overlay-container .checkout #checkoutNewsletter").css("margin-left", "-650px");
            }
        }
    }
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    function onRollOver(e) {
        e.preventDefault();
        var self = $(this);
        TweenMax.to(self.parent().find("div.msg"), 0.7, { css: { autoAlpha: 1} });
    }
    function onRollOout(e) {
        e.preventDefault();
        var self = $(this);
        TweenMax.to(self.parent().find("div.msg"), 0.7, { css: { autoAlpha: 0} });
    }

    //ASCENTIS-glaissa: 04032013
    function loadMemberFlightDetails(targ) {
        var sData = { dateFormat: "dd MMM yyyy" };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsFlight.asmx/GetMemberFlightDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var objResult = $.parseJSON(data.d);
                if (objResult != null) {
                    var holder = $(targ).find("div.flightinfo");
                    holder.find("ul.flightNo li.info").html(objResult.FlightNo);
                    holder.find("ul.passport li.info").html(objResult.Passport);
                    holder.find("ul.flightDest li.info").html(objResult.FlightDestination);
                    holder.find("ul.flightDate li.info").html(objResult.FlightDateTime);
                    holder.find("ul.flightTime li.info").html(objResult.FlightDepartureTime);
                    memberID = objResult.Member_AutoID;
                }
            }
        });
    }

    function editFlightCallBack() {
        loadMemberFlightDetails(".container_16");
        validateBeforeCheckOut2("", false);
    }

    //ASCENTIS-glaissa: 27022013
    //load data in MyAccount-Cart and Shopping Cart page
    function loadMyAcctCart(targ) {
        var sData = { LanguageCode: $.cookie("Language"), needAttributeSet: true };
        var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetShoppingCart",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //console.log("data:" + data.d);
                var objResult = $.parseJSON(data.d);
                var strVar = '';

                var holder = $(targ).find("div.grid_16 div.content");
                var retailer = "";
                var rowColor = "white";
                var template = holder.find("div.template").clone();
                var groupBox;
                holder.find("div.template").empty();
                if (targ == ".container_16") {
                    $(targ).find("a.updatebtn").css("display", objResult.length == 0 ? "none" : "block");
                    $(targ).find("div.buttons a.red").css("display", objResult.length == 0 ? "none" : "block");
                    if (objResult.length > 0 && (IsGuest == "true" || IsGuest == true)) {
                        $(targ).find("div.buttons a.brown").show().unbind("click").click(SaveAndContinue);
                    } else {
                        $(targ).find("div.buttons a.brown").hide().unbind("click");
                    }
                }

                $.each(objResult, function (i, item) {
                    if (retailer != item.Retailer) {
                        groupBox = template.find("div.groupbox").clone();
                        if (groupBox.length == 0) groupBox = holder.find("div.groupbox").clone();
                        var groupHdr = groupBox.find("div.groupbar div.groupheader");
                        groupHdr.html("Retailer: " + item.Retailer);
                    }

                    var itemRow = groupBox.find("div.item.row").clone();
                    itemRow.css("display", "block");
                    itemRow.attr("class", i % 2 == 0 ? "item white" : "item brown");
                    //Added by ChenChi on Mar 06 2013
                    var imagePath = item.ImagePath.toLowerCase();
                    imagePath = imagePath.replace("_std.jpg", "_190x190.jpg").replace("_square", "_190x190.jpg");

                    itemRow.find("div.itemimg .img").attr("src", imagePath);

                    itemRow.find("div.itemdes h1.itemname").html(item.ProductName);
                    itemRow.find("div.itemdes li.itemnum").html("SKU: " + item.SKU);
                    itemRow.find("div.itemdes li.alert").css("display", "none");
                    if (parseInt(item.MemberAge) < parseInt(LAG_AgeLimit) && item.AgeLimit == true && item.IsAlcohol == true) {
                        displayLAGInlineMsg(itemRow, "Sorry, you have to be of legal age to purchase this product.");
                    }
                    else {
                        if (item.IsAlcohol == true || item.IsLAG == true) {
                            if (validateDestCountry(item.Destination) > 0) {
                                displayLAGInlineMsg(itemRow, "You have picked a LAGs item. Unfortunately, the Online Retail service is unable to fulfill orders where the destination is to Australia or America. Please check-in earlier to make your purchase at the outlet.");
                            }
                            else {
                                if (item.IsAlcohol == true) {
                                    var msg = "";
                                    if (item.LAGMessage == "") {
                                        msg = "You have picked an alcoholic item. " + ((item.Destination != "") ? "As your destination<br />is <u>" + item.Destination + "</u>, " : "") + "please<br />take note of the LAG (Liquids, Aerosols, and Gels)<br />restrictions at your travel destination.<br />Purchases exceeding the allowance might be<br />subjected to duty upon arrival."
                                    }
                                    else {
                                        msg = "Duty-free allowance for<br /><u>" + item.Destination + "</u> is<br /><i>" + item.LAGMessage + "</i>.<br />Purchases exceeding the allowance might be subjected to duty upon arrival.";
                                    }
                                    displayLAGInlineMsg(itemRow, msg);
                                }
                            }
                        }
                    }

                    var options = itemRow.find("div.itemoption");
                    var optionName = options.find("ul.name").clone();
                    var optionValue = options.find("ul.selection").clone();
                    $.each(item.Attributes, function (j, att) {
                        optionName.append("<li>" + att.AttributeName + ": </li>");
                        var value = att.AttributeValue_Name;
                        if (item.BrandDetailUrl != null && item.BrandDetailUrl != "" && att.AttributeName.toLowerCase() == "shade" && value.search('/') > 0) {
                            if (value.search('\\(') == 0) { value = value.substr(value.search('\\)') + 1); }
                            value = value.substr(0, value.search('/') - 1);
                            optionValue.append("<li>" + value + "</li>");
                        } else { optionValue.append("<li>" + att.AttributeValue_Name + "</li>"); }
                    });
                    if (item.Attributes.length == 0) {
                        optionName.append("<li>&nbsp;</li>");
                        optionValue.append("<li>&nbsp;</li>");
                    }
                    options.append(optionName);
                    options.append(optionValue);

                    if (targ == ".container_16") {
                        itemRow.attr("id", item.ShoppingCartItem_AutoID);
                        itemRow.find("ul.itemqty li.limitedQty").html(item.LimitedQuantity);
                        itemRow.find("ul.itemqty li span").html(item.Quantity);
                        itemRow.find("ul.itemqty li input").val(item.Quantity);
                        itemRow.find("ul.itemqty a.simplebutton").click(updateCart);
                        itemRow.find("a.simplebutton.itemremove").click(removeCart);

                        var stockAvail = parseInt(item.StockQuantity) - parseInt(item.Quantity);
                        if (parseInt(item.LimitedQuantity) > 0 && parseInt(item.Quantity) > parseInt(item.LimitedQuantity)) {
                            itemRow.find("ul.itemqty li.qtylag").css("display", "block");
                        } else if (stockAvail < parseInt(item.OutOfStockQuantity)) {
                            itemRow.find("ul.itemqty li.qtylag").css("display", "block");
                        }

                        itemRow.find("ul.itemqty li input").keydown(function (event) {
                            var input = parseInt(event.keyCode);
                            if (event.shiftKey) {
                                event.preventDefault();
                                return false;
                            }
                            else {
                                if ((input >= 48 && input <= 58) || input == 8 || input == 46 || input == 37 || input == 39) {
                                }
                                else {
                                    event.preventDefault();
                                    return false;
                                }
                            }
                        });
                    }

                    if (item.Price < item.OriginPrice) {
                        itemRow.find("ul.itemunit li.unitprice").html("<span style=\"text-decoration: line-through;font-size: 11px;margin-right: 6px;\">S$" + numberWithCommas(parseFloat(item.OriginPrice).toFixed(2)) + "<\/span>" + "S$" + numberWithCommas(parseFloat(item.Price).toFixed(2)));
                    } else {
                        itemRow.find("ul.itemunit li.unitprice").html("S$" + numberWithCommas(parseFloat(item.Price).toFixed(2)));
                    }

                    if (item.DowntownPrice != '' && item.DowntownPrice != '0' && item.DowntownPrice != "$0") {
                        itemRow.find("ul.itemunit li.downtownprice span").html("S$" + numberWithCommas(parseFloat(item.DowntownPrice).toFixed(2)));
                        itemRow.find("ul.itemunit li.gstsavings").css("margin-top", "0px");
                    } else {
                        itemRow.find("ul.itemunit li.downtownprice").hide();
                    }

                    if (item.Savings != '' && item.Savings != '$' && item.Savings != '0' && parseFloat(item.Savings) > 0) {
                        itemRow.find("ul.itemunit li span.savings").html("S$" + numberWithCommas(parseFloat(item.Savings).toFixed(2)));
                    } else {
                        itemRow.find("ul.itemunit li.gstsavings").hide();
                    }

                    if (targ == "#myAcctCart_Template") {
                        itemRow.find("ul.itemqty li").html(item.Quantity);
                        var totalPrice = parseFloat(item.Quantity) * parseFloat(item.Price.replace(',', ''));

                        itemRow.find("div.itemtotal span").html("S$" + numberWithCommas(parseFloat(totalPrice).toFixed(2)));
                    }

                    if (retailer != item.Retailer) {
                        strVar += "</div>";
                    }
                    retailer = item.Retailer;
                    rowColor = "brown";

                    groupBox.css("display", "block");
                    groupBox.append(itemRow);
                    holder.append(groupBox);
                });
                //var totalItems = $("div.cart-btn div.link a div.count").html();
                //$(targ).find("div.grid_16 div.mycart .quantity").html(totalItems);

                updateTotalPrice();
            }
        }).done(function (e) {
            var id = "container2";
            var currentPage = "cart";
            LoadRecommended("0", id, "recommended-items", currentPage);
            LoadRecently("0", id, "recent-items", currentPage);
            LoadWishlist("0", id, "wishlist", currentPage);
        });

        $(targ).find("div.buttons a.white").click(function () {
            window.location.href = "../Default.aspx";
        });
    }

    //ASCENTIS-glaissa: 27022013
    function updateCart(e) {
        e.preventDefault();

        $(this).find("div.text").css({ display: "none" });
        $(this).find("div.loader").css({ display: "block" });

        var itemName = $(this).parent().parent().parent().find("h1.itemname").html();

        limitedQty = $(this).parent().parent().find("li.limitedQty").html();
        oldQty = $(this).parent().parent().find("span").html();
        newQty = $(this).parent().parent().find("input").val();
        cartID = $(this).parent().parent().parent().attr("id");

        var oldQtyFld = $(this).parent().parent().find("span");
        var newQtyFld = $(this).parent().parent().find("input");
        var stockMsg = $(this).parent().parent().find("li.qtylag");
        var divText = $(this).find("div.text");
        var divLoader = $(this).find("div.loader");

        if (newQty > 0 && newQty != "") {
            var sData = { ShoppingCartAutoID: cartID, NewQuantity: newQty };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsShoppingCart.asmx/UpdateShoppingCartItemQuantity",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var objResult = $.parseJSON(data.d);

                    switch (objResult.status) {
                        case 1:
                            {
                                oldQtyFld.html(newQty);
                                updateCartCookie(objResult);
                                stockMsg.css("display", "none");
                                break;
                            }
                        case 2:
                            {
                                //stockMsg.css("display", "block");
                                newQtyFld.val(oldQty);
                                modal.showFree("Information", "Your requested quantity is no longer available. Please change your order quantity.", CallbackFunction, "auto", 100);
                                break;
                            }
                        case 3:
                            {
                                newQtyFld.val(oldQty);
                                modal.showFree("Information", "Maximum allowable quantity for " + itemName + " is " + limitedQty + ".<br/>Please update the product quantity.", CallbackFunction, "auto", "auto");
                                break;
                            }
                        case 4:
                            {
                                newQtyFld.val(oldQty);
                                modal.showFree("Information", "Maximum volume of alcoholic beverages allowed is 10 litres per flight.<br/>Please update the product quantity.", CallbackFunction, "auto", "auto");
                                break;
                            }
                        case -1:
                            {
                                modal.showFree("Information", "Failed to update cart, please try again later. <br />Should this problem presists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110);
                                break;
                            }
                    }
                    divText.css({ display: "block" });
                    divLoader.css({ display: "none" });
                }
            });
        }
        else {
            newQtyFld.val((oldQty != "" || oldQty != "0") ? oldQty : 1);
            modal.showFree("Information", "Minimum quantity is 1", CallbackFunction, 400, 100);
            divText.css({ display: "block" });
            divLoader.css({ display: "none" });
        }

    }

    function CallbackFunction() {
        return false;
    }

    //ASCENTIS-glaissa: 27022013
    function updateCartCookie(data) {
        var objResult = data;
        var cartCookieName = "Cart-" + objResult.member;
        if ($.cookie(cartCookieName) != null) {
            var cartJson = $.parseJSON($.cookie(cartCookieName)); ;
            $.each(cartJson.params, function (i, item) {
                if (item.cartID == cartID) {
                    item.qty = newQty;
                }
            });
            $.cookie(cartCookieName, JSON.stringify(cartJson), { path: '/' });
            updateTotalPrice();
        }
    }

    //ASCENTIS-glaissa: 27022013
    function updateTotalPrice() {
        var totalPrice = 0;
        var totalSavings = 0;
        $(" input[name='itemqty']").each(function () {
            var quantity = $(this).val();
            var oldQty = $(this).parent().parent().find("span.oldValue").html();
            if (quantity != '') {
                if (quantity != oldQty) {
                    quantity = oldQty;
                }
                var itemPrice = $(this).parent().parent().parent().find("ul.itemunit li.unitprice").clone().children().remove().end().text().replace("S$", "");
                // alert("itemPrice  : " + itemPrice);
                var itemTotalPrice = parseFloat(quantity) * parseFloat(itemPrice.replace(',', ''));

                totalPrice = totalPrice + itemTotalPrice;

                $(this).parent().parent().parent().find("div.itemtotal span").html("S$" + numberWithCommas(parseFloat(itemTotalPrice).toFixed(2)));

                var itemSavings = $(this).parent().parent().parent().find("ul.itemunit li span.savings").html().replace("S$", "");
                var itemTotalSavings = parseFloat(quantity) * parseFloat(itemSavings);
                totalSavings = parseFloat(totalSavings) + parseFloat(itemTotalSavings);
            }
        });
        $(".container_16").find("div.total ul li.prices").html("S$" + numberWithCommas(parseFloat(totalPrice).toFixed(2)));
        $(".container_16").find("div.total ul.prices").html("S$" + numberWithCommas(parseFloat(totalSavings).toFixed(2)));
    }

    //ASCENTIS-glaissa: 27022013
    function removeCart(e) {
        e.preventDefault();
        cartID = $(this).parent().attr("id");
        modal.showConfirm("Confirm", "Are you sure to remove this item from your shopping cart?", confirmRemove, cancelCallback, "auto", 100);
    }

    function confirmRemove() {
        var sData = { ShoppingCartAutoID: cartID };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/DeleteShoppingCartItemByMember",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(removeCartCookie);
    }

    function cancelCallback() {
        return false;
    }

    //ASCENTIS-glaissa: 27022013
    function removeCartCookie(data) {
        var objResult = $.parseJSON(data.d);
        if (objResult.status != -1) {
            var cartCookieName = "Cart-" + objResult.member;
            var cartCookieCount = "CartCount-" + objResult.member;
            var cartJson = $.parseJSON($.cookie(cartCookieName));
            var cartCount = parseInt($.cookie(cartCookieCount)) - 1;
            cartJson.params = $.grep(cartJson.params,
                                        function (item, index) {
                                            return item.cartID != cartID;
                                        });
            $.cookie(cartCookieName, JSON.stringify(cartJson), { path: '/' });
            $("#" + cartID).find("ul.itemunit li.unitprice").html("$0");
            var groupItem = 0;
            var groupParent = $("#" + cartID).parent();
            $("#" + cartID).parent().find(" div.item").each(function () {
                groupItem = groupItem + 1;
            });

            $("#" + cartID).remove();
            if (groupItem <= 2) { groupParent.remove(); }

            $.cookie(cartCookieName, null, { path: '/' });
            $.cookie(cartCookieCount, null, { path: '/' });
            cartPanel.loadShoppingCart(objResult.member, 1);
            updateTotalPrice();

            var price = $(".container_16").find("div.total ul.prices").html();
            price = parseFloat(price.replace("S$", ""));
            if (price == 0) {
                $(".container_16").find("a.updatebtn").css("display", "none");
                $(".container_16").find("div.buttons a.red").css("display", "none");
            }
        }
        else {
            modal.showFree("Information", "Failed to remove item from cart, please try again later. <br />Should this problem presists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110);
        }
    }

    function validatePromoCode() {
        var promocode = $("#promocode").val();
        if (promocode != "") {
            var amount = $(".container_16").find("div.total ul li.prices").html().replace("S$", "");
            var sData = { PromoCode: promocode, OrderAmt: amount };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetPromotionCode",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var objResult = $.parseJSON(data.d);
                    if (objResult != null) {
                        if (objResult.status == "1" && objResult.message != "") {
                            modal.showFree("Information", objResult.message, function () { $("#promocode").focus(); }, 410, 100);
                        } else if (objResult.status == "0" && objResult.message != "") {
                            modal.showFree("Information", objResult.message, function () { $("#promocode").focus(); }, 410, "auto");
                        } else {
                            if (objResult.type == "GIFT") {
                                modal.showFree("Redemption Successful", "Successfully redeemed. The promotion code indicated on your collection slip*<br />is to be presented at the collection centre.<br />You will receive the " + objResult.desc + " when you collect your purchases.<br /><br />*The collection slip will be sent to your email after payment.",
                                    function () {
                                        promoDtls = { id: objResult.id, code: objResult.code, type: objResult.type, discount: objResult.discount };
                                        validateBeforeCheckOut1();
                                    }, "auto", "auto");
                            } else {
                                promoDtls = { id: objResult.id, code: objResult.code, type: objResult.type, discount: objResult.discount };
                                validateBeforeCheckOut1();
                            }
                        }
                    }
                }
            });
        }
    }

    function validateBeforeCheckOut1() {
        var IsGuest = false, webMethod = "";
        if ($.cookie("IsGuest") != null) IsGuest = $.cookie("IsGuest");
        webMethod = (IsGuest == "true" || IsGuest == true) ? "wsMember.asmx/GetGuestDetails" : "wsFlight.asmx/GetMemberFlightDetails";

        var sData = { dateFormat: "dd MMM yyyy" };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/" + webMethod,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var objResult = $.parseJSON(data.d);
                if (objResult != null) {
                    switch (objResult.status) {
                        case 0:
                            {
                                if (IsGuest == "true" || IsGuest == true) {
                                    ShowCheckoutModal(objResult);
                                } else {
                                    if (!flightConfirmed && objResult.FlightDT114Flag == 0) {//Modified by ChenChi on May 08 2013 to verify the flight info   
                                        $overlay.showFlightPanel(true, true, false, validateBeforeCheckOut2);
                                    }
                                    else {
                                        validateBeforeCheckOut2(objResult.FlightDestination);
                                    }
                                }
                                break;
                            }
                        case 1: { modal.showFree("Information", "Sorry, we were unable to check your flight information, Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110); break; }
                        case 2:
                            {
                                if (IsGuest == "true" || IsGuest == true) {
                                    ShowCheckoutModal(objResult);
                                } else {
                                    $overlay.showFlightPanel(true, false, false, function () { loadMemberFlightDetails(".container_16"); validateBeforeCheckOut2(); });
                                    break;
                                }
                            }
                    }
                }
            }
        });
    }

    function validateBeforeCheckOut2(flightDest, displayMsg) {
        //Validate AgeLimit, LAG Prohibited Countries, Stock Quantity
        //also need to validate alcohol volume "should allow only up to 10 litres of total alcoholic items per order transaction"
        //Modified by ChenChi on May 12 2013 to validate the total alcohol volume
        var totalAlcoholVolume = 0;
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetShoppingCartValidationCheck",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var cartData = $.parseJSON(data.d);
                var errorMsg = "";
                var totalAlcoholVolume = 0; //Unit Liter

                if (cartData != null) {
                    var withAgeLimit = 0;
                    var withProhibitedDest = 0;
                    var withOutOfStock = 0;
                    $.each(cartData, function (i, item) {
                        var cartItemRow = $("#" + item.ShoppingCartItem_AutoID);
                        cartItemRow.find("div.itemdes li.alert").css("display", "none");
                        if (parseInt(item.MemberAge) < parseInt(LAG_AgeLimit) && item.AgeLimit == true && item.IsAlcohol == true) {
                            displayLAGInlineMsg(cartItemRow, "Sorry, you have to be of legal age to purchase this product.");
                            withAgeLimit = parseInt(withAgeLimit) + 1;
                        }
                        else {
                            if (item.IsAlcohol == true || item.IsLAG == true) {
                                if (validateDestCountry(item.Destination) > 0) {
                                    displayLAGInlineMsg(cartItemRow, "You have picked a LAGs item. Unfortunately, the Online Retail service is unable to fulfill orders where the destination is to Australia or America. Please check-in earlier to make your purchase at the outlet.");
                                    withProhibitedDest = parseInt(withProhibitedDest) + 1;
                                }
                                else {
                                    if (item.IsAlcohol == true) {
                                        var msg = "";
                                        if (item.LAGMessage == "") {
                                            msg = "You have picked an alcoholic item. As your destination<br />is <u>" + item.Destination + "</u>, please<br />take note of the LAG (Liquids, Aerosols, and Gels)<br />restrictions at your travel destination.<br />Purchases exceeding the allowance might be<br />subjected to duty upon arrival."
                                        }
                                        else {
                                            msg = "Duty-free allowance for <u>" + item.Destination + "</u> is<br /><i>" + item.LAGMessage + "</i>.<br />Purchases exceeding the allowance might be subjected to duty upon arrival.";
                                        }
                                        displayLAGInlineMsg(cartItemRow, msg);

                                        //Modified by ChenChi on May 12 2013
                                        if (totalAlcoholVolume == 0 && item.TotalAlcoholVolumeInCart > 0) {
                                            totalAlcoholVolume = item.TotalAlcoholVolumeInCart;
                                        }
                                    }
                                }
                            }
                        }

                        var stockAvail = parseInt(item.StockQuantity) - parseInt(item.Quantity);
                        if (parseInt(item.LimitedQuantity) > 0 && parseInt(item.Quantity) > parseInt(item.LimitedQuantity)) {
                            cartItemRow.find("ul.itemqty li.qtylag").css("display", "block");
                            withOutOfStock = parseInt(withOutOfStock) + 1;
                        } else if (stockAvail < parseInt(item.OutOfStockQuantity)) {
                            cartItemRow.find("ul.itemqty li.qtylag").css("display", "block");
                            withOutOfStock = parseInt(withOutOfStock) + 1;
                        }
                    });


                    if (withAgeLimit > 0) {
                        errorMsg = errorMsg + "- Item is not allowed due to the age restriction.<br />";
                    }
                    if (withProhibitedDest > 0) {
                        errorMsg = errorMsg + "- Online Retail service is unable to fulfill orders for LAG items where <br />&nbsp;&nbsp;the destination is to Australia or America.<br />";
                        loadMemberFlightDetails(".container_16");
                    }
                    if (withOutOfStock > 0) {
                        errorMsg = errorMsg + "- Item is not available in the desired quantity or not in stock.<br />";
                    }
                    if (totalAlcoholVolume > 10) {
                        errorMsg = errorMsg + "- Maximum volume of alcoholic beverages allowed is 10 litres per flight.<br />";
                    }
                }
                if (displayMsg == null) {
                    if (errorMsg != "") {
                        //errorMsg = "One of the items in your shopping cart failed the validation check due to the following. <br />Please adjust the quantity or remove the item from your cart. <br /><br />" + errorMsg;
                        errorMsg = "We are unable to proceed to checkout due to following reasons(s): <br/><br />" + errorMsg + "<br />Please make the necessary changes to proceed.";
                        modal.showFree("Warning", errorMsg, CallbackFunction, "auto", "auto");
                    }
                    else {
                        modal.showLoading("Loading...");

                        if ($("#promocode").val() != "" && promoDtls != null) {
                            $.cookie("PromoDtls", JSON.stringify(promoDtls), { path: '/' });
                        } else { $.cookie("PromoDtls", null, { path: '/' }); }

                        window.location.href = "../Checkout/Confirmation.aspx";
                    }
                }
            }
        });
        return;
    }

    function ProceedToPay() {
        var fields = checkoutPanel.find("div.inputs div.fields input");
        var email = checkoutPanel.find("input[name='email']").val();
        var verifyemail = checkoutPanel.find("input[name='verifyemail']").val();
        var passport = checkoutPanel.find("input[name='passport']").val();
        var rqdFields = 0;
        if (isPassportMandatory != null && isPassportMandatory == "1") {
            rqdFields = fields.filter(function () { return (($(this).val() == "" || $(this).val() == null || $(this).val() == undefined)); }).length;
        } else {
            rqdFields = fields.filter(function () { return (($(this).attr("name") != "passport") && ($(this).val() == "" || $(this).val() == null || $(this).val() == undefined)); }).length;
        }

        if (!isValidEmail(email) || (checkoutPanel.find("input[name='passport']").attr("readonly") != "readonly" && !isValidPassportNum(passport)) || (email != verifyemail) || rqdFields > 0) {
            if (rqdFields > 0) {
                modal.showFree("Oops", "Please ensure all fields are completed.", CallbackFunction, 400, 100);
                return;
            } else if (!isValidEmail(email)) {
                modal.showFree("Warning", "Invalid email address.", CallbackFunction, 400, 100);
                return;
            } else if (email != verifyemail) {
                modal.showFree("Warning", "Emails do not match.", CallbackFunction, 400, 100);
                return;
            } else if (!isValidPassportNum(passport)) {
                modal.showFree("Oops", "Please input valid passport number", CallbackFunction, 400, 100);
                return;
            }
        }

        var memberID = $.cookie("memberID") == null || $.cookie("memberID") == undefined ? 0 : $.cookie("memberID");
        ValidateGuestEmail(email, true);      
    }

    function UpdateGuestDetails(fromProceedToCheckout) {
        var dob = "", dest = "", name = "", email = "", passport = "", flightID = "", travelDate = "", newsLetter= false, memberID;
        var memberID = $.cookie("memberID") == null || $.cookie("memberID") == undefined ? 0 : $.cookie("memberID");

        if (checkoutPanel != undefined && checkoutPanel.css("display") == "block") {
            //dob = checkoutPanel.find("input[name='bDate']").val();
            var day = $("select.bdayfield.dayPicker").val(), mth = $("select.bdayfield.mthPicker").val(), year = $("select.bdayfield.yearPicker").val();
            dob = year + '/' + mth + '/' + day;

            dest = (flightBox.attr("data-flightDest") == undefined || flightBox.attr("data-flightDest") == null) ? "" : flightBox.attr("data-flightDest");
            name = checkoutPanel.find("input[name='name']").val();
            email = checkoutPanel.find("input[name='email']").val();
            passport = checkoutPanel.find("input[name='passport']").val();
            if (checkoutPanel.find("input[name='passport']").attr("readonly") == "readonly") {
                passport = checkoutPanel.find("span.origpassport").text();
            }
            flightID = (flightBox.attr("data-flightID") == undefined || flightBox.attr("data-flightID") == null) ? "" : flightBox.attr("data-flightID");
            travelDate = flightDate.val();
            newsLetter = $('#checkoutNewsletter').attr('checked') ? true : false;
        } else {
            email = emailPanel.find("div.inputs input[name='emailaddress']").val();
        }
        if (newsLetter == true) {
            $.ajax({ url: $API.SUBSCRIBE, type: "POST", data: { "service": "subscribe", "email": email }
            }).done(function () {
                var sData = { GuestAutoID: memberID, BirthDate: dob, Destination: dest, Name: name, EmailAddress: email, Passport: passport, FlightAutoID: flightID, FlightDate: travelDate, NewsLetter: newsLetter };
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(sData),
                    url: wsHubPath + "WSHub/wsMember.asmx/UpdateGuestDetails",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (fromProceedToCheckout == true) {
                            validateBeforeCheckOut2();
                        } else {
                            SendGuestSaveCartAndWishlistEmail();
                        }
                    }
                });
            }
            );
        } else {
            var sData = { GuestAutoID: memberID, BirthDate: dob, Destination: dest, Name: name, EmailAddress: email, Passport: passport, FlightAutoID: flightID, FlightDate: travelDate, NewsLetter: newsLetter };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsMember.asmx/UpdateGuestDetails",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (fromProceedToCheckout == true) {
                        validateBeforeCheckOut2();
                    } else {
                        SendGuestSaveCartAndWishlistEmail();
                    }
                }
            });
        }
        
    }

    function ChangeGuest(fromGuestAutoID, guestEmail, guestName, toGuestAutoID, fromProceedToCheckout) {
        var sData = { GuestAutoID: fromGuestAutoID, GuestEmail: guestEmail, GuestName: guestName };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsMember.asmx/SetGuestAccount",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (data) {
            var sData = { FromGuestAutoID: toGuestAutoID, ToMemberAutoID: fromGuestAutoID };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsShoppingCart.asmx/ReplaceShoppingCartWishlist",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(function (data) {
                if (data != null) {
                    UpdateGuestDetails(fromProceedToCheckout);
                }
            });
        });
    }

    function SaveAndContinue() {
        var overlayHolder = $("div#overlay-container");
        emailPanel = $("div#overlay-container").find("div.savecartwishlist");

        if (checkoutPanel != undefined && checkoutPanel.css("display") == "block") {
            var emailaddress = checkoutPanel.find("input[name='email']").val();
            var verifyemailaddress = checkoutPanel.find("input[name='verifyemail']").val();
            if (!isValidEmail(emailaddress)) {
                modal.showFree("Warning", "Invalid email address.", CallbackFunction, 400, 100);
                return;
            } else if (emailaddress != verifyemailaddress) {
                modal.showFree("Warning", "Emails do not match.", CallbackFunction, 400, 100);
                return;
            }            
            ValidateGuestEmail(emailaddress, false);
        } else {
            $('body').css({ 'overflow': 'visible' });

            overlayHolder.find("div.quicklook").css("display", "none");
            overlayHolder.css({ zIndex: 2000, height: $(document).height() });
            overlayHolder.fadeIn(1000);
            emailPanel.fadeIn(1000);
            emailPanel.css({ top: $(window).scrollTop() + $(window).height() * .5 - 135 });
            emailPanel.css({ left: $(window).scrollLeft() + $(window).width() * .5 - 225 });

            var email = emailPanel.find("div.inputs input[name='emailaddress']");
            var vemail = emailPanel.find("div.inputs input[name='verifyemail']");
            var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
            emailPanel.find("> div.header > a.close.closing").click(function () {
                emailPanel.find("> div.header a.close.closing").unbind();
                overlayHolder.fadeOut(1000);
                emailPanel.fadeOut(1000);
            });
            emailPanel.find("> div.content a.confirmbt").click(function () {
                if ($(this).hasClass("loading")) return false;
                $(this).addClass("loading");

                var msg = "";
                if (!emailRegex.test(email.val())) {
                    msg = "Invalid email address.";
                    $(this).removeClass("loading");
                }
                else if (email.val() != vemail.val()) {
                    msg = "Emails do not match.";
                    $(this).removeClass("loading");
                }
                if (msg != "") {
                    modal.showFree("Information", msg, function () { return false; }, "auto", 100);
                    return false;
                }
                else {
                    var emailaddress = email.val();
                    ValidateGuestEmail(emailaddress, false);
                }
            });
            emailPanel.find("> div.content a.cancelbt").click(function () {
                emailPanel.find("> div.header a.close.closing").unbind();
                overlayHolder.fadeOut(1000);
                emailPanel.fadeOut(1000);
            });
        }
    }

    function ValidateGuestEmail(email, FromProceedToCheckout) {
        var memberID = $.cookie("memberID") == null || $.cookie("memberID") == undefined ? 0 : $.cookie("memberID");
        var sData = { GuestAutoID: memberID, EmailAddress: email, LanguageCode: $.cookie("Language") };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsMember.asmx/IsGuestEmailExist",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (data) {
            var data = $.parseJSON(data.d);
            if (data != null) {
                var existGuestID = "", existGuestEmail = "", existGuestName = "";
                existGuestID = data.guestID;
                existGuestEmail = data.guestEmail;
                existGuestName = data.guestName;

                if (data.status == "1" || data.status == "2") {
                    //email exists as old guest, transfer new guest cart to old guest, set guest session to old guest session data               
                    ChangeGuest(existGuestID, existGuestEmail, existGuestName, memberID, FromProceedToCheckout);
                } else if (data.status == "3") {
                    //email exists as member, if login successful, will replace member's cart with guest's cart               
                    modal.showFree("Information", "The email you have entered is currently tied to an iShopChangi account.<br/>Please login to proceed with this transaction.", CallbackFunction, "auto", "auto");
                    var emailPanel = $("div#overlay-container").find("div.savecartwishlist");
                    if (emailPanel != undefined && emailPanel.css("display") == "block") {
                        emailPanel.find("> div.content a.confirmbt").removeClass("loading");
                    }                   
                } else {
                    UpdateGuestDetails(FromProceedToCheckout);
                }
            }
        });
    }

    function SendGuestSaveCartAndWishlistEmail() {
        var overlayHolder = $("div#overlay-container");
        var email;
        if (checkoutPanel != undefined && checkoutPanel.css("display") == "block") {
            email = checkoutPanel.find("input[name='email']").val();
        } else {
            email = emailPanel.find("div.inputs input[name='emailaddress']").val();
        }
        var member = $.cookie("memberID");
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/SendGuestSaveCartAndWishlistEmail",
            data: JSON.stringify({ 'Email': email }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                var info = "";
                if (msg.d == "1") {
                    info = "Your cart has been saved.<br/>We have sent a link to your email for you to continue shopping with us later.";
                } else {
                    info = " Sorry, we were unable to save your session.<br/>Please try again later.Should this problem persists, please contact us at enquiry@changiairport.com.";
                }                
                emailPanel.find("> div.content a.confirmbt").removeClass("loading");
                modal.showFree("Information", info, function () {
                    modal.closeAll();
                    overlayHolder.fadeOut(1000);
                    $("div#overlay-container .checkout,div#overlay-container .savecartwishlist").fadeOut(1000);
                }, "auto", "auto");
            },
            error: function () {
                modal.showFree("Information", "Error", function () {
                    modal.closeAll();
                    overlayHolder.fadeOut(1000);
                    $("div#overlay-container .checkout,div#overlay-container .savecartwishlist").fadeOut(1000);
                }, "auto", 100);
            }
        });        
    }

    var checkoutPanel, flightBox, flightField, flightDate, flightDest;
    function ShowCheckoutModal(data) {
        var overlayHolder = $("div#overlay-container");
        checkoutPanel = $("div#overlay-container").find("div.checkout");
        $('body').css({ 'overflow': 'visible' });

        overlayHolder.find("div.quicklook").css("display", "none");
        overlayHolder.css({ zIndex: 2000, height: $(document).height() });
        overlayHolder.fadeIn(1000);
        checkoutPanel.fadeIn(1000);
        checkoutPanel.css({ width: '710px', height: '400px' });
        checkoutPanel.css({ top: $(window).scrollTop() + $(window).height() * .5 - 60 });

        checkoutPanel.find("> div.header > a.close.closing").click(function () {
            checkoutPanel.find("> div.header a.close.closing").unbind();
            overlayHolder.fadeOut(1000);
            checkoutPanel.fadeOut(1000);
        });
        checkoutPanel.find("> div.content a.button1").unbind('click').click(ProceedToPay);

        var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
        if (IsGuest == "true" || IsGuest == true) {
            checkoutPanel.find("> div.content a.button2").show().unbind('click').click(SaveAndContinue);
        } else {
            checkoutPanel.find("> div.content a.button2").hide().unbind('click');
        }

        checkoutPanel.find("> div.content a.button3").click(function () {
            checkoutPanel.find("> div.header a.close.closing").unbind();
            overlayHolder.fadeOut(1000);
            checkoutPanel.fadeOut(1000);
        });

        InitGuestFields(data);
    }

    function InitGuestFields(data) {
        checkoutPanel = $("div#overlay-container").find("div.checkout");
        checkoutPanel.find("div.content").css("font-size", "15px");
        checkoutPanel.find("div.inputs.checkout").show();
        if (isPassportMandatory != null && isPassportMandatory == "1") checkoutPanel.find("div.passport div.title").html("Passport No.*");

        LoadCalendar();
        flightBox = checkoutPanel.find("div.flightdtls");
        flightField = checkoutPanel.find("input[name='flightno']");
        flightDate = checkoutPanel.find("input[name='flightdate']");
        flightDest = checkoutPanel.find("input[name='flightdest']");
        flightDate.datepicker({ dateFormat: 'dd M yy' });        

        if (data != null) {
            checkoutPanel.find("input[name='name']").val(data.Name);
            checkoutPanel.find("input[name='email']").val(data.Email);

            var day = $("select.bdayfield.dayPicker"), mth = $("select.bdayfield.mthPicker"), year = $("select.bdayfield.yearPicker");
            var bdate = data.DateOfBirth.split(" "); //DateOfBirth format: dd M yy.Sample: 28 Sep 1984
            if (bdate[0].substring(0, 1) == 0) { bdate[0] = bdate[0].substring(2, 1); }            
            day.val(bdate[0]);
            mth.find("option").each(function () {
                $(this).attr('selected', $(this).text() == bdate[1] ? 'selected' : null);
            });
            year.val(bdate[2]);

            //checkoutPanel.find("input[name='passport']").val(data.Passport);
            checkoutPanel.find("span.origpassport").html(data.Passport);
            checkoutPanel.find("a.editPassport").hide();
            if (data.Passport != null && data.Passport != "") {
                checkoutPanel.find("a.editPassport").show();
                checkoutPanel.find("input[name='passport']").attr("readonly","readonly");
                var passport = "";
                if (data.Passport.length > 5) {
                    var masked = data.Passport.substr(0, data.Passport.length - 5).length;
                    for (var i = 1; i <= masked; i++) { passport = passport + "*"; }
                    passport = passport + data.Passport.slice(-5);
                    checkoutPanel.find("input[name='passport']").val(passport.toUpperCase());
                }
            }

            if (data.IsAllowPromotion == 1) $('#checkoutNewsletter').attr('checked','checked');
            checkoutPanel.find("input[name='flightno']").val(data.FlightNo);
            checkoutPanel.find("input[name='flightdate']").val(data.FlightDateTime);
            if ((data.FlightNo != null && data.FlightNo != "") || (data.FlightDateTime != null && data.FlightNo != "")) {
                FlightDestinationSearch();
            } else if (data.FlightDestination != null && data.FlightDestination != "") {
                flightDest.val(data.FlightDestination);
            }
        }

        checkoutPanel.find("a.editPassport").click(function () {
            checkoutPanel.find("input[name='passport']").removeAttr("readonly");
            checkoutPanel.find("input[name='passport']").val("");
        });

        new InputKeyBinder(flightDate, function () {
            FlightDestinationSearch();
        }, true);

        new InputKeyBinder(flightField, function () {
            FlightDestinationSearch();
        }, false);

        var passport = checkoutPanel.find("input[name='passport']");
        passport.change(function () {
            passport = checkoutPanel.find("input[name='passport']");
            passport.val(passport.val().toUpperCase());
        });

        flightField.focusout(function () {
            var flightno = flightField.val().replace(/\ /g, '');
            if (flightno != "" && flightno.length >= 3) {
                var digits = flightno.substr(2);
                if (digits.length < 3) {
                    while (digits.length < 3) { digits = "0" + digits; }
                    flightField.val(flightno.substr(0, 2) + digits);
                    FlightDestinationSearch();
                } else {
                    flightField.val(flightno);
                    FlightDestinationSearch();
                }
            }
        });
    }

    function FlightDestinationSearch() {
        flightDest.val("( ...finding... )");
        var sData = { FlightNo: flightField.val(), FlightDateTime: flightDate.val() };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsFlight.asmx/GetFlightDestination",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (data) {
            data = $.parseJSON(data.d);
            if (data && data != null) {
                switch (data.status) {
                    case 0:
                        {
                            flightBox.attr("data-flightID", data.params.id);
                            flightBox.attr("data-flightDest", data.params.match);
                            flightBox.attr("data-airportCode", data.params.airportcode);
                            flightDest.val(data.params.match);
                            checkoutPanel.find("div.buttons a.button1").removeClass("disabled");
                            break;
                        }
                    case 1:
                        {
                            flightDest.val("( ...departure date is not within 1-14 days... )");
                            modal.showFree("Information", "Sorry, we are only able to process orders 1-14 days <br />prior to your departure date.",
                            function () { checkoutPanel.find("div.buttons a.button1").addClass("disabled"); }, "auto", "auto", null, null, null, false);
                            break;
                        }
                    case 2:
                        {
                            flightDest.val("( ...no match found... )");
                            checkoutPanel.find("div.buttons a.button1").addClass("disabled");
                            break;
                        }
                    case 3:
                        {
                            flightDest.val("( ...Flight ETD is not within operation hour... )");
                            modal.showFree("Information", "Our Collection Centre is operating from " + data.opstart + "-" + data.opend + ".<br />We are unable to processs your order due to your flight's timing.<br />Please make your purchase at the shop(s) in transit.",
                            function () { checkoutPanel.find("div.buttons a.button1").addClass("disabled"); }, "auto", "auto", null, null, null, false);
                            break;
                        }
                    default:
                        {
                            flightDest.val("( ...server problem... )");
                            checkoutPanel.find("div.buttons a.button1").addClass("disabled");
                        }
                }
            }
        });
    }

    function LoginCallbackFunction(email) {
        email = checkoutPanel.find("input[name='email']").val();
        if ($("#overlay-container")) $("#overlay-container").fadeOut(1000);
        var touchHover = TouchHoverHandler;
        touchHover(null, $("#nav-right").find("div.dropdown"));
        $("#nav-right").find("div.dropdown").find(" input[name='email']").focus();
        $("#nav-right").find("div.dropdown").find(" input[name='email']").val(email);
    }

    function displayLAGInlineMsg(cartItemRow, msg) {
        cartItemRow.find("div.itemdes li.alert").css("display", "block");
        cartItemRow.find("div.itemdes li.alert a").hover(onRollOver, onRollOout);
        cartItemRow.find("div.itemdes li.alert div.msg").html(msg);
    }

    function validateDestCountry(flightDest) {
        if (flightDest == null || flightDest == "") { flightDest = $("#FlightDetails").attr("data-flightDest"); }
        var prohibitedCtry = LAG_ProhibitedCountry.split(",");
        var flightDestination = (flightDest == null ? "" : flightDest);
        var withProhibitedDest = 0;
        for (var x = 0; x < prohibitedCtry.length; x++) {
            if (flightDestination.indexOf(prohibitedCtry[x]) > -1) {
                withProhibitedDest = parseInt(withProhibitedDest) + 1;
                x = prohibitedCtry.length + 1;
            }
        }
        return withProhibitedDest;
    }

    function isValidEmail(eMail) {
        var emailRegex = new RegExp(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/i);
        var valid = emailRegex.test(eMail);
        return valid;
    }

    function isValidPassportNum(inputPassportNum) {
        var passportRegex = new RegExp(/^[a-zA-Z0-9<]{6,10}([0-9]{1}[a-zA-Z]{3}[0-9]{7}[a-zA-Z]{1}[0-9]{7}[a-zA-Z0-9<]{14}[0-9]{2}){0,1}$/);
        var valid = passportRegex.test(inputPassportNum);
        return valid;
    }

    function ClearCart() {
        var cont = $("div.container_16 div.grid_16 div.content");
        var group = cont.find("div.groupbox").first().clone();
        var item = group.find("div.item.row");
        group.find("div.item").remove();
        group.append(item);
        cont.find("div.template").append(group);
        cont.find("> div.groupbox").remove();
    }

    function LoadCalendar() {
        var day = $("select.bdayfield.dayPicker"), mth = $("select.bdayfield.mthPicker"), year = $("select.bdayfield.yearPicker");
        year.empty(); mth.empty(); day.empty();
        year.append("<option />"); mth.append("<option />"); day.append("<option />");
        for (i = new Date().getFullYear(); i > 1900; i--) {
            year.append($('<option />').val(i).html(i));
        }
        var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (var i = 0; i < month.length; i++) {
            mth.append($('<option />').val(i + 1).html(month[i]));
        }
        for (var i = 1; i <= 31; i++) {
            day.append($('<option />').val(i).html(i));
        }

        mth.change(LoadDays);
        year.change(LoadDays);
    }

    function getNumberOfDays(year, month) {
        var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }

    function LoadDays() {
        var selMonth = $("select.bdayfield.mthPicker").val() - 1;
        var selYear = $("select.bdayfield.yearPicker").val();
        var days = getNumberOfDays(selYear, selMonth);
        var day = $("select.bdayfield.dayPicker").val();
        $("select.bdayfield.dayPicker").empty();
        for (var i = 1; i <= days; i++) {
            $("select.bdayfield.dayPicker").append($('<option />').val(i).html(i));
        }
        if (days == undefined) {
            for (var i = 1; i <= 31; i++) {
                $("select.bdayfield.dayPicker").append($('<option />').val(i).html(i));
            }
        }
        if (day != null || day != '') { $("select.bdayfield.dayPicker").val(day); }
    }

}

var $shoppingCartPg;
$(document).ready(function () {
    $shoppingCartPg = new ShoppingCartPg();

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    var token = getQueryString("token");
    var id = getQueryString("id");
    if (token && token != "" && id && id != "") {
        $.ajax({
            type: "POST",
            data: JSON.stringify({ GuestAutoID: id, token: token, LanguageCode: $.cookie("Language") }),
            url: wsHubPath + "WSHub/wsMember.asmx/VerifyGuestSaveLink",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (data) {
            if (data.d == "1") {

            } else {
                modal.showFree("Information", "Sorry, your stored cart is no longer available.<br/>Please add to new cart and continue shopping at iShopChangi.", function () {
                    modal.closeAll();
                }, "auto", "auto");
            }
            $shoppingCartPg.init();
            cartPanel.init();

            wishlist = new WishPanel($("#filter div.right div.wishlist-btn"));
            wishlist.init();

            $CartService = new CartService();
        });
    }
    else {
        $shoppingCartPg.init();
    }
});
