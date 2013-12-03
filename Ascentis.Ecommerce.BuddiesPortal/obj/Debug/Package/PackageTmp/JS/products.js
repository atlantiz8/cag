function Products() {
    var initList = this.initList = function (list) {
        var btnList = list.find("div.buttons");
        btnList.children(".red").unbind('click').click(onClickAdd); // add or sold out
        btnList.children(".brown:not('.removeWL')").unbind('click').click(onWishClick); // wishlist
        btnList.children(".brown.removeWL").unbind('click').click(onRemoveWishlistClick);
        btnList.children("ul").find(".view").unbind('click').click(onViewClick);
        btnList.children("ul").find(".share").click(onShareClick);  // share // enabled by Ganesh on 12 Aug 2013
    }
    var target = $("#filter div.right div.wishlist-btn");
    this.init = init;
    this.setWidthForPriceAndWidth = setWidthForPriceAndWidth;
    var wishlistCount;
    //var wishlistAllCount; 

    function init(id) {
        wishlistCount = 5;
        //wishlistAllCount = 20;
        mainBt = target.find("div.link a");
        mainBtTxt = mainBt.find("div.text");
        mainBtLoader = mainBt.find("div.loader");
        countHolder = mainBt.find("div.count");
        var id = id == undefined ? "container" : id;
        initList($("#" + id + " .item.product"));

        setWidthForPriceAndWidth(); //Added by ChenChi on May 14 2013
    }

    function update(value) {
        countHolder.html(value);
    }

    // click handlers!!!

    // added by Ganesh on 12-Aug 2013 
    function onShareClick(e) {
        e.preventDefault(e)
        var self = $(this).parent().parent().parent();
        var groupID = self.attr('data-group');
        if (0 == groupID || "0" == groupID) {
            $(this).attr("style", "cursor:text");
            return;
        }
        var retailer = self.attr('data-retailer');
        var branddetailurl = self.attr('data-branddetailurl');
        var brandID = self.attr('data-brandID');

        var item = self.parent();
        var panel = item.siblings(".panel");
        var productName = $.trim(panel.find("div.name").html()).replace(/"/g, "&quot;");
        var retailerName = $.trim(panel.find("div.from div").html()).replace(/"/g, "&quot;");
        var productPrice = $.trim(panel.find("div.from span.price").html());
        var image = item.siblings("img.pimg").attr("src");
        var _location = image.indexOf("_");
        var bigImage = image.substring(0, _location) + "_390x390.jpg";
        //var sData = "{\"items\":[{\"groupID\": \"" + groupID + "\",\"retailerID\": \"" + retailer + "\",\"name\": \"" + productName + "\",\"retailerName\": \"" + retailerName + "\",\"price\": \"" + productPrice + "\",\"image\": \"" + image + "\",\"branddetailurl\": \"" + branddetailurl + "\",\"brandID\":\"" + brandID + "\"}]}";
        //setRecently(sData);
        var groupCode = self.attr('data-groupcode') || self.attr('data-productgroup');
        var getProductGroupData = { productGroupAutoID: groupCode, languageType: "en-US" };
        var getProductData = { groupID: groupID, langType: "en-US", concessionaireAutoID: retailer };

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupEntityInfo",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(getProductData),
            dataType: "json",
            success: function (getProductData) {
                if (getProductData.d != null) {
                    var objResult = $.parseJSON(getProductData.d);
                    var description = productName;
                    if (objResult != null) {
                        var paramsList = objResult.params;
                        description = paramsList.overview;
                    }

                    var myFBAppID = GetFBAppID();
                    var diaWidth = Math.round(screen.width * 3 / 4);
                    var diaHeight = Math.round(screen.height * 4 / 5);
                    var diaLeft = Math.round(screen.width / 2 - diaWidth / 2);
                    var diaTop = Math.round(screen.height / 2 - diaHeight / 3);

                    if (null != groupCode && groupCode != '') {
                        FB.ui(
                            {
                                method: 'feed',
                                display: 'touch',
                                name: productName,
                                caption: 'Overview',
                                description: (description),
                                link: branddetailurl + "?brandID=" + brandID + "&groupId=" + groupID + "&langType=en-US",
                                picture: bigImage,
                                redirect_uri: "http://www.facebook.com/dialog/feed?client_id=" + GetFBAppID() +
                                                "&redirect_uri=" + wsHubPath + "Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer +
                                                "&display=touch"
                            },
                            function (response) {
                                //                               if (response && response.post_id) {
                                //                                    alert('Product was shared successfully on your Wall.');
                                //                                } else {
                                //                                   alert('Product could not be shared on your Wall.');
                                //                                }
                            }
                        );

                        //                        window.open("https://www.facebook.com/dialog/feed?app_id="
                        //                        + myFBAppID
                        //                        + "&link="
                        //                        + encodeURIComponent(branddetailurl + "?brandID=" + brandID + "&groupId=" + groupID + "&langType=en-US")
                        //                        + "&picture="
                        //                        + encodeURIComponent(bigImage)
                        //                        + "&name="
                        //                        + encodeURIComponent(productName)
                        //                        + "&caption="
                        //                        + encodeURIComponent("Overview")
                        //                        + "&description="
                        //                        + encodeURIComponent(description)
                        //                        + "&redirect_uri="
                        //                        + encodeURIComponent(branddetailurl + "?brandID=" + brandID + "&groupId=" + groupID + "&langType=en-US"),
                        //                        "Facebook Share Dialog", "width=" + diaWidth + ",height=" + diaHeight + ",left=" + diaLeft + ",top=" + diaTop);
                    } else {
                        FB.ui(
                            {
                                method: 'feed',
                                display: 'touch',
                                name: productName,
                                caption: 'Overview',
                                description: (description),
                                link: wsHubPath + "Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer,
                                picture: bigImage,
                                redirect_uri: "http://www.facebook.com/dialog/feed?client_id=" + GetFBAppID() +
                                                "&redirect_uri=" + wsHubPath + "Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer +
                                                "&display=touch"
                            },
                            function (response) {
//                                if (response && response.post_id) {
//                                    alert('Product was shared successfully on your Wall.');
//                                } else {
//                                    alert('Product could not be shared on your Wall.');
//                                }
                            }
                        );

                        //                        window.open("https://www.facebook.com/dialog/feed?app_id="
                        //                        + myFBAppID
                        //                        + "&link="
                        //                        + encodeURIComponent(wsHubPath + "Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer)
                        //                        + "&picture="
                        //                        + encodeURIComponent(bigImage)
                        //                        + "&name="
                        //                        + encodeURIComponent(productName)
                        //                        + "&caption="
                        //                        + encodeURIComponent("Overview")
                        //                        + "&description="
                        //                        + encodeURIComponent(description)
                        //                        + "&redirect_uri="
                        //                        + encodeURIComponent(wsHubPath + "Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer),
                        //                        "Facebook Share Dialog", "width=" + diaWidth + ",height=" + diaHeight + ",left=" + diaLeft + ",top=" + diaTop);
                    }
                }
            }
        });
    }


    function setRecently(sData) {
        var jsonData = $.parseJSON(sData);
        if (null == $.cookie("recentlyProduct")) {
            $.setJSONCookie("recentlyProduct", jsonData, {
                path: "/"
            });
        } else {
            var data = $.getJSONCookie("recentlyProduct");
            var str = "";
            var len = data.items.length >= 11 ? 11 : data.items.length;
            str += "{\"items\": [";
            var tmp = jsonData.items[0];
            str += "{\"groupID\": \"" + tmp.groupID + "\",\"retailerID\": \"" + tmp.retailerID + "\",\"name\": \"" + tmp.name + "\",\"retailerName\": \"" + tmp.retailerName + "\",\"saving\":\"" + tmp.saving + "\",\"price\": \"" + tmp.price + "\",\"image\": \"" + tmp.image + "\",\"branddetailurl\":\"" + tmp.branddetailurl + "\",\"brandCode\":\"" + tmp.brandCode + "\",\"brandID\":\"" + tmp.brandID + "\",\"IsSoldOut\":\"" + tmp.IsSoldOut + "\"" +
                    ",\"IsNewProduct\":" + tmp.IsNewProduct + ",\"IsPromotion\":" + tmp.IsPromotion + ",\"IsExclusiveProduct\":" + tmp.IsExclusiveProduct + ",\"IsBestSeller\":" + tmp.IsBestSeller + ",\"IsEditorsPick\":" + tmp.IsEditorsPick + "},";
            if (data && data.items && data.items.length > 0) {
                for (var i = 0; i < len; i++) {
                    var tData = data.items[i];
                    if (tmp.groupID == tData.groupID) continue;
                    str += "{\"groupID\": \"" + tData.groupID + "\",\"retailerID\": \"" + tData.retailerID + "\",\"name\": \"" + tData.name + "\",\"retailerName\": \"" + tData.retailerName + "\",\"saving\":\"" + tData.saving + "\",\"price\": \"" + tData.price + "\",\"image\": \"" + tData.image + "\",\"branddetailurl\":\"" + tData.branddetailurl + "\",\"brandCode\":\"" + tData.brandCode + "\",\"brandID\":\"" + tData.brandID + "\",\"IsSoldOut\":\"" + tData.IsSoldOut + "\"" +
                    ",\"IsNewProduct\":" + tData.IsNewProduct + ",\"IsPromotion\":" + tData.IsPromotion + ",\"IsExclusiveProduct\":" + tData.IsExclusiveProduct + ",\"IsBestSeller\":" + tData.IsBestSeller + ",\"IsEditorsPick\":" + tData.IsEditorsPick + "},";
                }
            }
            str = str.substring(0, str.length - 1);
            str += "]}";
            data = $.parseJSON(str);
            $.setJSONCookie("recentlyProduct", data, {
                path: "/"
            });
        }
    }

    function onViewClick(e) {
        e.preventDefault(e)
        var self = $(this).parent().parent().parent();
        var groupID = self.attr('data-group');
        if (0 == groupID || "0" == groupID) {
            $(this).attr("style", "cursor:text");
            return;
        }
        var retailer = self.attr('data-retailer');
        var branddetailurl = self.attr('data-branddetailurl');
        var brandID = self.attr('data-brandID');
        var brandCode = self.attr('data-brandCode');
        var dataBadge = $(this).parent().parent().parent().parent().parent().find("div.badge");
        var badge = '';
        if (dataBadge.length > 0) {
            badge += "\"IsNewProduct\":" + (dataBadge.hasClass("n") ? true : false) + ",";
            badge += "\"IsPromotion\":" + (dataBadge.hasClass("p") ? true : false) + ",";
            badge += "\"IsExclusiveProduct\":" + (dataBadge.hasClass("ex") ? true : false) + ",";
            badge += "\"IsBestSeller\":" + (dataBadge.hasClass("b") ? true : false) + ",";
            badge += "\"IsEditorsPick\":" + (dataBadge.hasClass("e") ? true : false);
        } else {
            badge += "\"IsNewProduct\":false,";
            badge += "\"IsPromotion\":false,";
            badge += "\"IsExclusiveProduct\":false,";
            badge += "\"IsBestSeller\":false,";
            badge += "\"IsEditorsPick\":false";
        }

        var item = self.parent();
        var panel = item.siblings(".panel");
        var productName = $.trim(panel.find("div.name").html()).replace(/"/g, "&quot;"); //Modified by ChenChi on May 06 2013, to take care of quotation mark
        var retailerName = $.trim(panel.find("div.from div").html()).replace(/"/g, "&quot;");
        var productPrice = $.trim(panel.find("div.from span.price").html());
        var savingAmount = $.trim(item.find("div.dummybg>div>span.amount").html());
        var image = item.siblings("img.pimg").attr("src");
        image = image.substring(0, image.length - 12) + "_190x190.jpg";
        var IsSoldOut = self.find("a").hasClass("soldout");
        var sData = "{\"items\":[{\"groupID\": \"" + groupID + "\",\"retailerID\": \"" + retailer +
        "\",\"name\": \"" + productName + "\",\"retailerName\": \"" + retailerName + "\",\"saving\":\"" + savingAmount +
        "\",\"price\": \"" + productPrice + "\",\"image\": \"" + image +
        "\",\"branddetailurl\": \"" + branddetailurl + "\",\"brandCode\":\"" + brandCode + "\",\"brandID\":\"" + brandID + "\",\"IsSoldOut\":\"" + IsSoldOut + "\"" + 
        (badge != '' ? "," + badge : "" ) + "}]}";
        setRecently(sData);

        //Modified by ChenChi on Jun 28 2013 for Nuance Watson Integration
        var groupCode = self.attr('data-groupcode') || self.attr('data-productgroup');

        if (null != groupCode && groupCode != '') {
            window.location.href = branddetailurl + "?brandID=" + brandID + "&groupId=" + groupID + "&langType=en-US";
        } else {
            window.location.href = "../Product/Product.aspx?groupID=" + groupID + "&retailerID=" + retailer;
        }
    }

    var wishlistId;
    var wishlistName;
    var wishlistImage;
    var wishlistRetailer;
    var wishlistBrandDtlURL;
    var wishlistBrandID;
    var wishlistBrandCode;

    function onWishClick(e) {
        e.preventDefault();
        //  Modify by Sandy 2013.6.5----------------------------------------
        var group = $(this).parent().attr("data-group");
        wishlistId = group;
        wishlistRetailer = $(this).parent().attr("data-retailer");
        wishlistImage = $(this).parent().parent().parent().find("img").attr("src");
        wishlistName = $(this).parent().parent().parent().find("div.panel div.name").html();
        wishlistBrandDtlURL = $(this).parent().attr("data-branddetailurl");
        wishlistBrandID = $(this).parent().attr("data-brandID");
        wishlistBrandCode = $(this).parent().attr("data-brandCode");

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
                        function () { AddToWishlistAsGuest(group) },
                        function () { },
                        520, 110);
                } else {
                    data = $.parseJSON(data.d);
                    if (data.MemberAutoID == "0") {
                        modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                            function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                            LoginCallbackFunction,
                            function () { AddToWishlistAsGuest(group) },
                            function () { },
                            520, 110);
                    } else {
                        var member = data.MemberAutoID;
                        var sData = {
                            memberID: "" + member + "",
                            productGroupID: "" + group + "",
                            index: "" + wishlistAllCount + ""
                        };

                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(sData),
                            url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        }).done(onWishCallDone);
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
                    }).done(onWishCallDone);
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
            }).done(onWishCallDone);
        }
    }

    function LoginCallbackFunction() {
        var target = $("#nav-right")
        var touchHover = TouchHoverHandler;
        var panel = target.find("div.dropdown");
        touchHover(null, panel);

        panel.find(" input[name='email']").focus();
    }

    function onWishCallDone(e) {
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
            str += "{\"id\":\"" + wishlistId + "\", \"retailID\":\"" + wishlistRetailer + "\", \"name\":\"" + wishlistName + "\",  \"image\":\"" + wishlistImage + "\", \"branddetailurl\":\"" + wishlistBrandDtlURL + "\", \"brandCode\":\"" + wishlistBrandCode + "\", \"brandID\":\"" + wishlistBrandID + "\" },";

            if (data && data.items && data.items.length > 0) {
                var len = data.items.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (i > (wishlistAllCount - 2)) {
                            break;
                        }
                        var tData = data.items[i];
                        str += "{\"id\":\"" + tData.id + "\", \"retailID\":\"" + tData.retailID + "\", \"name\":\"" + tData.name + "\",  \"image\":\"" + tData.image + "\", \"branddetailurl\":\"" + tData.branddetailurl + "\", \"brandCode\":\"" + wishlistBrandCode + "\", \"brandID\":\"" + wishlistBrandID + "\" },";
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
                modal.showFree("Information", "This product already exists on your wishlist.", CallbackFunction, 400, 100); //ascentis-glaissa:updated apr 24 2013
                break;
            case 4:
                modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () {
                    return false;
                }, "auto", 110);
                break;
            default:
                modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () {
                    return false;
                }, "auto", 110);
                break;
        }
    }

    function parseData(data) {
        update(data.count);
        var tHolder = target.find("div.items");
        tHolder.html("");
        if (data && data.items && data.items.length > 0) {
            for (var i = 0; i < data.items.length & i < 5; i++) {
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
                    if ($(this).data("branddetailurl") != 'undefined' && $(this).data("branddetailurl") != null && $(this).data("branddetailurl") != 'null' && $(this).data("branddetailurl") != "") {
                        window.location.href = $(this).data("branddetailurl") + "?brandID=" + $(this).data("brandID") + "&groupId=" + $(this).data("id") + "&langType=en-US";
                    } else { window.location.href = wsHubPath + "Product/Product.aspx?groupID=" + $(this).data("id") + "&retailerID=" + $(this).data("retailID"); }
                });
            }
        }
        target.find("div.buttons a.view span.quantity").html(data.count);
        $.setJSONCookie("wishlistData", data, {
            path: "/"
        });
    }

    function onClickAdd(e) {
        e.preventDefault();
        var self = $(this);
        var group = self.parent().attr("data-group");
        var concessionaireID = self.parent().attr("data-retailer");

        var item = self.parent().parent();
        var panel = item.siblings(".panel");
        var productName = $.trim(panel.find("div.name").html()).replace(/"/g, "&quot;"); //Modified by ChenChi on May 06 2013, to take care of quotation mark
        var retailerName = $.trim(panel.find("div.from div").html()).replace(/"/g, "&quot;");
        var productPrice = $.trim(panel.find("div.from span.price").html());
        var productPrice = productPrice.substring(1, productPrice.length - 1);
        var image = item.siblings("img.pimg").attr("src").replace("_590x393.jpg", '_190x190.jpg').replace("_240x240.jpg", '_190x190.jpg');

        var savingAmount = $.trim(item.find("div.dummybg>div>span.amount").html());
        var branddetailurl = self.parent().attr('data-branddetailurl');
        var brandID = self.parent().attr('data-brandID');
        var brandCode = self.parent().attr('data-brandCode');
        var IsSoldOut = self.hasClass("soldout");
        var dataBadge = self.parent().parent().parent().find("div.badge");
        var badge = '';
        if (dataBadge.length > 0) {
            badge += "\"IsNewProduct\":" + (dataBadge.hasClass("n") ? true : false) + ",";
            badge += "\"IsPromotion\":" + (dataBadge.hasClass("p") ? true : false) + ",";
            badge += "\"IsExclusiveProduct\":" + (dataBadge.hasClass("ex") ? true : false) + ",";
            badge += "\"IsBestSeller\":" + (dataBadge.hasClass("b") ? true : false) + ",";
            badge += "\"IsEditorsPick\":" + (dataBadge.hasClass("e") ? true : false);
        } else {
            badge += "\"IsNewProduct\":false,";
            badge += "\"IsPromotion\":false,";
            badge += "\"IsExclusiveProduct\":false,";
            badge += "\"IsBestSeller\":false,";
            badge += "\"IsEditorsPick\":false";
        }

        var sData = {
            groupID: "" + group + "",
            concessionaireAutoID: "" + concessionaireID + ""
        };
        var jsonData = "{\"items\":[{\"groupID\": \"" + group + "\",\"retailerID\": \"" + concessionaireID + "\",\"name\": \"" + productName +
            "\",\"retailerName\": \"" + retailerName + "\",\"saving\":\"" + savingAmount + "\",\"price\": \"" + productPrice + "\",\"image\": \"" + image +
            "\",\"branddetailurl\": \"" + branddetailurl + "\",\"brandCode\":\"" + brandCode + "\",\"brandID\":\"" + brandID +
            "\",\"IsSoldOut\":\"" + IsSoldOut + "\"" + (badge != '' ? "," + badge : "") + "}]}";

        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json"

        }).done(onAddCallDone);
        setRecently(jsonData);
    }

    function onAddCallDone(e) {
        var p = $.parseJSON(e.d);
        switch (p.status) {
            case 0:
                cartPanel.addCount();
                break;
            case 1:
                break;
            case 4:
                $overlay.showOptionsPanel(p.params);
                break;
            case 5:
                $overlay.showFlightPanel();
                break;
        }
    }

    function showFlightPanel() {
    }

    function CallbackFunction() {
        return false;
    }

    function setWidthForPriceAndWidth() {
        $(".panel .from .price").each(function () {
            var panelWidth = $(this).parent().parent().width(),
                priceWidth = $(this).width(),
                nameWidth = panelWidth - priceWidth - 9;

            if (nameWidth > 0) {
                $(this).parent().parent().find('.name').first().width(nameWidth);
            }
        });
    }

    function onRemoveWishlistClick(e) {
        var groupID = $(this).parent().attr("data-group");
        var sData = { groupID: groupID };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsMember.asmx/RemoveWishlist",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data != null && data.d == "True") {
                    var member = $.cookie("memberID");
                    var obj = $.cookie("wishlistData_" + member);
                    if (obj != null) {
                        obj = $.parseJSON(obj);
                        obj.count = obj.count - 1;
                        obj.items = $.grep(obj.items, function (item, index) { return item.id != groupID; });
                        $.cookie("wishlistData_" + member, JSON.stringify(obj), { path: "/" });
                        parseData(obj);
                        //refresh product listing display
                        try { QueryProductGroupByMemberID(true); }
                        catch (ex) { }
                        return false;
                    }
                }
            }
        });
        return false;
    }
}

var ChangiProducts;
$(document).ready(function () {
    var products = new Products();
    products.init();
    ChangiProducts = products;
});