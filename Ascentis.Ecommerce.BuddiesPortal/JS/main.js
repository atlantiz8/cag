// BOILER PLATE,
/* General methods/references (possible to put in root): */

if (this["console"] == undefined) {
    this["console"] = {
        log: function () { }
    }
}

var guestDOB = "", guestDest = "", guestAge = 0;

// TOUCH hover/toggle methods/vars/references
var CUR_HOVER;
var _htmlBody = $("html, body");

function is_touch_device() {
    return !!('ontouchstart' in window);
}
var IS_TOUCH = is_touch_device();
//IS_TOUCH = true;
var TOUCH_EVENT = IS_TOUCH ? "touchstart" : "mousedown"; //merged with Kilo by glaissa, aug 27 2013

function TouchHoverHandler(e, targeter) {
    var tarHover = targeter || $(this);
    if (CUR_HOVER) CUR_HOVER.removeClass("hover");
    //	/* 
    if (e != null && CUR_HOVER && CUR_HOVER[0] === tarHover[0]) {
        if ($(e.target).hasClass("toggle")) {
            CUR_HOVER = null;            
            _htmlBody.unbind("touchstart"); //merged with Kilo by glaissa, jul 31 2013
            return;
        }
    }
    //*/

    CUR_HOVER = tarHover;

    CUR_HOVER.addClass("hover");
    _htmlBody.bind(TOUCH_EVENT, function (e) { _htmlBody.unbind("touchstart"); if (CUR_HOVER == null) return; CUR_HOVER.removeClass("hover"); CUR_HOVER = null; }); //merged with Kilo by glaissa, jul 31 2013
    if (e != null && !$(e.target).hasClass("closing")) e.stopPropagation();

};



function InitNoTouchCont(cont) {
    cont = cont.find(".notouch");
    cont.removeClass("notouch");
    cont.bind(TOUCH_EVENT, TouchHoverHandler); //merged with Kilo by glaissa, aug 27 2013
}

function InitNoTouchQuery(q) {
    q.removeClass("notouch");
    q.bind(TOUCH_EVENT, TouchHoverHandler);  //merged with Kilo by glaissa, aug 27 2013
}


// Useful methods to initialise stuff


function MailingList(frm) {

    if (frm.length == 0) return;

    function validateEmail(email) {

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {

            return false;
        }
        return true;
    }

    frm.submit = doSubmit;

    function onAjaxLoaded(data) {

        data = $.parseJSON(data);
        data = data || {};
        if (data.status != 0) {  // failed
            msg.html('<span class="failed">We failed to submit. Please <a>try again</a> later.<span>')
            msg.find("a").click(function () {
            	idle.css("display", "block");
            	if (agr) agr.css("display", "block");
                msg.css("display", "none");
            });
        }
        else {  // success
            msg.html("Thank you for your subscription.");
        }
    }

    var field = $("#subscribe_field");
    var check = $("#subscribe_check");

    var defaultText = field.data("default");
    var idle = frm.children(".idle");
    var msg = frm.children(".message");
    var agr = frm.children(".agree");


    function doSubmit() {
    	if (check.length) {
    		if (!check[0].checked) {
    			msg.css("display", "block");
    			msg.html("<br>You have to agree to the terms and conditions.");
    			return false;
			}
		}
        var val = field.val();
        if (validateEmail(val)) {
            field.removeClass("error");
            $.ajax({ url: $API.SUBSCRIBE, type: "POST", data: { "service": "subscribe", "email": val}, success:onAjaxLoaded });//.done(onAjaxLoaded);
            idle.css("display", "none");
            if(agr) agr.css("display", "none");
            msg.css("display", "block");
            msg.html("Subscribing...");
            return false;
        }
        else {
            field.addClass("error");
            field.focusin(function () {
                field.removeClass("error");
                field.unbind("focusin");
            });
            return false;
        }
    }

    function handleKeyPress(e) {
        var key = e.keyCode || e.which;

        if (key == 13) {

            doSubmit();
            return false;
        }
        return true;
    }
    field.keypress(handleKeyPress);
    frm.find(".submit").click(doSubmit);
}

