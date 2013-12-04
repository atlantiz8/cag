function initFunction(n) {
    if (!sbc) var sbc = "<a href='http://portal.ecomm.ascentis.com.sg/Default.aspx' style='color:#e16a58;'>Home</a>/Chocolates & Delicatessen";
    if (type != "wishlist" && type != "search" && type != "bestSellers" && type != "category" && type != "brand" && type != "promotions" && type != "filter") {
        $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>");
    }
    type == "wishlist" ? ($("div.category h1").html("Wishlist"), $("div.breadcrumbs").html("Home  /  Wishlist")) : type == "search" ? ($("div.category h1").html("Search: " + key), $("div.breadcrumbs").html("Home  /  Product Listing")) : ($("div.category h1").html("Product Listing"), (type == "filter" ? $("div.breadcrumbs").html("Home  /  Product Listing") : $("div.breadcrumbs").html(sbc))), "category" == type || "bestSellers" == type ? QueryProductGroupByCategory(n) : "brand" == type ? QueryProductGroupByBrand() : "search" == type ? QueryProductGroupBySearchString(n) : "promotions" == type ? (   QueryPromotionProductGroup()) : "wishlist" == type ? QueryProductGroupByMemberID(false) : "filter" == type && QueryProductGroupByFilter(n)

    $("#sorting").change(function () {
        sortBy = $(this).val();
        $(".searchresults").html("<span>Loading....<\/span>");
        ("category" == type || "bestSellers" == type) ? QueryProductGroupByCategory(n) : "brand" == type ? QueryProductGroupByBrand() : "search" == type ? QueryProductGroupBySearchString() : "promotions" == type ? (   QueryPromotionProductGroup()) : "wishlist" == type ? QueryProductGroupByMemberID(false) : "filter" == type && QueryProductGroupByFilter(n);
    });
}

function init() {
    type = getQueryString("type"), key = $.cookie("searchString"), bc = getQueryString("bc"), langType = $.trim($.cookie("Language")), categoryBestPageSize = 2, bestPageSize = 2, pageIndex = 1, sortBy = "", null == $.cookie("pageSize") && $.cookie("pageSize", "30", {
        path: "/"
    }), $("ul.pagination").hide();

    if (type != null) {
        $(".searchresults").html("<span>Loading....<\/span>");
    }
    else {
        $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>");
    }


    if (wishlistAllCount > 0) {
        wishlistCount = wishlistAllCount;
    } else {
        wishlistCount = 20;
    }

    if ("wishlist" == type) {
        $("#sorting").css({ display: "none" });
        $("ul.pagination li").first().css({ display: "none" })
    } else {
        $("#sorting").empty();
        if ("search" == type) $("#sorting").append("<option value='relevance'>Relevance</option>");
        $("#sorting").append("<option value='priceAsc'>Price (Low-High)</option>");
        $("#sorting").append("<option value='priceDesc'>Price (High-Low)</option>");
        $("#sorting").append("<option value='alphabetical'>Alphabetical</option>");
    }
    if (null != $("#sorting") || undefined != $("#sorting")) sortBy = $("#sorting").val();
}

function getQueryString(n) {
    var i = new RegExp("(^|&)" + n + "=([^&]*)(&|$)", "i"),
        t = window.location.search.substr(1).match(i);
    return t != null ? unescape(t[2]) : null
}

