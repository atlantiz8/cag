function ProductDetails() {
    var target = $("#ProductOptions");

    var service;

    function onAddToCart() {
        //ascentis-glaissa:apr 24 2013
        modal.showFree("Information", "Item(s) added to cart.", CallbackFunction, 400, 100);
    }

    function CallbackFunction() {
        return false;
    }

    function init() {
        var stuff = $overlay.getQuickPanel().stuff; //Merged with Kilo 20130227 version by ChenChi	    
        service = new ProductOptionsService(target, $("#ProductDetails").children(".buttons"), $("#ProductDetails"), null, stuff.stockSpinner); //Merged with Kilo 20130227 version by ChenChi 
        service.setCallbackCart(onAddToCart);

        /* Start product description scripts */
        $("#ProductDetails > div.content").click(onDescriptionClick); /* End product description scripts */
    }
    this.init = init;

    /* Start product description scripts */

    function onDescriptionClick(e) {
        var id = $("#ProductDetails > div.content").index(this);
        var target = $($("#ProductDetails > div.content")[id]);

        if (target.hasClass("expand")) {
            target.removeClass("expand").addClass("mini");
            target.find("> a").removeClass("minimize").addClass("maximize");
            return;
        } else {
            target.removeClass("mini").addClass("expand");
            target.find("> a").removeClass("maximize").addClass("minimize");
            return;
        }
    } /* End product description scripts */
}


var wishlistId;
var wishlistRetailer;
var wishlistName;
var wishlistImage;
var wishlistBrandDtlURL;
var wishlistBrandID;
//var wishlistCount;
//var wishlistAllCount;