//wlh added for OverlayVisit on Sep 26 2013
function MailingListForOverlayVisit(frm) {

    if (frm.length == 0) return;

    function validateEmail(email) {

        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {

            return false;
        }
        return true;
    }
   // alert("test overlay");
    frm.submit = doSubmit;

    function onAjaxLoaded(data) {

        data = $.parseJSON(data);
        data = data || {};
        if (data.status != 0) {  // failed
            msg.html('<span class="failed">We failed to submit. Please <a>try again</a> later.<span>')
            msg.find("a").click(function () {
                idle.css("display", "block");
                if (agr) agr.css("display", "block");
                msg.css("display", "none");
            });
        }
        else {  // success
            msg.html("Thank you for your subscription.");
        }
    }

    var field = $("#subscribe_field1");
    var check = $("#subscribe_check1");

    var defaultText = field.data("default");
    var idle = frm.children(".idle");
    var msg = frm.children(".message");
    var agr = frm.children(".agree");


    function doSubmit() {
        if (check.length) {
            if (!check[0].checked) {
                msg.css("display", "block");
                msg.html("<br>You have to agree to the terms and conditions.");
                return false;
            }
        }
        var val = field.val();
        if (validateEmail(val)) {
            field.removeClass("error");
            $.ajax({ url: $API.SUBSCRIBE, type: "POST", data: { "service": "subscribe", "email": val }, success: onAjaxLoaded }); //.done(onAjaxLoaded);
            idle.css("display", "none");
            if (agr) agr.css("display", "none");
            msg.css("display", "block");
            msg.html("Subscribing...");
            return false;
        }
        else {
            field.addClass("error");
            field.focusin(function () {
                field.removeClass("error");
                field.unbind("focusin");
            });
            return false;
        }
    }

    function handleKeyPress(e) {
        var key = e.keyCode || e.which;

        if (key == 13) {

            doSubmit();
            return false;
        }
        return true;
    }
    field.keypress(handleKeyPress);
    frm.find(".submit").click(doSubmit);
}
//end

function InputKeyBinder(inputField, callback, listenChange) {
    var propertyChangeUnbound = false;


    inputField.bind("propertychange", function (e) {
        if (e.originalEvent.propertyName == "value") {
            callback(e);
        }
    });

    function onChange(e) {

        if (!propertyChangeUnbound) {
            inputField.unbind("propertychange");
            propertyChangeUnbound = true;
        }
        callback(e);
    }
    inputField.bind("input", onChange);

    function destroy() {
        inputField.unbind("propertychange");
        inputField.unbind("input");
        if (listenChange) inputField.unbind("change");
    }
    this.destroy = destroy;

    if (listenChange) inputField.change(onChange);
}


function FormFieldBehaviour(searchBox, defaulterText) {
    if (searchBox.length == 0) return;

    defaulterText = defaulterText || "";
    var defaultText = searchBox.data("default") || defaulterText;
    //set default text on load
    searchBox.val(defaultText);

    //on focus behaviour
    searchBox.focus(function () {
        if ($(this).val() == defaultText) {//clear text field
            $(this).val('');
        }
    });

    //on blur behaviour
    searchBox.blur(function () {
        if ($(this).val() == "") {//restore default text
            $(this).val(defaultText);
        }
    });
}


// -- UI initialization