function QueryProductGroupByFilter(n) {
    var t = "", i = "", r = "", u = "", f = "";

    var filter = $.parseJSON($.cookie("filterParam"));
    if (filter != null) {
        t = filter.categories;
        i = filter.maxPrice;
        r = filter.minPrice;
        u = filter.filterBy;
        f = {
            categories: "" + t + "",
            minPrice: "" + r + "",
            maxPrice: "" + i + "",
            filterBy: "" + u + "",
            filterPageSize: "" + $.cookie("pageSize") + "",
            currentPageindex: "" + pageIndex + "",
            langType: "" + langType + "",
            sortBy: "" + sortBy + ""
        };

        $("#hd_SliderPriceMin").val(r);
        $("#hd_SliderPriceMax").val(i);
        $("#SliderPriceRange").slider({ values: [r, i] });
        $("#SliderPriceRangeAmount").html("$" + r + " - $" + i);
        $("#slFilterSort").val(u);
        $("ul.selectBox-options>li a[rel='" + u + "']").parent().addClass("selectBox-selected");
        $("span.selectBox-label").html($("ul.selectBox-options>li a[rel='" + u + "']").text());
    }

    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupByFilter",
        data: JSON.stringify(f),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (t) {
            GetProductGroupSuccess(t, n)
        },
        error: function () {
            $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
        }
    }).done(initProductInfo)
}

function QueryProductGroupByCategory(n) {
    var t, i, r;
    (typeof n == "undefined" || n == "") && (n = ""), t = "false", "bestSellers" == type && (t = "true"), i = getQueryString("categoryID"), r = getQueryString("level"), $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupByCategory",
        data: "{'categoryID':'" + i + "','level':'" + r + "','pageSize':'" + $.cookie("pageSize") + "','bestPageSize':'" + categoryBestPageSize + "','currentPageindex':'" + pageIndex + "','langType':'" + langType + "','isBest':'" + t + "', 'sortBy':'" + sortBy + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (t) {
            GetProductGroupSuccess(t, n)
        },
        error: function () {
            $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
        }
    }).done(initProductInfo)
}

function initProductInfo() {
    var n = new Products;
    n.init(), ChangiProducts = n, $(currentPageSizeHolder).parent().find("div.ploader").css("visibility", "hidden"), IS_TOUCH && InitNoTouchCont($(".container"))
}

function QueryPromotionProductGroup() {
    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsProduct.asmx/GetPromotionProductGroup",
        data: "{'currentPageIndex':'" + pageIndex + "','pageSize':'" + $.cookie("pageSize") + "', 'sortBy':'" + sortBy + "','langType':'" + langType + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (n) {
            GetProductGroupSuccess(n)
        },
        error: function () {
            $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
        }
    }).done(initProductInfo)
}

function QueryProductGroupByBrand() {
    var n = getQueryString("brandID"),
        t = getQueryString("categoryID");
    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupPageByBrand",
        data: "{'brandID':'" + n + "','categoryID':'" + t + "','currentPageIndex':'" + pageIndex + "','bestPageSize':'" + bestPageSize + "','pageSize':'" + $.cookie("pageSize") + "','langType':'" + langType + "','sortBy':'" + sortBy + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (n) {
            GetProductGroupSuccess(n)
        },
        error: function () {
            $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
        }
    }).done(initProductInfo)
}

function QueryProductGroupBySearchString(j) {
    var i = $(".searchresults"),
        n, r;
    (typeof j == "undefined" || j == "") && (j = "");
    var s = {
        searchString: key,
        langType: langType,
        currentPageIndex: pageIndex,
        pageSize: $.cookie("pageSize"),
        sortBy: sortBy
    };
    if (key != "") {
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupBySearchString",
            data: JSON.stringify(s),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (n) {
                i.empty(), GetProductGroupSuccess(n, j);
                if (n.d == undefined || n.d == "[]") {
                    (n = "", n += '<span>Sorry but<\/span>&nbsp;<span class="bold">' + key + "<\/span>", n += '&nbsp;returns&nbsp;<span class="bold">0<\/span>&nbsp;<span>results.<\/span>', r = $(n), i.empty().append(r))
                }
            },
            error: function () {
                $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
            }
        }).done(initProductInfo)
    }
}

