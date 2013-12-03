/**
* Service to help link up changing options within the view (for linking to backend) to receive data and update that view accordingly.
* @author Glenn Ko
*/

function ProductOptionsService(optionsHolder, btnHolder, quickPanel, stockLabelPassIn, stockSpinnerPassIn) { // only first parameter is compulsory
    var wishlistId;
    var wishlistRetailer;
    var wishlistName;
    var wishlistImage;

    function updateInfoStock(stock) {
        var s = stuff.stockSpinner;
        stuff.stock = stock;
        var val = s.spinner("value");
        s.spinner("option", "min", stock > 0 ? 1 : 0);
        if (val > stock) {
            s.spinner("value", stock);
        }
        inputStockLabel.html(stock);
        s.spinner("option", "max", stock);

    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    function optionSelected(e) {
        e.preventDefault();
        if (optionsHolder.hasClass("disabled")) return;
        var clickTarget = $(e.currentTarget);
        if (clickTarget.hasClass("selected")) {
            return false
        };
        if (stuff.isSingleGroup || clickTarget.hasClass("inactive")) {
            return false
        };
        var sData = {};
        sData.group = getQueryString("groupID"); // quickPanel.data("group");
        //ASCENTIS-glaissa:04032013
        if (sData.group == null) {
            sData.group = quickPanel.data("group");
        }

        sData.langType = $.cookie("Language");
        if (typeof quickPanel.data("retailer") === 'undefined') { //Added by ChenChi on Mar 13 2013, with Sandy' help
            sData.retailer = getQueryString("retailerID");
            quickPanel.data("retailer", sData.retailer);
        } else {
            sData.retailer = quickPanel.data("retailer");
        }
        sData.options = [];
        var clickParenter = clickTarget.parent().parent();
        if (clickParenter.data("type") == "retailer") {
            clickParenter.find("li").each(function (index, element) {
                if ($(this).data("id") == clickTarget.data("id")) {
                    $(this).addClass("selected");
                } else {
                    $(this).removeClass("selected");
                }
            });
            sData.retailer = clickTarget.data("value");
            //ASCENTIS-glaissa: 27022013
            quickPanel.data("retailer", sData.retailer);
            //sData.options.push ({id:clickParenter.data("id") , value:clickTarget.data("value") });//Merged with Kilo 20130227 version by ChenChi
        } else if (clickParenter.data("type") == "radio") {
            clickParenter.find("li").each(function (index, element) {
                if ($(this).data("id") == clickTarget.data("id")) {
                    $(this).addClass("selected");
                } else {
                    $(this).removeClass("selected");
                }

            });

            //Added by ChenChi on Jan 31 2013 to fetch all selected attribute
            //            sData.options.push({ id: clickTarget.parent().parent().data("id"), value: clickTarget.data("value") });
            //            if ($(this).hasClass("inactive")) {
            //                $(this).removeClass("inactive");
            //            } else {
            //                var tempSelectedItems = optionsHolder.find("ul.options.radio li.selected");
            //                tempSelectedItems.each(function () {
            //                    $(this).removeClass("selected");
            //                });
            //            }
            //            var tempSelectedItems = optionsHolder.find("ul.options.radio li.selected");
            //            tempSelectedItems.each(function () {
            //                sData.options.push({ id: $(this).parent().parent().data("id"), value: $(this).data("value") });
            //            });
            getAllSelectedAttributeOptions(sData);

        } else if (clickParenter.data("type") == "combo") {
            //console.log("not retailer option");
        }

        //console.log("option selected send:", JSON.stringify(sData));
        optionsHolder.addClass("disabled");
        stuff.optionClicked = clickTarget;
        stuff.sData = sData;

        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url:  wsHubPath + "WSHub/wsProduct.asmx/UpdateProductAttributeInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json"

        }).done(optionCallDone);
    }

    // to transfer


    function getOptionData(obj, search) {
        var returnKey = -1;
        $.each(obj, function (key, info) {
            if (info.id == search) {
                returnKey = key;
                return false;
            };
        });

        return returnKey;
    }


    function optionCallDone(data) {
        optionsHolder.removeClass("disabled");
        data = $.parseJSON(data.d);
        //console.log("optionCallDone ", data);
        var tOptionsData = data.params.options;
        var tULOptions = optionsHolder.children("ul.options")

        var radioSelectCount = 0;

        //ascentis-glaissa:added mar 20 2013
        if (quickPanel.data("isLAG") != undefined) {
            quickPanel.data("isLAG", data.params.isLAG);
            quickPanel.data("isAgeLimit", data.params.isAgeLimit);
            quickPanel.data("isAlcohol", data.params.isAlcohol);
        }
        if (quickPanel.attr("data-isLAG") != undefined) {
            quickPanel.attr("data-isLAG", data.params.isLAG);
            quickPanel.attr("data-isAgeLimit", data.params.isAgeLimit);
            quickPanel.attr("data-isAlcohol", data.params.isAlcohol);
        }

        tULOptions.each(function (index, element) {
            var tHolder = $(element);
            var tType = tHolder.data("type");
            if (tType == "retailer") {
                //update retailer portion here
            } else if (tType == "radio") {
                var tDataIndex = getOptionData(tOptionsData, tHolder.data("id"));
                var tListData = tOptionsData[tDataIndex].list;

                tHolder.find("li").each(function () {
                    var tListItem = $(this);

                    //if (tListItem[0] != stuff.optionClicked[0])  tListItem.removeClass("selected");
                    var tListItemData = tListData[getOptionData(tListData, tListItem.data("id"))];
                    if (tListItemData.available > 0) {
                        tListItem.removeClass("inactive");

                        //Added by ChenChi on Jan 28 2013                       
                        if (tListItemData.selected == 1) {
                            tListItem.addClass("selected");

                            if (data.params.brandcode != null && data.params.brandcode != "" && tOptionsData[tDataIndex].name.toLowerCase() == "shade") { //glaissa added july 3 2013
                                tListItem.addClass("selectedColor");
                            }

                        } else {
                            tListItem.removeClass("selected");
                            if (data.params.brandcode != null && data.params.brandcode != "" && tOptionsData[tDataIndex].name.toLowerCase() == "shade") { //glaissa added july 3 2013
                                tListItem.removeClass("selectedColor");
                            }
                        }
                    } else {

                        if (tListItem[0] != stuff.optionClicked[0]) {
                            tListItem.addClass("inactive");
                            tListItem.removeClass("selected");

                        } else {
                            tListItem.removeClass("inactive");
                            tListItem.addClass("selected");
                        }
                    }

                    radioSelectCount += tListItem.hasClass("selected") ? 1 : 0;
                });
                //console.log ("radio:", tOptionsData[tDataIndex]);
            } else if (tType == "input") {
                var tDataIndex = getOptionData(tOptionsData, tHolder.data("id"));
                var tData = tOptionsData[tDataIndex];

                if (tData.stock != null && stuff.stockSpinner != null) {
                    updateInfoStock(tData.stock);
                }
            }




        });

        if (data.params.price && stuff.divPrice.html() != undefined) { //glaissa modified aug 28 2013 for add to cart overlaydiv
            stuff.divPrice.html('S$' + numberWithCommas(parseFloat(data.params.price.replace('S$', '')).toFixed(2)));
        }


        stuff.prices = null;
        if (data.params.prices) {
            stuff.prices = data.params.prices;
            stuff.isAlcohol = data.params.isAlcohol;
            resetPriceListings();

        }

        //ascentis-glaissa: updated mar 20 2013
        //if (radioCount == radioSelectCount && stuff.stock > 0 && stuff.stockSpinner.spinner("value") != null && stuff.stockSpinner.spinner("value") <= stuff.stock) {
        if (stuff.stock > 0 && stuff.stockSpinner.spinner("value") != null && stuff.stockSpinner.spinner("value") <= stuff.stock) {
            stuff.addToCartBtn.removeClass("disabled");

        } else {

            stuff.addToCartBtn.addClass("disabled");
        }

        if ($("#FlightDetails").css("display") == "block") {
            stuff.addToCartBtn.addClass("disabled");
        }

        stuff.sData.options = [];
        getAllSelectedAttributeOptions(stuff.sData);
    }

    function checkRadioCount() {
        var radioSelectCount = optionsHolder.find("ul.options.radio li.selected").length;
        //if (radioCount == radioSelectCount && stuff.stock > 0 && stuff.stockSpinner.spinner("value") != null && stuff.stockSpinner.spinner("value") <= stuff.stock) {
        //ASCENTIS-glaissa:05032013
        if (stuff.stock > 0 && stuff.stockSpinner.spinner("value") != null && stuff.stockSpinner.spinner("value") <= stuff.stock) {
            stuff.addToCartBtn.removeClass("disabled");
        } else {
            stuff.addToCartBtn.addClass("disabled");
        }
    }

    function getAllSelectedAttributeOptions(jsonContainer) {
        var tempSelectedItems = optionsHolder.find("ul.options.radio li.selected");
        tempSelectedItems.each(function () {
            jsonContainer.options.push({
                id: $(this).parent().parent().data("id"),
                value: $(this).data("value")
            });
        });
    }

    function resetPriceListings() {
        var arr = stuff.prices;
        var listPrices = stuff.listPrices;
        var listPriceLabels = stuff.listPriceLabels;
        var priceChildren = listPrices.children();
        var priceLabelChildren = listPriceLabels.children();
        $(priceLabelChildren[0]).html(pricesTranslate[0]);

        var p = $(priceChildren[0]);
        var c = p.find(".ui-currency");
        var v;
        if (c.length != 0) {
            v = splitCurrencyPrice(arr[0][1]);
            c.html(v[0]);
            p.find(".ui-price").html(v[1]);
        } else {
            p.html(arr[0][1]);
        }
        listPrices.empty();
        listPriceLabels.empty();
//        listPrices.append(priceChildren[0]);
//        listPriceLabels.append(priceLabelChildren[0]);

        var len = arr.length;
        var i;
        var htmlStr = "";
        var htmlStrP = "";
        for (i = 1; i < len; i++) {
            //ascentis-glaissa:hide Reward Points: apr 3 2013

            if (i != (len - 1)) {
                if (arr[i][1] != '' && arr[i][1] != '0' && arr[i][1] != '$0' && arr[i][1] != 'S$0' && arr[i][1] != 'S$.00') { //added by Chen Chi on Apr 03 2013
                    if (i == 1 && arr[i-1][1] != arr[i][1] && parseFloat(arr[i-1][1].replace('S$', '')) < parseFloat(arr[i][1].replace('S$', '')))
                    {
                        htmlStr += '<li>' + pricesTranslate[i-1] + "</li>";
                        htmlStrP += '<li class=\"promo\">S$' + numberWithCommas(parseFloat(arr[i - 1][1].replace('S$', '')).toFixed(2)) + "</li>";

                        htmlStr += '<li style=\"font-size: 14px; font-weight: bold; text-decoration: line-through;\">' + pricesTranslate[i] + "</li>";
                        htmlStrP += '<li  style=\"font-size: 14px; font-weight: bold; text-decoration: line-through;\">S$' + numberWithCommas(parseFloat(arr[i][1].replace('S$', '')).toFixed(2)) + "</li>";
                        continue;
                    }

                    if (pricesTranslate[i] == 'List Price') {
                        if (stuff.isAlcohol == "True" && displayAlcoholDowntownPrice == 0) {
                            continue;
                        }
                        htmlStr += '<li class="downtown">' + pricesTranslate[i] + ' (<a id="testhr" href="#" title="iShopChangi displays the average price of this product found at key international airports in the Asia-Pacific region (spirits), or the recommended retail prices downtown (other products).">?</a>)<div style="display:none;">iShopChangi displays the average price of this product found at key international airports in the Asia-Pacific region (spirits), or the recommended retail prices downtown (other products).</div>' + '</li>';
                    } else if (pricesTranslate[i] == 'Savings') {
                        htmlStr += '<li class="saving" style="color: rgb(225, 106, 88);">' + pricesTranslate[i] + "</li>";
                    } else if (pricesTranslate[i] == 'Airport Price') {                        
                        htmlStr += '<li class="origi" style="font-size: 14px; font-weight: bold;">' + pricesTranslate[i] + "</li>";
                    } else {
                        htmlStr += '<li>' + pricesTranslate[i] + "</li>";
                    }

                    if (pricesTranslate[i] == 'Savings') {
                        var new_number = 7,
                        savingprice = arr[i][1].replace('S$', '').replace('$', ''),
                        downtownprice = arr[i - 1][1].replace('S$', '').replace('$', ''),
                        airportprice = arr[i - 2][1].replace('S$', '').replace('$', '');
                    
                        if (downtownprice != '' && downtownprice != 0 && downtownprice != '$0') {                            
                            new_number = Math.round((savingprice * 100) / downtownprice).toFixed(2);
                        } else if (airportprice != '' && airportprice != 0 && airportprice != '$0') {
                            new_number = Math.round((savingprice * 100) / (airportprice * 1.07)).toFixed(2);
                        } else {
                            new_number = 7;
                        }

                        new_number = Math.round(new_number).toFixed(0);

                        htmlStrP += '<li><span class="ui-price" style="color:#e16a58;">S$' + numberWithCommas(parseFloat(arr[i][1].replace('S$', '')).toFixed(2)) + ' (' + new_number + '%)' + "</span></li>";
                    } else if (pricesTranslate[i] == 'Airport Price') {                        
                        htmlStrP += '<li class="origi"><span class="ui-price" style="font-size:14px;font-weight:bold;">S$' + numberWithCommas(parseFloat(arr[i][1].replace('S$', '')).toFixed(2)) + "</span></li>";
                    } else {
                        htmlStrP += '<li>S$' + numberWithCommas(parseFloat(arr[i][1].replace('S$', '')).toFixed(2)) + "</li>"; //ascentis-glaissa updated may 01 2013
                    }
                }
            }
        }

        if (htmlStr != '' && htmlStrP != '') { //added by Chen Chi on Apr 03 2013
            listPriceLabels.append($(htmlStr));
            listPrices.append($(htmlStrP));
        }
    }

    function splitCurrencyPrice(str) { // from string, get currency and price accordingly  (currency first, price later)
        var len = str.length;
        var i;
        var isNonNumber = null;
        var nn;
        var t;
        for (i = 0; i < len; i++) {
            t = parseInt(str.charAt(i));
            nn = t != t;
            if (isNonNumber != null && isNonNumber != nn) {
                break;
            }
            isNonNumber = nn;
        }
        return isNonNumber ? [str.slice(0, i), str.slice(i)] : [str.slice(i), str.slice(0, i)];
    }

    function LoginCallbackFunction() {
        var target = $("#nav-right")
        var touchHover = TouchHoverHandler;
        var panel = target.find("div.dropdown");
        touchHover(null, panel);

        panel.find(" input[name='email']").focus();
    }


    // ////////// CTA buttons..
    this.clickAddToCart = clickAddToCart;
    var cartData = {};

    function AddToCartFunction() {
        if (stuff.addToCartBtn.hasClass("disabled")) return false;

        var sci = new ShoppingCartItemParam();
        sci.ProductParam = new ProductParam();

        if ($("#ProductDetails").html() == undefined || quickPanel.data("group") != undefined) {
            //add to cart popup                       
            sci.ProductGroupAutoID = quickPanel.data("group");
            var header = quickPanel.stuff.titleTag.parent().find("h2");
            sci.ProductGroupTitle = ((header != null && header.html() != undefined) ? header.html() + " " : "") + quickPanel.stuff.titleTag.html();
            sci.RetailerAutoID = quickPanel.data("retailer");
            sci.Quantity = quickPanel.find(".quantity").val();
            sci.ProductGroupImage = quickPanel.stuff.imageTag.attr("src").replace('_std.jpg', '_190x190.jpg').replace('_square.jpg', '_190x190.jpg');
            sci.ProductParam.BrandAutoID = quickPanel.data("brandID");
        } else {
            //product detail page
            sci.ProductGroupAutoID = getQueryString("groupID");
            sci.ProductGroupTitle = quickPanel.find("div.name").html();
            sci.RetailerAutoID = getQueryString("retailerID");
            sci.Quantity = quickPanel.find(".quantity").val();
            sci.ProductGroupImage = quickPanel.parent().find("div.grid_8 img").attr("src").replace('_std.jpg', '_190x190.jpg').replace('_square.jpg', '_190x190.jpg');
            sci.ProductParam.BrandAutoID = quickPanel.data("brandID");
        }
        optionsHolder.find("ul.options.radio li.selected").each(function () {
            var Attributes = new AttributeOptionParam();
            Attributes.AttributeAutoID = $(this).parent().parent().data("id");
            Attributes.AttributeOptionAutoID = $(this).data("value");
            sci.ChosenAttributeSet.push(Attributes);
        });
        $CartService.AddToCartHandler(sci);
        return false;
    }

    function clickAddToCart(e) {
        AddToCartFunction();
        return false;
    }

    function CallbackFunction() {
        return false;
    }    

    var wishlistCount;
    //var wishlistAllCount;
    var wishlistName;
    var wishlistImage;
    var wishlistBrandDtlURL;
    var wishlistBrandID;

    function clickWishlist(e) {
        var targ = stuff.wishlistBtn;
        if (targ.hasClass("loading")) {
            return;
        }
        targ.addClass("loading");

        e.preventDefault();

        //  Modify by Sandy------------------------------------------------
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.d == null || data.d == "") {
                    modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                        function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                        LoginCallbackFunction,
                        function () { var groupId = quickPanel.data("group"); AddToWishlistAsGuest(groupId) },
                        function () { },
                        520, 110);
                    stuff.addToCartBtn.removeClass("loading");
                } else {
                    data = $.parseJSON(data.d);
                    if (data.MemberAutoID == "0") {
                        modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                            function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                            LoginCallbackFunction,
                            function () { var groupId = quickPanel.data("group"); AddToWishlistAsGuest(groupId) },
                            function () { },
                            520, 110);
                        stuff.addToCartBtn.removeClass("loading");
                    } else {
                        var member = data.MemberAutoID;
                        wishlistId = quickPanel.data("group");
                        wishlistRetailer = quickPanel.data("retailer");
                        wishlistName = $("#overlay-container").find("div.quicklook div.content h1").first().html();

                        if ($("#overlay-container").find("div.quicklook div.content h2").html() != undefined) {
                            wishlistName = $("#overlay-container").find("div.quicklook div.content h2").first().html() + " " + wishlistName;
                        }

                        wishlistImage = $("#overlay-container").find("div.quicklook div.product-image").find("img").attr("src");
                        wishlistCount = 5;
                        wishlistBrandDtlURL = quickPanel.data("branddetailurl");
                        wishlistBrandID = quickPanel.data("brandID");
                        var sData = {
                            memberID: "" + member + "",
                            productGroupID: "" + wishlistId + "",
                            index: "" + wishlistAllCount + ""
                        };
                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(sData),
                            url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        }).done(addToWishlistDone);
                    }
                }
            }
        });

    }
    function AddToWishlistAsGuest(group) {
        // verify is there guest account in cookies.
        var member = $.cookie("memberID");
        if (member == 0 || member == undefined || member == null || member == "0" || member == "") {
            $.ajax({
                url: wsHubPath + "WSHub/wsMember.asmx/CreateGuestAccount",
                type: "POST",
                data: "",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var _json = $.parseJSON(data.d);
                    member = _json.GuestAutoID;
                    var sData = { memberID: "" + member + "", productGroupID: "" + group + "", index: "" + wishlistAllCount + "" };
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(sData),
                        url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(addToWishlistDone);
                },
                error: function (er) {
                    //alert(er.Message);
                }
            });
        }
        else {
            var sData = { memberID: "" + member + "", productGroupID: "" + group + "", index: "" + wishlistAllCount + "" };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(addToWishlistDone);
        }
    }

    function addToWishlistDone(e) {         
        stuff.wishlistBtn.removeClass("loading");
        var p = $.parseJSON(e.d);

        var member = $.cookie("memberID");

        var data = $.cookie("wishlistData_" + member);
        if (data) {
            data = $.parseJSON(data);
        }
        var count = (data == null || data.count == undefined) ? 0 : data.count;

        if (p == 1 || p == 2) {

            if (p == 1) {
                count += 1;
            } else {
                count = wishlistAllCount;
            }
            var str = "{\"count\":" + count + ",\"items\":[";
            str += "{\"id\":\"" + wishlistId + "\", \"retailID\":\"" + wishlistRetailer + "\", \"name\":\"" + wishlistName + "\",  \"image\":\"" + wishlistImage + "\", \"branddetailurl\":\"" + wishlistBrandDtlURL + "\", \"brandID\":\"" + wishlistBrandID + "\" },";

            if (data && data.items && data.items.length > 0) {
                var len = data.items.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (i > (wishlistAllCount - 2)) {
                            break;
                        }
                        var tData = data.items[i];
                        str += "{\"id\":\"" + tData.id + "\", \"retailID\":\"" + tData.retailID + "\", \"name\":\"" + tData.name + "\",  \"image\":\"" + tData.image + "\", \"branddetailurl\":\"" + tData.branddetailurl + "\", \"brandID\":\"" + wishlistBrandID + "\" },";  
                    }
                }
            }
            str = str.substring(0, str.length - 1);
            str += "]}";

            $.cookie("wishlistData_" + member, str, {
                path: "/"
            });

            data = $.parseJSON(str);
            parseData(data);
        }

        switch (p) {
            case 1:
                modal.showFree("Info", "Item added to wishlist.", CallbackFunction, 400, 100);
                break;
            case 2:
                modal.showFree("Information", "Item added to wishlist. <br />Please note that only most recent " + (wishlistAllCount > 0 ? wishlistAllCount : 20) + " items can  be saved in your wishlist.", CallbackFunction, 500, 130);
                break;
            case 3:
                modal.showFree("Information", "This product already exists on your wishlist.", CallbackFunction, "auto", 100); //ascentis-glaissa:updated apr 24 2013
                break;
            case 4:
                modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () {
                    return false;
                }, "auto", 110); //ascentis-glaissa:updated apr 24 2013
                break;
            default:
                modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () {
                    return false;
                }, "auto", 110); //ascentis-glaissa:updated apr 24 2013
                break;
        }
    }

    function parseData(data) {
        var target = $("#filter div.right div.wishlist-btn");
        mainBt = target.find("div.link a");
        countHolder = mainBt.find("div.count");
        countHolder.html(data.count);
        target.find("div.count").html(data.count); //Added by ChenChi on Jun 05 2013
        var tHolder = target.find("div.items");
        tHolder.html("");
        if (data && data.items && data.items.length > 0) {
            for (var i = 0; i < data.items.length && i < 5; i++) {
                var tData = data.items[i];
                var temp = target.find("div.template ul.item").clone();
                temp.data("id", tData.id);
                temp.data("retailID", tData.retailID);
                temp.data("branddetailurl", tData.branddetailurl);
                temp.data("brandID", tData.brandID);
                temp.find("li.item img").attr("src", tData.image == null ? "" : tData.image.replace('_std.jpg', '_190x190.jpg'));
                temp.find("span.name").html(tData.name);
                tHolder.append(temp);
                temp.click(function () {
                    if ($(this).data("branddetailurl") != 'undefined' && $(this).data("branddetailurl") != null && $(this).data("branddetailurl") != "") {
                        window.location.href = wsHubPath + $(this).data("branddetailurl").replace('~/', '') + "?brandID=" + $(this).data("brandID") + "&groupId=" + $(this).data("id") + "&langType=en-US";
                    } else { window.location.href = wsHubPath + "Product/Product.aspx?groupID=" + $(this).data("id") + "&retailerID=" + $(this).data("retailID"); }
                });

            }
        }
        target.find("div.buttons a.view span.quantity").html(data.count);
        $.setJSONCookie("wishlistData", data, {
            path: "/"
        });
    }

    function setupStockSpinner(optionsHolder) {
        var e = optionsHolder.children("ul.options.input");
        e = e.children("input.stock");

        if (e.length == 0) return null;

        var spinner = e.spinner();
        return spinner;
    }


    var _callbackCart = function () { };

    function setCallbackCart(cb) {
        _callbackCart = cb;
    }
    this.setCallbackCart = setCallbackCart;


    // -- INIT
    if (quickPanel == null) quickPanel = optionsHolder;



    var inputStockLabel = stockLabelPassIn != null ? stockLabelPassIn : optionsHolder.find(".stocklabel");
    if (inputStockLabel == null) inputStockLabel = $("");

    // Setup optional UI stuff
    var stuff = {
        addToCartBtn: (btnHolder ? btnHolder.children(".ui-submit") : $("")),
        wishlistBtn: (btnHolder ? btnHolder.children(".ui-wishlist") : $("")),
        divPrice: (quickPanel.find("div.price")),
        listPrices: (quickPanel.find("ul.ui-prices")),
        listPriceLabels: (quickPanel.find("ul.ui-pricelabels"))
    }


    stuff.stockSpinner = null;
    stuff.stock = 1; // always ensure at least 1 stock by default unless otherwise stated
    if (inputStockLabel.length > 0) {
        stuff.stockSpinner = stockSpinnerPassIn || setupStockSpinner(optionsHolder);

        if (stuff.stockSpinner != null) updateInfoStock(parseInt(inputStockLabel.html()));
    }


    var radioOptions = optionsHolder.children("ul.options.radio");
    radioOptions.add(optionsHolder.children("ul.options.retailers")).find("li").click(optionSelected);
    var radioCount = radioOptions.length;

    stuff.addToCartBtn.unbind('click').click(clickAddToCart);
    stuff.wishlistBtn.click(clickWishlist);
    checkRadioCount();
}
