function CheckOut() {
    //var target = $("div.groupbox");
    var topOffset = $("div.grid_16.steps").offset().top - 40;

    var memberID = 0;

    this.loadMyAcctCart = loadMyAcctCart;

    this.init = function init() {

        $("a.nextstepbtn").click(nextStep);
        $(window).scroll(onpageScroll);

        var targ = $("div.cart");
        if (targ.html() == undefined) {
            targ = ".displaybox";
        }
        loadMemberFlightDetails(".container_16");
        loadMyAcctCart(targ);

        $("a.pay-now").click(validatePromoCode);
    }

    function loadMemberFlightDetails(targ) {
        var sData = { dateFormat: "dd MMM yyyy" };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url:  wsHubPath + "WSHub/wsFlight.asmx/GetMemberFlightDetails",
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


    //ASCENTIS-glaissa: 27022013
    //load data in MyAccount-Cart and Shopping Cart page
    function loadMyAcctCart(targ) {

        var sData = { LanguageCode: $.cookie("Language"), needAttributeSet: true };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url:  wsHubPath + "WSHub/wsShoppingCart.asmx/GetShoppingCart",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //console.log("d:" + data.d);
                var objResult = $.parseJSON(data.d);
                var strVar = '';

                var holder = $(targ).find("div.content").first();
                var retailer = "";
                var rowColor = "white";
                var template = holder.find("div.template").clone();
                var groupBox;
                holder.find("div.template").empty();
                $.each(objResult, function (i, item) {
                    if (retailer != item.Retailer) {
                        groupBox = template.find("div.groupbox").clone();
                        var groupHdr = groupBox.find("div.groupbar div.groupheader");
                        groupHdr.html("Retailer: " + item.Retailer);
                    }

                    var itemRow = groupBox.find("div.item.row").clone();

                    itemRow.css("display", "block");
                    itemRow.attr("class", i % 2 == 0 ? "item white" : "item brown");
                    //Added by ChenChi on Mar 06 2013
                    var imagePath = item.ImagePath.toLowerCase();
                    if (imagePath.indexOf("_std.jpg") > -1) {
                        imagePath = imagePath.replace("_std.jpg", "_190x190.jpg");
                    }
                    itemRow.find("div.itemimg .img").attr("src", imagePath);

                    itemRow.find("div.itemdes h1.itemname").html(item.ProductName);
                    itemRow.find("div.itemdes li.itemnum").html("SKU: " + item.SKU);


                    //ascentis-glaissa:added mar 24 2013
                    if (parseInt(item.MemberAge) < parseInt(LAG_AgeLimit) && item.AgeLimit == true && item.IsAlcohol == true) {
                        displayLAGInlineMsg(itemRow, "Sorry, you have to be of legal age to purchase this product.");
                    }
                    else {
                        if (item.IsAlcohol == true || item.IsLAG == true) {
                            var Dest = $(targ).find("div.flightinfo ul.flightDest li.info").html();
                            if (validateDestCountry(Dest) > 0) {
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
                    if (item.Attributes.length > 0) {
                        $.each(item.Attributes, function (j, att) {
                            optionName.append("<li>" + att.AttributeName + ": </li>");
                            var value = att.AttributeValue_Name;
                            if (item.BrandDetailUrl != null && item.BrandDetailUrl != "" && att.AttributeName.toLowerCase() == "shade" && value.search('/') > 0) {
                                if (value.search('\\(') == 0) { value = value.substr(value.search('\\)') + 1); }
                                value = value.substr(0, value.search('/') - 1);
                                optionValue.append("<li>" + value + "</li>");
                            } else { optionValue.append("<li>" + att.AttributeValue_Name + "</li>"); }
                        });
                    } else {
                        optionName.append("<li>&nbsp;</li>");
                        optionValue.append("<li>&nbsp;</li>");
                    }
                    options.append(optionName);
                    options.append(optionValue);

                    //if (targ == ".container_16") {
                    //itemRow.attr("id", item.ShoppingCartItem_AutoID);
                    itemRow.find("ul.itemqty li.qty").text(item.Quantity);

                    var stockAvail = parseInt(item.StockQuantity) - parseInt(item.Quantity);
                    if (stockAvail < parseInt(item.OutOfStockQuantity)) {
                        itemRow.find("ul.itemqty li.qtylag").css("display", "block");
                    }
                    //}
                    if (item.Price < item.OriginPrice) {
                        itemRow.find("ul.itemunit li.unitprice").html("<span style=\"text-decoration: line-through;font-size: 11px;margin-right: 6px;\">S$" + numberWithCommas(parseFloat(item.OriginPrice).toFixed(2).replace('$', '')) + "<\/span>" + "S$" + numberWithCommas(parseFloat(item.Price).toFixed(2).replace('$', ''))).parent().css('width', '140px !important'); ;
                    } else {
                        itemRow.find("ul.itemunit li.unitprice").html("S$" + numberWithCommas(parseFloat(item.Price).toFixed(2).replace('$', ''))).parent().css('width', '140px !important'); ;
                    }
                    
                    if (item.DowntownPrice != '' && item.DowntownPrice != '0' && item.DowntownPrice != "$0") {
                        itemRow.find("ul.itemunit li.downtownprice span").html("S$" + numberWithCommas(parseFloat(item.DowntownPrice).toFixed(2).replace('$', '')));
                        itemRow.find("ul.itemunit li.gstsavings").css("margin-top", "0px");
                    } else {
                        itemRow.find("ul.itemunit li.downtownprice").hide();
                    }

                    if (item.Savings != '' && item.Savings != '$' && item.Savings != '0' && parseFloat(item.Savings) > 0) {
                        itemRow.find("ul.itemunit li span.savings").html("S$" + numberWithCommas(parseFloat(item.Savings).toFixed(2).replace('$', '')));
                    } else {
                        itemRow.find("ul.itemunit li.gstsavings").hide();
                    }

                    //                    if (targ == "#myAcctCart_Template") {
                    //itemRow.find("ul.itemqty li").html(item.Quantity);
                    //var totalPrice = parseFloat(item.Quantity) * parseFloat(item.Price);
                    //itemRow.find("div.itemtotal span").html("$" + parseFloat(totalPrice).toFixed(2));
                    //                    }

                    if (retailer != item.Retailer) {
                        strVar += "</div>";
                    }
                    retailer = item.Retailer;
                    rowColor = "brown";

                    groupBox.css("display", "block");
                    groupBox.append(itemRow);
                    $(groupBox).insertBefore(".hub-gb"); //Modified by ChenChi on May 10 2013, sorting by Retailer Name, product name
                    //holder.append(groupBox);
                });
                var totalItems = $("div.cart-btn div.link a div.count").html();
                $(targ).find("div.grid_16 div.mycart .quantity").html(totalItems);

                updateTotalPrice();
            }
        });

        $(targ).find("div.buttons a.white").click(function () {
            window.location.href = "../Default.aspx";
        });
    }


    function validatePromoCode() {
        var promoJson = $.cookie("PromoDtls");
        var promocode = "";
        var promo = null;
        if (promoJson != null) {
            promo = $.parseJSON(promoJson);
            promocode = promo.code;
        }

        if (promocode != "") {
            var amount = $(".container_16").find("div.total ul li.prices").html().replace("S$", "");
            amount = parseFloat(amount) + parseFloat(promo.discount);
            var sData = { PromoCode: promocode, OrderAmt: amount, MemberAutoID: memberID };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url:  wsHubPath + "WSHub/wsShoppingCart.asmx/GetPromotionCode",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var objResult = $.parseJSON(data.d);
                    if (objResult != null) {
                        if (objResult.status == "1" && objResult.message != "") {
                            modal.showFree("Information", objResult.message, revertDiscount, 400, 100);
                        } else if (objResult.status == "0" && objResult.message != "") {
                            modal.showFree("Information", objResult.message, revertDiscount, 400, "auto");
                        } else { validateBeforeCheckOut(); }
                    }
                }
            });
        } else {
            validateBeforeCheckOut();
        }
    }

    function revertDiscount(promo) {
        var promoJson = $.cookie("PromoDtls");
        var promo = null;
        if (promoJson != null) {
            promo = $.parseJSON(promoJson);
            if (promo != null) {
                if (promo.type = "DOLLAR") {
                    var amount = $(".container_16").find("div.total ul li.prices").html().replace("S$", "");
                    amount = parseFloat(amount) + parseFloat(promo.discount);
                    $(".container_16").find("div.total ul li.prices").html("S$" + numberWithCommas(parseFloat(amount).toFixed(2).replace('$', '')));
                    $(".container_16").find("div.total ul.titles li.promodiscount").css("display", "none");
                    $(".container_16").find("div.total ul.prices li.promodiscount").css("display", "none");
                }
                $.cookie("PromoDtls", null, { path: '/' });
            }
        }
    }


    //ascentis-glaissa:added mar 24 2013
    function validateBeforeCheckOut() {
        //Validate AgeLimit, LAG Prohibited Countries, Stock Quantity once again
        var totalAlcoholVolumeInCart = 0;
        $.ajax({
            type: "POST",
            url:  wsHubPath + "WSHub/wsShoppingCart.asmx/GetShoppingCartValidationCheck",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var cartData = $.parseJSON(data.d);
                var errorMsg = "";
                if (cartData != null) {
                    var withAgeLimit = 0;
                    var withProhibitedDest = 0;
                    var withOutOfStock = 0;
                    $.each(cartData, function (i, item) {
                        var cartItemRow = $("#" + item.ShoppingCartItem_AutoID);
                        if (parseInt(item.MemberAge) < parseInt(LAG_AgeLimit) && item.AgeLimit == true && item.IsAlcohol == true) {
                            displayLAGInlineMsg(cartItemRow, "Sorry, you have to be of legal age to purchase this product.");
                            withAgeLimit = parseInt(withAgeLimit) + 1;
                        }
                        else {
                            if (item.IsAlcohol == true || item.IsLAG == true) {
                                if (validateDestCountry() > 0) {
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
                                        if (totalAlcoholVolumeInCart == 0 && item.TotalAlcoholVolumeInCart > 0) {
                                            totalAlcoholVolumeInCart = item.TotalAlcoholVolumeInCart;
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
                        errorMsg = errorMsg + "- Item is not allowed due to the age limit.<br />";
                    }
                    if (withProhibitedDest > 0) {
                        errorMsg = errorMsg + "- Online Retail service is unable to fulfill orders for LAG items where <br />&nbsp;&nbsp;the destination is to Australia or America.<br />";
                        loadMemberFlightDetails(".container_16");
                    }
                    if (withOutOfStock > 0) {
                        errorMsg = errorMsg + "- Item is not available in the desired quantity or not in stock.<br />";
                    }
                    if (totalAlcoholVolumeInCart > 10) {
                        errorMsg = errorMsg + "- Maximum volume of alcoholic beverages allowed is 10 litres per flight.<br />";
                    }
                }
                if (errorMsg != "") {
                    //errorMsg = "One of the items in your shopping cart failed the validation check due to the following. <br />Please adjust the quantity or remove the item from your cart. <br /><br />" + errorMsg;
                    errorMsg = "We are unable to proceed to checkout due to following reasons(s): <br/><br />" + errorMsg + "<br />Please make the necessary changes to proceed.";
                    modal.showFree("Warning", errorMsg, function () { return false; }, "auto", "auto");
                }
                else {
                    //modal.showLoading("Loading... Please Wait");
                    CheckoutUnpaidOrder();
                }
            }
        });
        return;
    }

    //Added by ChenChi on Mar 06 2013
    var orderNumber = "";
    function CheckoutUnpaidOrder(e) {
        //modal.showFree("Info", "New Sales Order Number: aaa", CallbackFunction1, 400, 100);
        //modal.showLoading("Loading... Please Wait");        

        var promoJson = $.cookie("PromoDtls");
        var discAmt = 0;
        var promocode = "";
        if (promoJson != null) {
            var promo = $.parseJSON(promoJson);
            if (promo.type == "DOLLAR") { discAmt = promo.discount; }
            promocode = promo.code;
        }

        orderNumber = $("#hdOrderNo").val();
        //glaissa modified jul 25 2013, remove repayment logic
//        if (orderNumber != null && orderNumber != "") {
//            //Repayment
//            var sData = { LanguageCode: $.cookie("Language") };
//            $.ajax({
//                type: "POST",
//                data: JSON.stringify(sData),
//                url:  wsHubPath + "WSHub/wsShoppingCart.asmx/ReserveProduct",
//                contentType: "application/json; charset=utf-8",
//                dataType: "json",
//                success: function (data) {
//                    var msg = $.parseJSON(data.d);
//                    if (msg != null) {
//                        if (msg.search("@@@") > -1) {
//                            msg = msg.replace("@@@", "");
//                            modal.closeAll();
//                            modal.showFree("Warning", msg, function () { return false; }, "auto", "auto");
//                        }
//                        else {
//                            var amount = $(".container_16").find("div.total ul li.prices").html().replace("$", "");
//                            var strHtml = "<iframe id=\"paymentGateway\" width=\"570px\" height=\"565px\" src=\"..\/Checkout\/CitibankGateway.aspx?Type=querydrWithPay&OrderNo=" + orderNumber + "&Amount=" + amount + "\" scrolling=\"no\" frameborder=0 seamless></iframe>";

//                            modal.showLoading("You are now being redirected to the Payment Gateway secure connection. Please wait...", 500, "auto");
//                            setTimeout(function () { modal.closeAll(); modal.showFree("Processing payment...", strHtml, CallbackFunction1, 600, 650, true, "..\/Default.aspx", true); }, 3000);
//                        }
//                    }
//                }
//            });
//        }
//        else {
        //New Payment
            var IsGuest = false;
            if ($.cookie("IsGuest") != null) IsGuest = $.cookie("IsGuest");
            var sData = { LanguageCode: $.cookie("Language"), DiscountAmt: discAmt, PromotionCode: promocode, IsGuest: IsGuest };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsShoppingCart.asmx/CheckoutUnpaidOrder",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    //ASCENTIS-glaissa:Mar 07 2013
                    orderNumber = $.parseJSON(data.d);
                    if (orderNumber.search("@@@") > -1) {
                        var msg = orderNumber.replace("@@@", "");
                        modal.closeAll();
                        modal.showFree("Warning", msg, function () { return false; }, "auto", "auto");
                    }
                    else {
                        var amount = $(".container_16").find("div.total ul li.prices").html().replace("S$", "");
                        var strHtml = "<iframe id=\"paymentGateway\" width=\"570px\" height=\"565px\" src=\"..\/Checkout\/CitibankGateway.aspx?Type=pay&OrderNo=" + orderNumber + "&Amount=" + amount + "\" scrolling=\"no\" frameborder=0 seamless></iframe>";

                        modal.showLoading("You are now being redirected to the Payment Gateway secure connection. Please wait...", 500, "auto");
                        setTimeout(function () { modal.closeAll(); modal.showFree("Processing payment...", strHtml, CallbackFunction1, 600, 650, true, "..\/Default.aspx", true); }, 3000);

                        // Added by Sandy 26/92013---------conversion straking code
                        var ebOrderID = orderNumber;
                        $("div.groupbox>div.item:not(.row)").each(function () {
                            var ebRev = $(this).find("div.itemtotal>span").text() + ''; //'[Revenue]';
                            if (ebRev.indexOf('S$') == 0) ebRev = ebRev.substring(2);
                            var ebProductID = $(this).find("li.itemnum").text() + '';  //'[ProductID]';
                            if (ebProductID.indexOf('SKU: ') == 0) ebProductID = ebProductID.substring(5);
                            var ebProductInfo = $(this).find("h1.itemname").text() + ''; //'[ProductInfo]';
                            var ebQuantity = $(this).find("li.qty").text() + ''; //'[Quantity]';
                            var ebRand = Math.random() + '';
                            ebRand = ebRand * 1000000;
                            //<![CDATA[ 
                            //document.write();
                            $("body").append('<scr' + 'ipt src="HTTP://bs.serving-sys.com/BurstingPipe/ActivityServer.bs?cn=as&amp;ActivityID=358988&amp;rnd=' + ebRand + '&amp;Value=' + ebRev + '&amp;OrderID=' + ebOrderID + '&amp;ProductID=' + ebProductID + '&amp;ProductInfo=' + ebProductInfo + '&amp;Quantity=' + ebQuantity + '"></scr' + 'ipt>');
                            //]]>
                        });
                    }
                }
            });
//        }
        return false;
    }

    function CallbackFunction1() {
        return false;
        //        if (orderNumber != "") {
        //            var sData = { OrderNumber: orderNumber, PaymentStatus: "PayFailure", CardType: "", CardNo: "", TransactionNo: "", DiscAmt: 0 };
        //            $.ajax({
        //                type: "POST",
        //                data: JSON.stringify(sData),
        //                url:  wsHubPath + "WSHub/wsShoppingCart.asmx/UpdatePaymentResult",
        //                contentType: "application/json; charset=utf-8",
        //                dataType: "json",
        //                success: function (data) {
        //                    if (data.d != null && data.d != "") {
        //                        $("#hdOrderNo").val(orderNumber);
        //                    }
        //                }
        //            });
        //        }
    }

    function validateDestCountry() {
        //if (flightDest == null || flightDest == "") { flightDest = $("#FlightDetails").attr("data-flightDest"); }
        var flightDest = $(".container_16 div.flightinfo").find("ul.flightDest li.info").html();
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

    function displayLAGInlineMsg(cartItemRow, msg) {
        cartItemRow.find("div.itemdes li.alert").css("display", "block");
        cartItemRow.find("div.itemdes li.alert a").hover(onRollOver, onRollOout);
        cartItemRow.find("div.itemdes li.alert div.msg").html(msg);
    }

    function nextStep(e) {
        validate();
    }
    function validate() {
        //validation goes here

        //show cart div if validation ok
        showcart();
        $("a.nextstepbtn").fadeOut(1000);
        $("div.grid_16.steps > ul > li").removeClass("active");
        $($("div.grid_16.steps > ul > li")[1]).addClass("active");
    }
    function showcart() {
        var targ = $("div.cart.displaybox");
        targ.css({ display: "block" });
        TweenMax.to(targ, 2, { css: { autoAlpha: 1 }, easing: Expo.easeOut });
        var targBt = $("div.cartbtn");
        targBt.css({ display: "block" });
        TweenMax.to(targBt, 2, { css: { autoAlpha: 1 }, easing: Expo.easeOut });

        var goX = targ.offset().top - 120;

        $('html,body').delay(500).animate({
            scrollTop: goX
        }, { duration: 1500, easing: 'easeInOutQuad' });

    }
    function onpageScroll(e) {

        //var spacer = $("div.grid_16.steps").offset().top - 40;
        var curY = $(window).scrollTop();

        if (curY < topOffset) {
            $("div.grid_16.steps").css({ top: 0 });
        } else {
            $("div.grid_16.steps").css({ top: curY - topOffset })
        }
    }

    //ASCENTIS-glaissa: 27022013
    function updateTotalPrice() {
        var totalPrice = 0;
        var totalSavings = 0;
        $("li.qty").each(function () {
            var quantity = $(this).text();

            if (quantity != '' && quantity != 'Qty' && $.isNumeric(quantity)) {
                var itemPrice = $(this).parent().parent().find("ul.itemunit li.unitprice").clone().children().remove().end().text().replace("S$", "");
                var itemTotalPrice = parseFloat(quantity) * parseFloat(itemPrice.replace(",",''));
                totalPrice = totalPrice + itemTotalPrice;
                $(this).parent().parent().find("div.itemtotal span").html("S$" + numberWithCommas(parseFloat(itemTotalPrice).toFixed(2).replace('$', '')));

                var itemSavings = $(this).parent().parent().find("ul.itemunit li span.savings").text().replace("S$", "");
                var itemTotalSavings = parseFloat(quantity) * parseFloat(itemSavings.replace(",", ''));
                totalSavings = parseFloat(totalSavings) + parseFloat(itemTotalSavings);
            }
        });

        var promoJson = $.cookie("PromoDtls");
        if (promoJson != null) {
            var promo = $.parseJSON(promoJson);
            if (promo.type == "DOLLAR" && parseFloat(promo.discount) > 0) {
                totalPrice = parseFloat(totalPrice) - parseFloat(promo.discount);
                $(".container_16").find("div.total ul.titles li.promodiscount").css("display", "block");
                $(".container_16").find("div.total ul.prices li.promodiscount").css("display", "block");
                $(".container_16").find("div.total ul.prices li.promodiscount").html("S$" + numberWithCommas(parseFloat(promo.discount).toFixed(2).replace('$', '')));
            }
        }

        $(".container_16").find("div.total ul li.prices").html("S$" + numberWithCommas(parseFloat(totalPrice).toFixed(2).replace('$', '')));
        $(".container_16").find("div.total ul.prices li.savings").html("S$" + numberWithCommas(parseFloat(totalSavings).toFixed(2).replace('$', '')));
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
}

$(document).ready(function () {

    $checkOut = new CheckOut();
    $checkOut.init();
});