function QueryProductGroupByMemberID(reloadfromCache) {
    //  Modify by Sandy 2013.6.5------------------------------------------------
    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetCurrentMemberDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d == null || data.d == "") {
                panel.find("div.buttons a.view").click(function () {
                    modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
                });
            } else {
                data = $.parseJSON(data.d);
                if (data.MemberAutoID == "0") {
                    panel.find("div.buttons a.view").click(function () {
                        modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
                    });
                } else {
                    var member = data.MemberAutoID;
                    var t = $(".searchresults");
                    $.ajax({
                        type: "POST",
                        url: wsHubPath + "WSHub/wsProduct.asmx/GetProductGroupByMemberIDWithJson",
                        data: "{'memberID':'" + member + "','langType':'" + langType + "','psize':'" + $.cookie("pageSize") + "','pindex':'" + pageIndex + "', 'reload':'" + reloadfromCache + "','sortBy':'" + sortBy + "'}",
                        contentType: "application/json; charset=utf-8",
                        success: function (n) {
                            t.empty(), GetProductGroupSuccess(n)
                        },
                        error: function () {
                            $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
                        }
                    }).done(initProductInfo)
                }
            }
        }
    });
}

function IndexPageClick() {
    $("#pagination").find("ul>li>a").each(function () {
        $(this).attr("data-index") && ($(this).removeClass("ploader"), $(this).click(function () {
            if ($(this).hasClass("ploader")) return !1;
            pageIndex = $(this).attr("data-index"), initFunction("#pagination"), $(this).parent().siblings().find("a.active").removeClass("active"), $(this).addClass("active").addClass("ploader")
        }))
    })
}

function InitItemPageSize() {
    $("ul.pagination").show(), $("ul.pagination").find("li>a").each(function () {
        $(this).attr("data-index") == $.cookie("pageSize") ? $(this).addClass("active") : $(this).removeClass("active"), $(this).removeClass("ploader"), $(this).click(function () {
            pageIndex = 1, $(this).parent().siblings().find("a").removeClass("active"), $(this).addClass("ploader"), $.cookie("pageSize", $(this).attr("data-index"), {
                path: "/"
            }), currentPageSizeHolder = $(this), initFunction()
        })
    })
}