function onWishCallDone(e) {    
    var p = $.parseJSON(e.d);
    var member = $.cookie("memberID");
    var data = $.cookie("wishlistData_" + member);
    if (data) {
        data = $.parseJSON(data);
    }

    var count = (data == null || data.count == undefined) ? 0 : data.count;

    if (p == 1 || p == 2) {
        wishlistImage = $("#product-slideshow div.container div.img-container").find("img").first().attr("src");
        wishlistName = $("#ProductDetails div.name").html();
        if (p == 1) {
            count += 1;
        } else {
            count = wishlistAllCount;
        }
        var str = "{\"count\":" + count + ",\"items\":[";
        str += "{\"id\":\"" + wishlistId + "\", \"retailID\":\"" + wishlistRetailer + "\", \"name\":\"" + wishlistName + "\",  \"image\":\"" + wishlistImage + "\", \"brandid\":\"" + wishlistBrandID + "\", \"branddetailurl\":\"" + wishlistBrandDtlURL + "\" },";        

        if (data && data.items && data.items.length > 0) {
            var len = data.items.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    if (i > (wishlistAllCount - 2)) {
                        break;
                    }
                    var tData = data.items[i];
                    str += "{\"id\":\"" + tData.id + "\", \"retailID\":\"" + tData.retailID + "\", \"name\":\"" + tData.name + "\",  \"image\":\"" + tData.image + "\", \"brandid\":\"" + tData.brandAutoID + "\", \"branddetailurl\":\"" + tData.branddetailurl + "\" },";                    
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
            modal.showFree("Information", "Item added to wishlist.", CallbackFunction, 400, 100);
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

function CallbackFunction() {
    return false;
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
        for (var i = 0; i < data.items.length & i < 5; i++) {
            var tData = data.items[i];
            var temp = target.find("div.template ul.item").clone();
            temp.data("id", tData.id);
            temp.data("retailID", tData.retailID);
            temp.data("brandid", tData.brandID);
            temp.data("branddetailurl", tData.branddetailurl);
            temp.find("li.item img").attr("src", tData.image == null ? "" : tData.image.replace('_std.jpg', '_190x190.jpg'));
            temp.find("span.name").html(tData.name);
            tHolder.append(temp);
            temp.click(function () {
                if ($(this).data("branddetailurl") != 'undefined' && $(this).data("branddetailurl") != null && $(this).data("branddetailurl") != "") {
                    window.location.href = $(this).data("branddetailurl") + "?groupId=" + $(this).data("id") + "&langType=en-US&brandID=" + $(this).data("brandid");
                } else { window.location.href = wsHubPath + "Product/Product.aspx?groupID=" + $(this).data("id") + "&retailerID=" + $(this).data("retailID"); }
            });	

        }
    }

    target.find("div.buttons a.view span.quantity").html(data.count);
    $.setJSONCookie("wishlistData", data, {
        path: "/"
    });
}

function ProductSlideshow(slideContainerWidther, slidingContainer, controls) {
    var slideWidth = slideContainerWidther.width();
    controls.click(function () {
        controls.removeClass("active");
        $(this).addClass("active");
        var index = controls.index(this);
        //slidingContainer
        slidingContainer.stop().animate({
            left: -index * slideWidth
        }, 500);
        return false;
    });
}
/**
* Image hover/rollover zoomer
* @param	zoomedImageContainer  (JQuery)	The overflow-hidden container which contains a img for containing the zoomed image.
* @param	images  (Jquery) list of images to roll-over for zooming
* @param	zoomRatio  (Optional) Defaults to 2
* @param	slideContainer  (Optional) (JQuery) For image slideshows only. Pass a slideshow container whose "left" property can unduly influence zoomed image position.
* @param	useTouch  (Optional) (Boolean) Touch device?
*/

function ProductZoomer(zoomedImageContainer, images, zoomRatio, slideContainer, useTouch) {
    var zoomedImage = zoomedImageContainer.find("img");


    if (zoomRatio == undefined) zoomRatio = 2;
    var offsetter = images.parent();
    var img;
    var imgH;
    var imgW;
    var contWidth = zoomedImageContainer.width();
    var contHeight = zoomedImageContainer.height();
    var touchClass;
    if (slideContainer == null) slideContainer = $('<div style="left:0px"></div>');
    zoomedImage.css("position", "relative");
    var _htmlBody = $("html, body");

    // methods


    function myMouseMove(e) {
        var f;
        var x = ((e.pageX - offsetter.offset().left + parseInt(slideContainer.css("left"))) * -zoomRatio + contWidth * .5);
        var y = ((e.pageY - offsetter.offset().top) * -zoomRatio + contHeight * .5);
        if (x < (f = contWidth - imgW * zoomRatio)) x = f; // clamp east
        if (y > 0) y = 0; // clamp north
        if (x > 0) x = 0; // clamp west
        if (y < (f = contHeight - imgH * zoomRatio)) y = f; // clamp south
        zoomedImage.css("left", x + "px").css("top", y + "px");
    }

    function myHoverIn(e) {
        zoomedImageContainer.css("display", "block");
        img = $(e.currentTarget);
        zoomedImage.attr("src", img.attr("src"));
        zoomedImage.width(img.width() * zoomRatio).height(img.height() * zoomRatio);
        imgH = img.height();
        imgW = img.width();



    }

    function myHoverOut(e) {
        zoomedImageContainer.css("display", "none");
    }

    function myTouchHoverOut(e) {
        _htmlBody.unbind("mousedown", myTouchHoverOut);
        myHoverOut(e);
    }

    function myTouch(e) {
        if ($(e.currentTarget).hasClass(touchClass)) {
            e.stopPropagation();
        }
        myHoverIn(e);
        myMouseMove(e);
        _htmlBody.mousedown(myTouchHoverOut);
    }

    // init
    if (!useTouch) {
        images.mousemove(myMouseMove);
        images.hover(myHoverIn, myHoverOut);
    } else {
        images.addClass(touchClass = "touchBlock" + Math.round(Math.random() * 99999));
        images.mousedown(myTouch);
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$(document).ready(function () {
    $productDetails = new ProductDetails();
    //wishlistAllCount = 20;
    var langType = $.trim($.cookie("Language"));
    var groupID = getQueryString('groupID');
    var retailerID = getQueryString('retailerID');
    var brandDtlURL = "";
    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupEntityInfo",
        data: "{'groupID':'" + groupID + "','langType':'" + langType + "','concessionaireAutoID':'" + retailerID + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data) {
        data = $.parseJSON(data.d);

        if (data.status != 4) {
            alert("Failed to load options: Status:" + data.status);
        } else {
            $overlay.customSetup(data.params, $("#ProductOptions"));

            $productDetails.init();

            brandDtlURL = data.params.branddetailurl;

            /*Initiate for Product Detail created by ChenChi on Mar 03 2013 */
            var imagePath = data.params.image;
            imagePath = imagePath.replace("_std.jpg", "_square.jpg").replace("_190x190.jpg", "_square.jpg");
            $("#ProductSlideshowHolder").find(".img-container .image").each(function () {
                $(this).attr("src", imagePath);
            });
            $("#ProductDetails").find("div.name").html(data.params.title);
            $("#ProductDetails").attr("data-department", data.params.department);

            if (data.params.prices.PromoPrice != data.params.prices.OriginalPrice && data.params.prices.PromoPrice != '' && data.params.prices.PromoPrice != '0' && data.params.prices.PromoPrice != "$0") {
                $("#ProductDetails").find(".promo span.ui-price").html('S$' + numberWithCommas(data.params.prices.PromoPrice.replace('$', '')));

                $("#ProductDetails").find(".ui-pricelabels li.promo").show(); //ascentis-glaissa added may 01 2013
                $("#ProductDetails").find(".ui-prices li.promo").show();

                $("#ProductDetails").find(".origi span.ui-price").css({ 'text-decoration': 'line-through' });
                $("#ProductDetails").find(".ui-pricelabels li.origi").css({ 'text-decoration': 'line-through' });
            } else {
                $("#ProductDetails").find(".ui-pricelabels li.promo").hide();
                $("#ProductDetails").find(".ui-prices li.promo").hide();
            }

            $("#ProductDetails").find(".origi span.ui-price").html('S$' + numberWithCommas(data.params.prices.OriginalPrice.replace('$', '')));
            $("#ProductDetails").find(".ui-pricelabels li.origi").show(); //ascentis-glaissa added may 01 2013
            $("#ProductDetails").find(".ui-prices li.origi").show();

            if (data.params.prices.DowntownPrice != '' && data.params.prices.DowntownPrice != '0' && data.params.prices.DowntownPrice != "$0") {
                if (data.params.isAlcohol != 'True' || (displayAlcoholDowntownPrice == '1' && data.params.isAlcohol == 'True')) {
                    $("#ProductDetails").find(".downtown span.ui-price").html('S$' + numberWithCommas(data.params.prices.DowntownPrice.replace('$', '')));
                    // $("#ProductDetails").find(".downtown div").html('description'); //wlh added on Aug 30 2013 : need to change text when CAG confirm now temporialy add descrpition
                    $("#ProductDetails").find(".ui-pricelabels li.downtown").show(); //ascentis-glaissa added may 01 2013
                    $("#ProductDetails").find(".ui-prices li.downtown").show();
                }
            } else {
                // $("#ProductDetails").find(".downtown div").html('description'); //wlh added on Aug 30 2013 : need to change text when CAG confirm now temporialy add descrpition
                $("#ProductDetails").find(".ui-pricelabels li.downtown").hide();
                $("#ProductDetails").find(".ui-prices li.downtown").hide();
            }

            // alert("Has saving1 :" + data.params.prices.Savings);
            if (data.params.prices.Savings != '' && data.params.prices.Savings != '$' && data.params.prices.Savings.indexOf("$-") < 0) {
                //added by wlh on Aug 20 2013 to show price saving percentage
                var savingprice = data.params.prices.Savings.replace('S$', '').replace('$', ''),
                    new_number = 7;

                if (data.params.prices.DowntownPrice != '' && data.params.prices.DowntownPrice != '0' && data.params.prices.DowntownPrice != "$0") {
                    var downtownprice = data.params.prices.DowntownPrice.replace('S$', '').replace('$', '');
                    new_number = Math.round((savingprice * 100) / downtownprice).toFixed(2);
                    new_number = Math.round(new_number).toFixed(0);
                    $("#ProductDetails").find(".saving span.ui-price").html('S$' + numberWithCommas(data.params.prices.Savings.replace('$', '')) + ' (' + new_number + '%)'); 
                } else if (data.params.prices.OriginalPrice != '' && data.params.prices.OriginalPrice != '0' && data.params.prices.OriginalPrice != "$0") {
                    var airportprice = data.params.prices.OriginalPrice.replace('S$', '').replace('$', '');
                    new_number = Math.round((savingprice * 100) / (airportprice * 1.07)).toFixed(2);
                    new_number = Math.round(new_number).toFixed(0);
                    $("#ProductDetails").find(".saving span.ui-price").html('S$' + numberWithCommas(data.params.prices.Savings.replace('$', '')) + ' (' + new_number + '%)');  
                }
                else {//wlh added on Sep 13 2013 to show saving price without downtown price
                    $("#ProductDetails").find(".saving span.ui-price").html('S$' + numberWithCommas(data.params.prices.Savings.replace('$', '')) + '(7%)');
                }
                                
                $("#ProductDetails").find(".ui-pricelabels li.saving").show(); //ascentis-glaissa added may 01 2013
                $("#ProductDetails").find(".ui-prices li.saving").show();
            } else {
                // alert("No saving hide :" + data.params.prices.Savings);
                $("#ProductDetails").find(".ui-pricelabels li.saving").hide();
                $("#ProductDetails").find(".ui-prices li.saving").hide();
            }
            $("div.breadcrumbs").html($("div.breadcrumbs").html().replace("Product", "Product / " + data.params.title)); //Modified by Chen Chi on Mar 19 2013
            //Modified by ChenChi on Apr 08 2013, break line on the content         
            $("span.text.overview").html(data.params.overview.replace(/\n/g, "<br />"));
            if (data.params.detail != '' && data.params.detail != 'NA' && data.params.detail != 'na' && data.params.detail != 'N.A') {
                $("span.text.details").html(data.params.detail.replace(/\n/g, "<br />"));
            } else {
                $("span.text.details").parent().hide();
            }
            $("span.text.policy").html(data.params.policy);
            $("#ProductDetails").attr("data-isLAG", data.params.isLAG);
            $("#ProductDetails").attr("data-isAgeLimit", data.params.isAgeLimit);
            $("#ProductDetails").attr("data-isAlcohol", data.params.isAlcohol);
        }
        LoadRecommended(groupID);
        LoadRecently(groupID);

        $("div.buttons a.button.white.ui-wishlist").unbind('click').click(function () {
            var member = $.cookie("memberID");
            if (0 != member && undefined != member && null != member && "" != member) {
                wishlistId = groupID;
                wishlistRetailer = retailerID;
                wishlistBrandDtlURL = brandDtlURL;

                var sData = {
                    memberID: "" + member + "",
                    productGroupID: "" + groupID + "",
                    index: "" + wishlistAllCount + ""
                };
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(sData),
                    url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(onWishCallDone);
            } else {
                //ascentis-glaissa updated mar 15 2013 as per peter's request
                //modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
                //alert("please login!");
                modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                    function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                    LoginCallbackFunction,
                    function () { AddToWishlistAsGuest(group) },
                    function () { },
                    520, 110);
                return;
            }
        });
    });

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

    //glaissa added may 21 2013


    function LoginCallbackFunction() {
        var target = $("#nav-right")
        var touchHover = TouchHoverHandler;
        var panel = target.find("div.dropdown");
        touchHover(null, panel);

        panel.find(" input[name='email']").focus();
    }

    function initProductInfo(id) {
        var products = new Products();
        products.init(id);
        ChangiProducts = products;
    }

    function LoadRecommended(group) {
        var recommendCount = 10;
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsProduct.asmx/GetRecommendProductGroupListWithJson",
            data: "{'langType':'" + $.cookie("Language") + "','departmentID':'" + $("#ProductDetails").attr("data-department") + "','groupID':'" + group + "','count':'" + recommendCount + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(onRecommended);
    }

    function onRecommended(e) {
        var items = $.parseJSON(e.d);
        var str = "";
        $.each(items, function (i, item) {
            var badge = '';
            if (item.IsNewProduct) badge += 'n ';
            if (item.IsPromotion) badge += 'p ';
            if (item.IsExclusiveProduct) badge += 'ex ';
            badge += (item.IsBestSeller) ? 'b' : (item.IsEditorsPick) ? 'e' : '';

            str += " <li class=\"item product notouch\">";
            str += "        <img class=\"pimg\" src=\"" + item.GroupImage + "\" width=\"180\" height=\"180\" />";
            str += "        <div class=\"panel\">";
            str += "            <div class=\"from nofrom\">";
            str += "                <br/>";

            //ascentis-glaissa updated apr12 2013, fixed price to 2decimal places
            str += "                <span class=\"price\">S$" + numberWithCommas(parseFloat(item.LP_Price).toFixed(2).replace('$', '')) + "</span>";

            str += "            </div>";
            str += "            <div class=\"name\">" + item.ProductGroupTitle + "</div>";
            str += "        </div>";
            str += "        <div class=\"overlay bake\">";
            str += "            <div class=\"dummybg\">";
            str += "<div><span class=\"label\">Save<\/span><span class=\"amount\">S$" + numberWithCommas(parseFloat(item.Saving).toFixed(2).replace('$', '')) + "<\/span><\/div>";
            //(undefined == item.BrandDetailURL || '' == item.BrandDetailURL) ? "" : (str += '<div class="brand"><span class="brandcode">' + item.LP_BrandCode + '</span></div>');
            str += "            </div>";
            str += "            <div class=\"buttons\" data-group=\"" + item.ProductGroupAutoID + "\" data-retailer=\"" + item.LP_ConcessionaireAutoID + "\" data-branddetailurl=\"" + item.BrandDetailURL + "\" data-brandID=\"" + item.LP_BrandAutoID + "\">";
            str += "                <a href=\"#\" class=\"button red primary\">";
            str += "                    <div class=\"text\">";
            str += "                        <img class=\"icon\" src=\"../img/icon/cart.png\">" + language.AddToCart + "</div>";
            str += "                    <div class=\"loader\">";
            str += "                    </div>";
            str += "                </a><a href=\"#\" class=\"button brown primary\">";
            str += "                    <div class=\"text\">";
            str += "                        <img class=\"icon\" src=\"../img/icon/wishlist.png\">" + language.AddToWishlist + "</div>";
            str += "                    <div class=\"loader\">";
            str += "                    </div>";
            str += "                </a>";
            str += "                <ul>";
            str += "                    <li><a href=\"#\" class=\"button black view\">";
            str += "                        <div class=\"text\">";
            str += "                            <img class=\"icon\" src=\"../img/icon/view.png\">" + language.View + "</div>";
            str += "                        <div class=\"loader\">";
            str += "                        </div>";
            str += "                    </a></li>";
            str += "                    <li class=\"divider\"></li>";
            str += "                    <li><a href=\"#\" class=\"button black share\">";
            str += "                        <div class=\"text\">";
            str += "                            <img class=\"icon\" src=\"../img/icon/share.png\">" + language.Share + "</div>";
            str += "                        <div class=\"loader\">";
            str += "                        </div>";
            str += "                    </a></li>";
            str += "                </ul>";
            str += "            </div>";
            str += "        </div>";
            str += "        <div class=\"badge " + badge + "\"></div>";
            str += "    </li>";
        });

        var $boxes = $(str);
        $(".container2 ul.recommended-items").empty().append($boxes); //.masonry('appended', $boxes).masonry('reload');
        $extrasPanel = new ExtrasPanel();
        $extrasPanel.init();

        initProductInfo("container2");
        if (IS_TOUCH) { InitNoTouchCont($('.container2')); }
    }

    function LoadRecently(group) {
        var data = $.getJSONCookie("recentlyProduct");

        var str = "";
        if (data && data.items && data.items.length > 0) {
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                if (group == item.groupID) continue;

                var badge = '';
                if (item.IsNewProduct) badge += 'n ';
                if (item.IsPromotion) badge += 'p ';
                if (item.IsExclusiveProduct) badge += 'ex ';
                badge += (item.IsBestSeller) ? 'b' : (item.IsEditorsPick) ? 'e' : '';

                str += " <li class=\"item product notouch\">";
                str += "        <img class=\"pimg\" src=\"" + item.image + "\" width=\"180\" height=\"180\" />";
                str += "        <div class=\"panel\">";
                str += "            <div class=\"from nofrom\">";
                str += "                <br/>";

                //ascentis-glaissa added apr12 2013, fixed price to 2decimal places
                if (isNaN(item.price)) {
                    str += "                <span class=\"price\">S$" + numberWithCommas(item.price.replace('$', '')) + "</span>";
                } else {
                    str += "                <span class=\"price\">S$" + numberWithCommas(parseFloat(item.price).toFixed(2).replace('$', '')) + "</span>";
                }

                str += "            </div>";
                str += "            <div class=\"name\">" + item.name + "</div>";
                str += "        </div>";
                str += "        <div class=\"overlay bake\">";
                str += "            <div class=\"dummybg\"><div><span class=\"label\">Save<\/span><span class=\"amount\">" + item.saving + "<\/span><\/div>";
                //(undefined == item.branddetailurl || '' == item.branddetailurl) ? "" : (str += '<div class="brand"><span class="brandcode">' + item.brandCode + '</span></div>');
                str += "            </div>";
                str += "            <div class=\"buttons\" data-group=\"" + item.groupID + "\" data-retailer=\"" + item.retailerID + "\" data-branddetailurl=\"" + item.branddetailurl + "\" data-brandID=\"" + item.brandID + "\">";

                if (item.IsSoldOut == "true" || item.IsSoldOut == true) {
                    str += "<a href=\"#\" class=\"button soldout primary\">";
                    str += "<div class=\"text\">" + language.SoldOut + "</div>";
                    str += "</a>";
                } else {
                    str += "                <a href=\"#\" class=\"button red primary\">";
                    str += "                    <div class=\"text\">";
                    str += "                        <img class=\"icon\" src=\"../img/icon/cart.png\">" + language.AddToCart + "</div>";
                    str += "                    <div class=\"loader\">";
                    str += "                    </div>";
                    str += "                </a>";
                }

                str += "                <a href=\"#\" class=\"button brown primary\">";
                str += "                    <div class=\"text\">";
                str += "                        <img class=\"icon\" src=\"../img/icon/wishlist.png\">" + language.AddToWishlist + "</div>";
                str += "                    <div class=\"loader\">";
                str += "                    </div>";
                str += "                </a>";
                str += "                <ul>";
                str += "                    <li><a href=\"#\" class=\"button black view\">";
                str += "                        <div class=\"text\">";
                str += "                            <img class=\"icon\" src=\"../img/icon/view.png\">" + language.View + "</div>";
                str += "                        <div class=\"loader\">";
                str += "                        </div>";
                str += "                    </a></li>";
                str += "                    <li class=\"divider\"></li>";
                str += "                    <li><a href=\"#\" class=\"button black share\">";
                str += "                        <div class=\"text\">";
                str += "                            <img class=\"icon\" src=\"../img/icon/share.png\">" + language.Share + "</div>";
                str += "                        <div class=\"loader\">";
                str += "                        </div>";
                str += "                    </a></li>";
                str += "                </ul>";
                str += "            </div>";
                str += "        </div>";
                str += "        <div class=\"badge " + badge + "\"></div>";
                str += "    </li>";
            }
            str += "<div class=\"clear\"></div>";
        }
        var $boxes = $(str);
        $(".container2 ul.recent-items").empty().append($boxes); //.masonry('appended', $boxes).masonry('reload');
        initProductInfo("container2");

        initProductInfo("container2");
        if (IS_TOUCH) { InitNoTouchCont($('.container2')); }
    }

    new ProductSlideshow($("#product-slideshow"), $("#product-slideshow .img-container"), $("#ProductSlideshowHolder .controls>a"));
    if (IS_TOUCH) {
        $("#hover-to-zoom").html("Touch to zoom");
    }
    new ProductZoomer($("#product-zoomer"), $("#product-slideshow .img-container > img"), 2, $("#product-slideshow .img-container"), IS_TOUCH);


});