$(document).ready(function () {  // STARt ready

    //ascentis-glaissa,apr 29 2013
    //nav subnav position fix
    $("div#nav > ul#nav-left.naver > li").mouseenter(function (e) {
        var target = $(this);
        if (!target.has("div.holder div.dropdown")) {
            return;
        }
        var subNav = target.find("div.holder > div.dropdown");
        var myId = target.parent().find("> li").index(this);
        var logoWidth = $(target.parent().find("> li div.logo")).outerWidth(true);
        var myX = logoWidth;
        var subNav = target.find("> div.holder > div.dropdown")
        var subNavWidth = subNav.outerWidth(true);
        subNavWidth = (subNavWidth == null) ? 0 : subNavWidth;
        var winWidth = $(window).width();

        target.parent().find("> li").each(function (index, self) {
            if (index >= myId) {
                return false;
            }
            if (index > 0) {
                var thisItemWidth = $(self).find("> div.holder").outerWidth(true);
                myX += thisItemWidth;
            }
        })

        if (winWidth > myX + subNavWidth) {
            if (target.find("div.holder> span").html() != undefined && target.find("div.holder> span").html().indexOf("IT &amp; ELECTRONICS") == 0 && $(window).width() < 1354) {
               // alert("Good");
                subNav.css({ left: -250 });
            }
            else {
                subNav.css({ left: 10 });
            }
        } else {
            var goW = 0 + (winWidth - (myX + subNavWidth + 250));

            subNav.css({ left: goW });
        }

        e.stopPropagation();

    });


    // TOUCH hover replacement
    if (IS_TOUCH) {
        var ProductTemplate = $("#ProductTemplate");
        var PromoTemplate = $("#PromoTemplate");
        PromoTemplate.detach();
        ProductTemplate.detach();

        var elems = $(".notouch");
        elems.removeClass("notouch");
        elems.bind(TOUCH_EVENT, TouchHoverHandler); //merged with Kilo by glaissa, aug 27 2013

        $(document.body).append(PromoTemplate);
        $(document.body).append(ProductTemplate);
    }
    else InitNoTouchQuery($("#filter-by")); //merged with Kilo by glaissa, aug 27 2013

    // BANNER open reveal: Merged with Kilo 20130227 version by ChenChi

    $("#BannerContent").wrap('<div id="BannerContentWrapper"></div>');
    $("#BannerContentWrapper").css("display", "block").css("overflow", "hidden").width($("#BannerContent").width()).height($("#BannerContent").height());
    $("#BannerContent").css("display", "block").css("top", -$("#BannerContentWrapper").height() + "px");
    $("#BannerToggle").toggle(function () {
        $("#BannerContent").stop().animate({ top: 0 + "px" }, 500);
    }, function () {
        $("#BannerContent").stop().animate({ top: -$("#BannerContentWrapper").height() }, 500);
    });

    //ascentis-glaissa, may 01 2013, redirect Learn More to How to Shop page
    $("#BannerContent div.buttons").click(function () { window.location = "/CAGShopping/HowToShop.aspx"; });

    // FILTER BAR scroll locking
    ///*
    $("#filter").each(function () {
        var me = $(this);
        var topper = me.position().top;
        me.scrollToFixed({ marginTop: 0, limit: -topper });
    });
    //*/

    // build by ascentis--sandy 8/3/2013-----------start
    // bind data to scrollbox-categroes
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    var lang = ($.cookie("Language") == null || $.cookie("Language") == undefined) ? "" : $.cookie("Language").replace(/zh-cn/gi, 'zh-CN').replace(/en-us/gi, 'en-US');
    $.ajax({
        type: "POST",
        url: wsHubPath + "WSHub/wsHub.asmx/GetCategoryByType",
        data: "{'categorytype':'C','lang':'" + lang + "'}",
        dataType: "JSON",
        contentType: "application/json; charset=utf-8",
        success: function (d) {
            var _json = $.parseJSON(d.d);
            //
            if (_json.length > 0) {
                var _con = $("#scrollbox-categories");
                _con.empty();
                var filter = $.parseJSON($.cookie("filterParam"));
                var categories = "";
                if (filter != null) categories = filter.maincat.split('|');
                for (var i = 0; i < _json.length; i++) {
                    if (($.inArray('' + _json[i].AutoID + '', categories) >= 0) && (window.location.href.search("ProductListings.aspx") > -1)) {
                        //$("#scrollbox-categories>input[type=checkbox][value='" + _json[i].AutoID + "']").prop('checked', true);
                        _con.append("<input type=\"checkbox\" name=\"cb_category\" value=\"" + _json[i].AutoID + "\" id=\"cb_category_" + _json[i].AutoID + "\" checked=\"checked\"><label for=\"cb_category_" + _json[i].AutoID + "\">" + _json[i].Name + "</label><br>");
                        OnCategoryChecked();
                    } else {
                        _con.append("<input type=\"checkbox\" name=\"cb_category\" value=\"" + _json[i].AutoID + "\" id=\"cb_category_" + _json[i].AutoID + "\"><label for=\"cb_category_" + _json[i].AutoID + "\">" + _json[i].Name + "</label><br>");
                    }
                }

                $("#scrollbox-categories>input[type=checkbox]").click(function () {
                    OnCategoryChecked();
                });
            }
        }
    });

    function OnCategoryChecked() {
        var selectedCat = "";
        $("#scrollbox-categories>input[type=checkbox]:checked").each(function () {
            selectedCat = selectedCat + $(this).val() + "|";
        });
        selectedCat = selectedCat.replace(/\|$/, "");
        if (selectedCat != "") GetSubCategory(selectedCat);
    }

    function GetSubCategory(parentCategory) {
        var selectedSub = [];

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsHub.asmx/GetSubCategory",
            data: "{'categoryIDs':'" + parentCategory + "','language':'" + $.cookie("Language").replace(/zh-cn/gi, 'zh-CN').replace(/en-us/gi, 'en-US') + "'}",
            dataType: "JSON",
            contentType: "application/json; charset=utf-8",
            success: function (d) {
                var _json = $.parseJSON(d.d);
                if (_json.length > 0) {
                    var _con = $("#scrollbox-subcat");
                    $("#scrollbox-subcat>input[type=checkbox]:checked").each(function () {
                        selectedSub.push($(this).val());
                    });
                    _con.empty();
                    var filter = $.parseJSON($.cookie("filterParam"));
                    var categories = [];
                    if (filter != null) categories = filter.subcat.split('|');
                    for (var i = 0; i < _json.length; i++) {
                        if ((($.inArray('' + _json[i].AutoID + '', categories) >= 0) && (window.location.href.search("ProductListings.aspx") > -1)) || ($.inArray('' + _json[i].AutoID + '', selectedSub) >= 0)) {
                            _con.append("<input type=\"checkbox\" name=\"cb_category\" value=\"" + _json[i].AutoID + "\" id=\"cb_category_" + _json[i].AutoID + "\" parent=\"" + _json[i].ParentAutoID + "\" checked=\"checked\"><label for=\"cb_category_" + _json[i].AutoID + "\">" + _json[i].Name + "</label><br>");
                        } else {
                            _con.append("<input type=\"checkbox\" name=\"cb_category\" value=\"" + _json[i].AutoID + "\" id=\"cb_category_" + _json[i].AutoID + "\" parent=\"" + _json[i].ParentAutoID + "\"><label for=\"cb_category_" + _json[i].AutoID + "\">" + _json[i].Name + "</label><br>");
                        }
                    }

                }
            }
        });
    }

    // IE filter bar select menu fix (or for all non-touch browers)
    var ieVersion = (function () {
        var undef,
                                                                v = 3,
                                                                div = document.createElement('div'),
                                                                all = div.getElementsByTagName('i');

        while (
                                                                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                                                                all[0]
                                                );

        return v > 4 ? v : undef;
    } ());
    // ieVersion
    //!IS_TOUCH
    if (!IS_TOUCH) $("#filter-by .panel-holder .panel .module.sortby select").selectBox({ jParent: "#filter-by .panel-holder .module.sortby", top: 52, left: 0 });


    // Slider price range 
    var SliderPriceMin = 0;
    var SliderPriceMax = 5000; //-----------------AppSetting????-----------------
    var _pricemin = getQueryString("pricemin");   //  from url query parameters
    var _pricemax = getQueryString("pricemax"); ;   //  from url query parameters
    if (_pricemin == null || isNaN(parseInt(_pricemin)))
        _pricemin = 0;
    if (_pricemax == null || isNaN(parseInt(_pricemax)))
        _pricemax = SliderPriceMax;
    if (parseInt(_pricemin) > parseInt(_pricemax))
        _pricemin = _pricemax;
    $("#SliderPriceMin").text("$" + SliderPriceMin);
    $("#SliderPriceMax").text("$" + SliderPriceMax);
    $("#hd_SliderPriceMin").val(_pricemin);
    $("#hd_SliderPriceMax").val(_pricemax);
    $("#SliderPriceRangeAmount").html("$" + _pricemin + " - $" + _pricemax);

    $("#SliderPriceRange").slider({
        range: true,
        min: SliderPriceMin,
        max: SliderPriceMax,
        values: [_pricemin, _pricemax],
        slide: function (event, ui) {
            $("#SliderPriceRangeAmount").html("$" + ui.values[0] + " - $" + ui.values[1]);
            $("#hd_SliderPriceMin").val(ui.values[0]);
            $("#hd_SliderPriceMax").val(ui.values[1]);
        }
    });

    $("#filter").find(".btn-clear").click(function () {
        $(this).parent(".module").find("input[type=checkbox]").each(function () {
            $(this).attr("checked", false);
        });
    });

    var _sort = getQueryString("sort");
    $("#slFilterSort").val(_sort);

    $("#btnClearFilter").click(function () {
        //        $("#scrollbox-brands>input[type=checkbox]:checked").each(function () {
        //            $(this).attr("checked", false);
        //        });
        $("#scrollbox-categories>input[type=checkbox]:checked").each(function () {
            $(this).attr("checked", false);
        });
        $("#scrollbox-subcat>input[type=checkbox]:checked").each(function () {
            $(this).attr("checked", false);
        });

        $("#hd_SliderPriceMin").val("0");
        $("#hd_SliderPriceMax").val(SliderPriceMax);
        $("#SliderPriceRange").slider({ values: [0, SliderPriceMax] });
        $("#SliderPriceRangeAmount").html("$0 - $" + SliderPriceMax);

        $("#slFilterSort").val("");
        $("ul.selectBox-options>li.selectBox-selected").removeClass("selectBox-selected");
        $("span.selectBox-label").html("");
    });

    $("#btnGroupsFilter").click(function () {
        var _categories = "", _subCategories = "", _filterCat = "";
        $("#scrollbox-categories>input[type=checkbox]:checked").each(function () {
            var parent = $(this).val();
            var withSubCat = false;
            var subCat = "";
            _categories = _categories + parent + "|";
            $("#scrollbox-subcat>input[type=checkbox]:checked").each(function () {
                if ($(this).attr("parent") == parent) {
                    withSubCat = true;
                    subCat = subCat + $(this).val() + "|";
                    _subCategories = _subCategories + subCat;
                }
            });
            (withSubCat) ? (_filterCat = _filterCat + subCat) : (_filterCat = _filterCat + parent + "|");
        });

        var _pmin = $("#hd_SliderPriceMin").val();
        var _pmax = $("#hd_SliderPriceMax").val();

        var _filterBy = $("#slFilterSort").val() == null ? "" : $("#slFilterSort").val().length == 1 ? "" : $("#slFilterSort").val();
        var filterParam = { categories: _filterCat, maincat: _categories, subcat: _subCategories, minPrice: _pmin, maxPrice: _pmax, filterBy: _filterBy };
        $.cookie("filterParam", JSON.stringify(filterParam), { path: "/" });

        window.location.href = "/Product/ProductListings.aspx?type=filter";
    });

    // ----------------Ascentis Sandy update filter end------------

    // Search fields and stuffs

    new FormFieldBehaviour($("#searchinput"));
    new FormFieldBehaviour($("#subscribe_field"));
    new MailingList($("#mailing_list_box"));
    //wlh added for OverlayVisit on Sep 26 2013
    new FormFieldBehaviour($("#subscribe_field1"));
    new MailingListForOverlayVisit($("#mailing_list_box1"));
    //end

    var searchInput = $("#searchinput");
    // SEARCH FIELD ENTRIES
    var searchEntries = $("#searchentries");
    searchEntries.click(function (e) {
        //if (e.target.nodeName.toLowerCase() != "a") return;
        e = $(e.target);
        searchInput.val(e.html());
        searchEntries.css("display", "none");
    });
    $("#searchfield").submit(function (e) {//Merged with Kilo 20130227 version by ChenChi
        var val = searchInput.val();
        if (val.length > 0 && val != searchDefaultText) {
            return true;
        }
        else return false;
    });
    function submitForm(searchString) {
        $.cookie("searchString", searchString, { path: "/" });
        window.location.href = wsHubPath + "Product/ProductListings.aspx?type=search";
        return false;
    }

    $("#searchfield").submit(function (e) {
        var val = searchInput.val();
        if (val.length > 0 && val != searchDefaultText) {
            submitForm(val);
            return false;
        }
        else return false;
    });
    var searchURL = $("#searchfield").attr("action");

    var propertyChangeUnbound = false;

    function onSearchLoadDone(data) {
        data = $.parseJSON(data.d);
        data = $.parseJSON(data);

        //console.log(data);
        if (data.status != 0) {
            searchEntries.html('<i>no entries found...</i>');
            return;
        }
        var htmlStr = "";
        var i;
        var arr = data.params.matches;
        var len = arr.length;
        for (i = 0; i < len; i++) {
            //htmlStr += '<a href="' + searchURL + '?key=' + encodeURIComponent(escape(arr[i])) + '">' + arr[i] + '</a>';            
            if (arr[i].groupcode.replace(/ /g, '') != '') {
                htmlStr += "<a href='" + wsHubPath + arr[i].branddetailurl.replace('~/', '') + "?brandID=" + arr[i].brandID + "&groupId=" + arr[i].id + "&langType=en-US'>" + arr[i].desc + "</a>";
            } else {
                htmlStr += "<a href='" + wsHubPath + "Product/Product.aspx?groupID=" + arr[i].id + "&retailerID=" + arr[i].retailer + "' >" + arr[i].desc + "</a>";
            }
        }
        searchEntries.html(htmlStr);
    }

    function detectSearchChange() {
        var val = searchInput.val();
        var count = 100;
        if (val.length > 2 && val != searchDefaultText) {
            searchEntries.html('<i>searching...</i>');
            searchEntries.css("display", "block");
            //$.ajax({ url: $API.SEARCH, data: { "service": "search", "search": val} }).done(onSearchLoadDone);
            var data = { search: val, langType: $.trim($.cookie("Language")), count: 10 };
            $.ajax({
                type: "POST",
                url: wsHubPath + "WSHub/wsProduct.asmx/SearchProductGroupDescription",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(onSearchLoadDone);
        }
        else {
            searchEntries.css("display", "none");
        }
    }

    var searchDefaultText = searchInput.data("default");

    searchInput.bind("propertychange", function (e) {
        if (e.originalEvent.propertyName == "value") {
            detectSearchChange();
        }
    });
    searchInput.focusin(function () {
        var val = searchInput.val();
        if (val.length > 0 && val != searchDefaultText) {
            searchEntries.css("display", "block");
        }

    });
    searchInput.focusout(function (e) {
        var val = searchInput.val();
        try //glaissa added june 04 2013 due to an ie8 error
        {
            if (val.length > 0 && val != searchDefaultText) {
                searchInput.html(val);
            }
        } catch (e) { }

        setTimeout(function () { searchEntries.css("display", "none"); }, 500);
    });
    searchInput.bind("input", function () {
        if (!propertyChangeUnbound) {
            searchInput.unbind("propertychange");
            propertyChangeUnbound = true;
        }
        detectSearchChange();
    });


    // -- Page columns for Dropdown navigation on Main Nav
    function PageColumns(pgColumns) {
        var columnHolder = pgColumns.children(".column-holder");
        var columns = columnHolder.children();


        var pagination = pgColumns.children(".pagination");

        if (columns.length <= 2) {
            pagination.css("display", "none");
            return;
        }
        var btnLeft = pagination.children(".left");
        var btnRight = pagination.children(".right");
        var pgNumbers = pagination.children(".numbers");  // this will be the children of .numbers after init()/
        var curSlideIndex = 0;

        var PAGE_WIDTH = 280;  // 140 * 2,   100 + 20 + 20 = 140; (100 width, 20 margins on both sides)





        function init() {
            var htmlOutput = "";
            var totalPages = Math.ceil(columns.length * .5);
            var i;
            var htmlStr = "";
            for (i = 0; i < totalPages; i++) {
                htmlStr += '<a data-index="' + i + '">' + (i + 1) + '</a>';
            }
            pgNumbers.append(pgNumbers = $(htmlStr));
            $(pgNumbers[0]).addClass("selected");
        }

        function jumpToSlide(val) {
            $(pgNumbers[curSlideIndex]).removeClass("selected");
            curSlideIndex = val;
            $(pgNumbers[curSlideIndex]).addClass("selected");
            columnHolder.stop().animate({ left: -val * PAGE_WIDTH }, 500);
        }

        init();
        pgNumbers.click(function () {
            var me = $(this);
            if (me.hasClass("selected")) return;
            jumpToSlide(parseInt(me.data("index")));
        });

        btnLeft.click(function () {
            var val = curSlideIndex - 1;
            if (val < 0) {
                val = pgNumbers.length - 1;
            }
            jumpToSlide(val);
        });

        btnRight.click(function () {
            var val = curSlideIndex + 1;
            if (val >= pgNumbers.length) {
                val = 0;
            }
            jumpToSlide(val);
        });


    }

    $("#nav-left").find(".holder>.dropdown>.paged-columns").each(function () {
        new PageColumns($(this));
    });


});                                                                                                                                                                                                                        		// eND READY
		