function InitPage(n) {
    var t = allCount % n == 0 ? allCount / n : allCount / n + 1;
    return parseInt(t)
}
var allCount, langType, categoryBestPageSize, pageIndex, bestPageSize, type, wishlistCount, currentPageSizeHolder, key, bc, sortBy, GetProductGroupSuccess, GetProductGroupSuccess2;
$(document).ready(function () {
    init(), initFunction()
}), GetProductGroupSuccess = function (n, t) {
    var u = $.parseJSON(n.d),
        e, o, i, s, r, f, mm;
    try {
        if (undefined != u && null != u && u.length != 0) {
            $(".searchresults").empty();
            if (undefined != u.Count && undefined != u.Items) {
                mm = true;
                allCount = (type == "wishlist" ? u.Items.length : u.Count);
            } else {
                mm = false;
                allCount = u[0].AllCount;
            }
        } else { allCount = 0; }

        if (allCount == undefined || allCount == 0) {
            allCount = 0, e = $(".searchresults"), i = "", i += '<span>Sorry but<\/span>&nbsp;<span class="bold"><\/span>', i += '&nbsp;returns&nbsp;<span class="bold">0<\/span>&nbsp;<span>results.<\/span>', o = $(i), e.empty().append(o), $("#pagination").hide(), $(".container").empty().css({ height: "0px" });
            return
        }

        //Modified by ChenChi on Jun 28 2013 for Nuance Watson integration
        //Modified by win lai for adding  link in view button if user click open with new tab 
        if (i = "", i += '<div class="clear"><\/div>', mm ?
            $.each(u.Items, function (n, t) {
                var badge = '';
                if (t.IsNewProduct) badge += 'n ';
                if (t.IsPromotion) badge += 'p ';
                if (t.IsExclusiveProduct) badge += 'ex ';                
                badge += (t.IsBestSeller) ? 'b' : (t.IsEditorsPick) ? 'e' : '';

                i += '<div class="item product notouch">',
                i += '<img class="pimg" src="' + t.GroupImage.replace("_std.jpg", "_240x240.jpg").replace("_190x190.jpg", "_240x240.jpg") + '" width="240" height="240"  />',
                i += '<div class="panel">',
                null == t.LP_ProductAutoID || 0 == t.LP_ProductAutoID ? (
                    i += '<div class="from nofrom"><br />',
                    i += '<span class="price"><\/span><\/div>',
                    i += '<div class="name">' + t.ProductGroupTitle + "<\/div>",
                    i += "<\/div>",
                    i += '<div class="overlay bake">',
                    i += '<div class="dummybg"><\/div>',
                    i += '<div class="buttons" data-retailer="0" data-group="0">',
                    i += '<a href="#" class="button soldout primary">',
                    i += '<div class="text">' + language.NotAvailable + "<\/div>",
                    i += '<div class="loader"><\/div>',
                    i += "<\/a>") : (
                    i += '<div class="from nofrom"><br/>',
                    i += '<span class="price">S$' + numberWithCommas((Math.round(parseFloat(t.LP_Price) * 100) * 0.01).toFixed(2).replace('S$', '')) + "<\/span><\/div>", //wlh edit for number format on Aug 21 2013
                    i += '<div class="name">' + t.ProductGroupTitle + "<\/div>",
                    i += "<\/div>",
                    i += '<div class="overlay bake">',
                    i += '<div class="dummybg">',
                    i += '<div><span class="label">Save</span><span class="amount">S$' + numberWithCommas((0.01 * parseInt(parseFloat(t.Saving) * 100)).toFixed(2).replace('S$', '')) + '</span></div>', //wlh edit for number format on Aug 21 2013
                    //Added by ChenChi for displaying BrandCode for micro-site products on Aug 21 2013
                    //(null == t.GroupCode || '' == t.GroupCode) ? '' : (i += '<div class="brand"><span class="brandcode">' + t.LP_BrandCode + '</span></div>'),
                    i += '<\/div>',
                    i += '<div class="buttons" data-retailer="' + t.LP_ConcessionaireAutoID +
                            '" data-group="' + t.ProductGroupAutoID +
                            '" data-productgroup="' + ((null == t.GroupCode || '' == t.GroupCode) ? '' : t.GroupCode) +
                            '" data-brandCode="' + ((null == t.LP_BrandCode || '' == t.LP_BrandCode) ? '' : t.LP_BrandCode) +
                            '" data-brandID="' + ((null == t.LP_BrandAutoID || 0 == t.LP_BrandAutoID) ? 0 : t.LP_BrandAutoID) +
                            '" data-branddetailurl="' + ((null == t.BrandDetailURL || '' == t.BrandDetailURL) ? '' : wsHubPath + t.BrandDetailURL.replace('~/', '')) + '">',
                    t.IsSoldOut ? (i += '<a href="#" class="button soldout primary">', i += '<div class="text">' + language.SoldOut + "<\/div>") : (i += '<a href="#" class="button red primary">',
                    i += '<div class="text"><img class="icon" src="../../img/icon/cart.png">' + language.AddToCart + "<\/div>"),
                    i += '<div class="loader"><\/div>',
                    i += "<\/a>",
                    i += '<a href="#" class="button brown primary ' + (type == "wishlist" ? "removeWL" : "") + '">',
                    i += '<div class="text"><img class="icon" src="../../img/icon/wishlist.png">' + (type == "wishlist" ? language.RemoveFromWishlist : language.AddToWishlist) + "<\/div>",
                    i += '<div class="loader"><\/div>',
                    i += "<\/a>",
                    i += "<ul>",
                    i += "<li>",
                    i += '<a href="Product.aspx?groupID=' + t.ProductGroupAutoID + "&retailerID=" + t.LP_ConcessionaireAutoID + '" class="button black view" data-id="' + t.ProductGroupAutoID + '">',
                    i += '<div class="text"><img class="icon" src="../../img/icon/view.png">' + language.View + "<\/div>",
                    i += '<div class="loader"><\/div>', i += "<\/a>", i += "<\/li>", i += '<li class="divider"><\/li>',
                    i += "<li>", i += "<a href=\"#\" class=\"button black share\">",
                    i += "<div class=\"text\"><img class=\"icon\" src=\"../../img/icon/share.png\">" + language.Share + "</div>",
                    i += "<div class=\"loader\"></div>", i += "</a>", i += "</li>", i += "<\/ul>"),
                    i += "<\/div>", i += "<\/div>",
                    //t.IsBestSeller ? i += '<div class="badge bestseller"><\/div>' : t.IsEditorsPick && (i += '<div class="badge editorpick"><\/div>'), i += "<\/div>"
                    i += '<div class="badge ' + badge + '"><\/div>', i += "<\/div>"
            })
            : $.each(u, function (n, t) {
                var badge = '';
                if (t.IsNewProduct) badge += 'n ';
                if (t.IsPromotion) badge += 'p ';
                if (t.IsExclusiveProduct) badge += 'ex ';
                badge += (t.IsBestSeller) ? 'b' : (t.IsEditorsPick) ? 'e' : '';

                i += '<div class="item product notouch">',
                i += '<img class="pimg" src="' + t.Image.replace("_std.jpg", "_240x240.jpg").replace("_190x190.jpg", "_240x240.jpg") + '" width="240" height="240"  />',
                i += '<div class="panel">',
                null == t.Product ? (
                                        i += '<div class="from nofrom"><br />',
                                        i += '<span class="price"><\/span><\/div>',
                                        i += '<div class="name">' + t.Title + "<\/div>",
                                        i += "<\/div>",
                                        i += '<div class="overlay bake">',
                                        i += '<div class="dummybg"><\/div>',
                                        i += '<div class="buttons" data-retailer="0" data-group="0">',
                                        i += '<a href="#" class="button soldout primary">',
                                        i += '<div class="text">' + language.NotAvailable + "<\/div>",
                                        i += '<div class="loader"><\/div>',
                                        i += "<\/a>"
                                    ) : (
                                        i += '<div class="from nofrom"><br/>',
                                        i += '<span class="price">S$' + numberWithCommas(parseFloat(t.Product.LowestPrice).toFixed(2).replace('S$', '')) + "<\/span><\/div>",
                                        i += '<div class="name">' + t.Title + "<\/div>",
                                        i += "<\/div>",
                                        i += '<div class="overlay bake">',
                                        i += '<div class="dummybg">',
                                        i += '  <div><span class="label">Save</span><span class="amount">S$' + numberWithCommas(parseFloat(t.Product.Savings).toFixed(2).replace('S$', '')) + '</span></div>',
                                        (null == t.GroupCode || '' == t.GroupCode) ? '' : (i += '<div class="brand"><span class="brandcode">' + t.Product.BrandCode + '</span></div>'),

                                        i += '<\/div>',
                                        i += '<div class="buttons" data-retailer="' + t.Product.ConcessionaireAutoID + '" data-group="' + t.AutoID +
                                            '" data-productgroup="' + ((null == t.GroupCode || '' == t.GroupCode) ? '' : t.GroupCode) +
                                            '" data-brandID="' + ((null == t.Product.BrandAutoID || 0 == t.Product.BrandAutoID) ? 0 : t.Product.BrandAutoID) +
                                            '" data-brandCode="' + ((null == t.Product.BrandCode || '' == t.Product.BrandCode) ? '' : t.Product.BrandCode) +
                                            '" data-branddetailurl="' + ((null == t.BrandDetailsUrl || '' == t.BrandDetailsUrl) ? '' : wsHubPath + t.BrandDetailsUrl.replace('~/', '')) + '">',
                                        t.IsSoldOut ? (
                                                            i += '<a href="#" class="button red primary">',
                                                            i += '<div class="text"><img class="icon" src="../../img/icon/cart.png">' + language.AddToCart + "<\/div>"
                                                        ) : (
                                                            i += '<a href="#" class="button soldout primary">',
                                                            i += '<div class="text">' + language.SoldOut + "<\/div>"
                                                        ),
                                        i += '<div class="loader"><\/div>',
                                        i += "<\/a>",
                                        i += '<a href="#" class="button brown primary ' + (type == "wishlist" ? "removeWL" : "") + '">',
                                        i += '<div class="text"><img class="icon" src="../../img/icon/wishlist.png">' + (type == "wishlist" ? language.RemoveFromWishlist : language.AddToWishlist) + "<\/div>",
                                        i += '<div class="loader"><\/div>',
                                        i += "<\/a>",
                                        i += "<ul>",
                                        i += "<li>",
                                        i += '<a href="Product.aspx?groupID=' + t.AutoID + "&retailerID=" + t.Product.ConcessionaireAutoID + '" class="button black view" data-id="' + t.AutoID + '">',
                                        i += '<div class="text"><img class="icon" src="../../img/icon/view.png">' + language.View + "<\/div>",
                                        i += '<div class="loader"><\/div>',
                                        i += "<\/a>",
                                        i += "<\/li>",
                                        i += '<li class="divider"><\/li>',
                                        i += "<li>",
                                        i += "<a href=\"#\" class=\"button black share\">",
                                        i += "<div class=\"text\"><img class=\"icon\" src=\"../../img/icon/share.png\">" + language.Share + "</div>",
                                        i += "<div class=\"loader\"></div>",
                                        i += "</a>",
                                        i += "</li>",
                                        i += "<\/ul>"),
                i += "<\/div>",
                i += "<\/div>",
                //t.IsBestSeller ? i += '<div class="badge bestseller"><\/div>' : t.IsEditorsPick && (i += '<div class="badge editorpick"><\/div>'),
                //i += "<\/div>"
                i += '<div class="badge ' + badge + '"><\/div>', i += "<\/div>"
            }), f = $(i), $(".container").empty().append(f).masonry("appended", f).masonry("reload"), t == "" || t == undefined) {
            for (s = InitPage($.cookie("pageSize")), i = "", i += '<div class="holder">', i += '            \t<div class="arrows">', i += '                \t<a href="#"><div class="prev"><\/div><\/a>', i += '                 <a href="#" class="right"><div class="next"><\/div><\/a>', i += "             <\/div>", i += '             <div class="holder">', i += '                \t<ul class="panel">', i += pageIndex == 1 ? '<li><a href="javascript:;" data-index="1" class="active">1<\/a><\/li>' : '<li><a href="javascript:;" data-index="1">1<\/a><\/li>', r = 1; r < s; r++) i += pageIndex == r + 1 ? '<li><a href="javascript:;" class="active">' + (r + 1) + "<\/a><\/li>" : '<li><a href="javascript:;"  data-index="' + (r + 1) + '" >' + (r + 1) + "<\/a><\/li>";
            i += "                \t<\/ul>", i += "              <\/div>", i += '<div class="clear"><\/div>', i += "<\/div>", f = $(i), $("#pagination").empty().append(f), $initiateBottomPagination = new initiateBottomPagination, $initiateBottomPagination.updateArrowVis()
        }

        InitItemPageSize(), IndexPageClick(), ChangiProducts.setWidthForPriceAndWidth()
    } catch (h) {
        alert(h), $(".searchresults").empty().html("<span>Sorry, an error has occurred. Please try again later. Should this problem persists, please contact us at enquiry@changiairport.com.<\/span>")
    }
};