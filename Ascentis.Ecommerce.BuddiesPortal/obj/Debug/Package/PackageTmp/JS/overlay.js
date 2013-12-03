function Overlay() {
    this.init = init;
    this.showFlightPanel = showFlightPanel;
    this.showOptionsPanel = showOptionsPanel;
    this.showMapPanel = showMapPanel; //Merged with Kilo 20130501 by glaissa

    var holder;
    var flightPanel;
    var quickPanel;

    var mapPanel; //Merged with Kilo 20130501 by glaissa

    var editFlight;
    var confirmFlight = false;
    var checkOut;
    var reloadPage;
    function getQuickPanel() {//Merged with Kilo 20130227 version by ChenChi
        return quickPanel;
    }
    this.getQuickPanel = getQuickPanel;

    //Merged with Kilo 20130501 by glaissa
    var MAP_HTML = '<div class="map" style="visibility:hidden;"><div class="header"><h1>Terminal 1</h1><a href="#" class="close closing"></a><div class="clear"></div></div><ul><li><img width="2000" height="1240" data-src="../img/maps/T1_2000x1062.jpg"/></li><li><img width="2000" height="1062" data-src="../img/maps/T2_2000x1062.jpg"/></li><li><img width="2000" height="1062" data-src="../img/maps/T3_2000x1062.jpg"/></li></ul></div>';
	

    function init() {
        holder = $("#overlay-container");
        flightPanel = holder.children("div.flight");

        //Merged with Kilo 20130501 by glaissa
        mapPanel = holder.children("div.map");
        if (mapPanel.length == 0) {
            mapPanel = $(MAP_HTML);

            var tPadding = 75;
            var goH = ($(window).height() - tPadding * 2);
            var goW = ($(window).width() - tPadding * 2);

            mapPanel.css({ width: goW, height: goH });

            holder.append(mapPanel);
        }

        quickPanel = holder.children("div.quicklook");

        holder.css({ zIndex: 2000 });

        //Added by ChenChi on Mar 06 2013
        if ($("#overlay-container2")) {
            $("#overlay-container2").css({ zIndex: 2000 });
        }

        flightPanel.find("a.close").click(closeFlightPanel);
        quickPanel.find("a.close").click(closeOptionsPanel);
        mapPanel.find("a.close").click(closeMapPanel); //Merged with Kilo 20130501 by glaissa
    }

    function showFlightPanel(source, confirm, reload, func, newAddToCart) {
        editFlight = source;
        confirmFlight = confirm;
        checkOut = func;
        reloadPage = reload;
        if ($("#ProductDetails").html() != undefined || editFlight == true) {
            $('body').css({ 'overflow': 'hidden' });
            holder.css({ height: $(document).height() });
            holder.fadeIn(1000);
            if (editFlight == true) {
                quickPanel.css("display", "none");
            }
        }
        else {
            $('body').css({ 'overflow': 'visible' });
        }
        flightPanel.fadeIn(1000);
        $("#FlightDetails").find("div.header h1").html("Please enter your flight details:");

        var datefield = $("#flightDate");
        var destfield = $("#flightDest");
        var flightfield = $("#flightNo");
        var submitbtn = $("#FlightDetails").find(".buttons .ui-submit");
        var closeBtn = flightPanel.find("a.close");



        if (!flightPanel.stuff) {  // init
            submitbtn.click(function (e) {
                e.preventDefault();
                if (submitbtn.hasClass("disabled")) {
                    return false;
                }

                if (editFlight == true) {
                    var sData = {};
                    sData.Flight_AutoID = flightPanel.attr("data-flightID");
                    sData.FlightDate = flightPanel.find("#flightDate").val();
                    var currentPage = $("input[id$='hfCurrentPage']").val();
                    if (currentPage == 'receipt') {

                        var order_id = getQueryString('order');
                        var sorderno = $('ul.orderid li.field').text();

                        if (order_id == null) {
                            //alert("Order number cannot be NULL");
                            modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () { return false; }, "auto", 110); //ascentis-glaissa:updated apr 24 2013
                            return false;
                        }

                        sData.FlightInfo_AutoID = $('#hfAutoID').val();
                        sData.orderid = order_id;
                        sData.sorderno = sorderno;

                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(sData),
                            url: wsHubPath + "WSHub/wsFlight.asmx/UpdateFlightInfoByOrderId",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                GetFlightInfo(); //method from TransactionReceipt.js

                                //ascentis-glaissa mar 14 2013:to use modal.showFree();
                                onEditFlightSuccess();
                                //alert('Flight information has been changed.');

                            },
                            error: function (data) {
                                //ascentis-glaissa mar 14 2013:to use modal.showFree();
                                //modal.showFree("Error", "Failed to update the flight information!", function () { return false; }, 400, 100);
                                //alert('Failed to change flight information!');

                                //ascentis-glaissa updated apr 24 2013
                                modal.showFree("Error", "Sorry, we were unable to update your flight information, Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () { return false; }, "auto", 110);
                            }
                        });

                    } else {
                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(sData),
                            url: wsHubPath + "WSHub/wsFlight.asmx/UpdateFlightDetailsByMemberID",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json"
                        }).done(onEditFlightSuccess);
                    }
                }
                else {
                    if ($("#ProductDetails").html() == undefined) {
                        if (func != null) { func(); }
                    }
                    else {
                        if (newAddToCart == null || newAddToCart == undefined) {
                            var $productOptions;
                            $productOptions = new ProductOptionsService($("#ProductOptions"), $("#ProductDetails").children(".buttons"), $("#ProductDetails"), null, quickPanel.stuff.stockSpinner);
                            $productOptions.clickAddToCart();
                            $productOptions.setCallbackCart(onAddedToCartSuccess);
                        } else { if (func != null) { func(); } }
                    }
                }

                return false;
            });

            //ASCENTIS-glaissa:updated 04032013
            function onDestinationSearched(data) {
                data = $.parseJSON(data.d);

                var proceed = true;
                var currentPage = $("input[id$='hfCurrentPage']").val();
                if (currentPage == 'receipt' && data.status == 0) {
                    var prohibitedCtry = LAG_ProhibitedCountry.split(",");
                    var flightDestination = data.params.match;
                    var isAUUS = false;
                    for (var x = 0; x < prohibitedCtry.length; x++) {
                        if (flightDestination.indexOf(prohibitedCtry[x]) > -1) {
                            isAUUS = true;
                            x = prohibitedCtry.length + 1;
                        }
                    }

                    if (isAUUS == true) {
                        var sData = { orderid: getQueryString('order'), language: $.cookie("Language") };
                        $.ajax({
                            type: "POST",
                            data: JSON.stringify(sData),
                            url:  wsHubPath + "WSHub/wsTransactionReceipt.asmx/IsOrderWithAlcohol",
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                var objResult = data.d;
                                if (objResult == "True") {
                                    modal.showFree("Information", "Online Retail service is unable to fulfill orders for LAG items where <br />the destination is to Australia or America.<br/><br/>You may cancel your order and we will process the refund of your payment.", CallbackFunction, "auto", "auto");
                                    submitbtn.addClass("disabled");
                                    proceed = false;
                                }
                            }
                        });
                    }
                }

                if (proceed == true) {
                    switch (data.status) {
                        case 0:
                            {
                                flightPanel.attr("data-flightID", data.params.id);
                                flightPanel.attr("data-flightDest", data.params.match);
                                flightPanel.attr("data-airportCode", data.params.airportcode);
                                destfield.val(data.params.match);
                                submitbtn.removeClass("disabled");
                                break;
                            }
                        case 1:
                            {
                                destfield.val("( ...departure date is not within 1-14 days... )");
                                //modal.showFree("Information", "Sorry, we will not be able to process your order as your <br />flight date is not within 1 - 14 days.", CallbackFunction, "auto", "auto");                                
                                modal.showFree("Information", "Sorry, we are only able to process orders 1-14 days <br />prior to your departure date.", CallbackFunction, "auto", "auto");
                                submitbtn.addClass("disabled");
                                break;
                            }
                        case 2:
                            {
                                destfield.val("( ...no match found... )");
                                submitbtn.addClass("disabled");
                                break;
                            }
                        case 3:
                            {

                                var currentPage = $("input[id$='hfCurrentPage']").val();
                                if (currentPage == 'receipt') {
                                    //added by zy for SN4 in 5th
                                    destfield.val("( ...Flight ETD is not within operation hour... )");
                                    //modal.showFree("Information", "Sorry, we will not be able to process your order as your flight's estimated time of  <br /> departure (ETD) is not within operational hours of  our Collection Centre. <br/><br/>You may cancel your order and we will process the refund of your payment.", CallbackFunction, "auto", "auto");
                                    //Our Collection Centre is operating from 0500-2400. We are unable to processs your order due to your flight's timing. Please make your purchase at the shop(s) in transit. 
                                    modal.showFree("Information", "Our Collection Centre is operating from " + data.opstart + "-" + data.opend + ".<br />We are unable to processs your order due to your flight's timing.<br />Please make your purchase at the shop(s) in transit.<br /><br />You may cancel your order and we will process the refund of your payment.", CallbackFunction, "auto", "auto");
                                    submitbtn.addClass("disabled");

                                }
                                else {
                                    destfield.val("( ...Flight ETD is not within operation hour... )");
                                    //modal.showFree("Information", "Sorry, we will not be able to process your order as your flight's estimated time of <br /> departure (ETD) is not within operational hours of  our Collection Centre.", CallbackFunction, "auto", "auto");
                                    modal.showFree("Information", "Our Collection Centre is operating from " + data.opstart + "-" + data.opend + ".<br />We are unable to processs your order due to your flight's timing.<br />Please make your purchase at the shop(s) in transit.", CallbackFunction, "auto", "auto");
                                    submitbtn.addClass("disabled");
                                }

                                break;
                            }
                        default:
                            {
                                destfield.val("( ...server problem... )");
                                submitbtn.addClass("disabled");
                            }
                    }
                }
            }

            function checkFillMask() {
                if (flightPanel.stuff.fillMask == 3) {
                    destfield.val("( ...finding... )");
                    submitbtn.addClass("disabled");
                    //$.ajax({url:$API.DESTINATION_MATCH, data:{service:"flightdest", date:datefield.val(), flight:flightfield.val() }, method:"POST"}).done(onDestinationSearched);
                    var sData = { FlightNo: flightfield.val(), FlightDateTime: datefield.val() };
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(sData),
                        url:  wsHubPath + "WSHub/wsFlight.asmx/GetFlightDestination",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(onDestinationSearched);
                }
                else {
                    destfield.val("");
                    submitbtn.addClass("disabled");
                }
            }

            function clearStuff(e) {
                flightfield.val("");
                datefield.val("");
                destfield.val("");
                flightPanel.attr("data-flightID", 0);
                submitbtn.addClass("disabled");
                if (e != null) e.preventDefault();
                return false;
            }
            $("#FlightDetails").find(".buttons .ui-clear").click(clearStuff);

            var onFlightsComplete = function (data) {

                data = $.parseJSON(data);
                if (data.status != 0) { // failed
                    destfield.val("server problem...");
                }
                else {
                    destfield.val(data.params.destination);
                }
            }
            //datefield.datepicker();
            datefield.datepicker({ dateFormat: 'dd M yy' });
            //            flightfield.val("");
            //            datefield.val("");
            //            destfield.val("");
            var flightDefaultText = flightfield.data("default") || "";
            flightPanel.stuff = {
                fillMask: 0,
                flightBox: flightPanel.find("select.flights")
            };
            new FormFieldBehaviour(flightfield);

            flightfield.focusout(function () {
                var flightno = flightfield.val().replace(/\ /g, '');
                if (flightno != "" && flightfield.val() != flightDefaultText && flightno.length >= 3) {
                    var digits = flightno.substr(2);
                    if (digits.length < 3) {
                        while (digits.length < 3) { digits = "0" + digits; }
                        flightfield.val(flightno.substr(0, 2) + digits);
                        checkFillMask();
                    } else {
                        flightfield.val(flightno);
                        checkFillMask();
                    }
                }
            });

            new InputKeyBinder(datefield, function () {
                if (datefield.val() != "") {
                    flightPanel.stuff.fillMask |= 2;
                    checkFillMask();
                }
                else {
                    flightPanel.stuff.fillMask &= ~2;
                    checkFillMask();
                }


            }, true);

            new InputKeyBinder(flightfield, function () {
                if (flightfield.val() != "" && flightfield.val != flightDefaultText) {
                    flightPanel.stuff.fillMask |= 1;
                    checkFillMask();
                }
                else {

                    flightPanel.stuff.fillMask &= ~1;
                    checkFillMask();
                }


            }, false);

//            var propertyChangeUnbound = false;
//            flightfield.bind("input", function () {
//                if (!propertyChangeUnbound) {
//                    flightfield.unbind("propertychange");
//                    propertyChangeUnbound = true;
//                }
//                flightPanel.stuff.fillMask |= 1;
//                checkFillMask();
//            });

        }

        if (editFlight == true) {
            var sData = { dateFormat: "dd MMM yyyy" };

            var currentPage = $("input[id$='hfCurrentPage']").val();

            if (currentPage == 'receipt') {

                var order_id = getQueryString('order');
                if (order_id == null) {
                    //alert("Order number cannot be NULL");
                    modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () { return false; }, "auto", 110); //ascentis-glaissa:updated apr 24 2013
                    return;

                }

                var sData = { orderid: order_id };

                $.ajax({
                    type: "POST",
                    data: JSON.stringify(sData),
                    url:  wsHubPath + "WSHub/wsFlight.asmx/GetFlightInfoByOrderId",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var objResult = $.parseJSON(data.d);
                        flightfield.val(objResult.FlightNo);
                        datefield.val(objResult.FlightDateTime);
                        flightPanel.stuff.fillMask = 3;
                        checkFillMask();
                    }
                });

            } else {
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(sData),
                    url:  wsHubPath + "WSHub/wsFlight.asmx/GetMemberFlightDetails",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        var objResult = $.parseJSON(data.d);
                        flightfield.val(objResult.FlightNo);
                        datefield.val(objResult.FlightDateTime);
                        flightPanel.stuff.fillMask = 3;
                        checkFillMask();
                    }
                });
            }

        }

        flightPanel.css({ top: $(window).scrollTop() + $(window).height() * .5 - 60 });
    }

    function closeFlightPanel() {
        $('body').css({ 'overflow': 'visible' });
        if ($("#ProductDetails").html() != undefined || editFlight == true) {
            holder.fadeOut(1000);
        }
        flightPanel.fadeOut(1000);
        if (quickPanel.stuff != undefined) { quickPanel.stuff.addToCartBtn.removeClass("loading"); quickPanel.stuff.addToCartBtn.removeClass("disabled"); }
        $("#overlay-container").fadeOut(1000);
        return false;
    }

    //Merged with Kilo 20130227 version by ChenChi
    function lazyInitQuickStuff() {
        if (!quickPanel.stuff) {   // initialize quick panel stuff
            var btnHolder = quickPanel.find(".buttons");
            var inputUL = quickPanel.find("div.template ul.options.input");
            quickPanel.stuff = {
                optionsHolder: quickPanel.find("div.optionsHolder"),
                btnHolder: btnHolder,
                addToCartBtn: btnHolder.children(".ui-submit"),
                wishlistBtn: btnHolder.children(".ui-wishlist"),
                inputUL: inputUL,
                inputStockLabel: inputUL.find(".stocklabel"),
                inputStockText: inputUL.find(".stocktext"),
                imageTag: quickPanel.find("div.product-image img"),
                titleTag: quickPanel.find("div.content>h1").first(),
                quantity: inputUL.find(".quantity"),
                stockSpinner: null
            };

        }
        else {   // reset quick panel
            //quickPanel.stuff.addToCartBtn.addClass("disabled");
            quickPanel.stuff.wishlistBtn.css("display", "block");
        }
    }

    function showOptionsPanel(e) {
        lazyInitQuickStuff();

        setOptions(e);
        //$('body').css({'overflow':'hidden'});
        holder.css({ height: $(document).height() })
        holder.fadeIn(1000);

        quickPanel.fadeIn(1000);
        quickPanel.css({ top: $(window).scrollTop() + $(window).height() * .5 - 60 });

        //ascentis-glaissa:added apr 23 2013        
        if (flightPanel.css('display') == 'block' && $("#ProductDetails").html() == undefined) {
            $('body').css({ 'overflow': 'visible' });
            flightPanel.fadeOut(1000);
        }

        //Added by ChenChi on Jan 28 2013
        //ascentis-glaissa: updated mar 21 2013
        //initiateSubmitButton();
    }

    function closeOptionsPanel() {
        //$('body').css({'overflow':'visible'});
        holder.fadeOut(1000);
        //	quickPanel.css(1000);
        return false;
    }

    function setOptions2(data, customOptionsHolder) {
        var tHolder = customOptionsHolder || quickPanel.stuff.optionsHolder;
        tHolder.html("");
        var dataOptions = data.options;
        quickPanel.data("id", data.id);
        quickPanel.data("group", data.group);
        quickPanel.data("retailer", data.retailer);
        quickPanel.data("isLAG", data.isLAG);
        quickPanel.data("isAgeLimit", data.isAgeLimit);
        quickPanel.data("isAlcohol", data.isAlcohol);
        quickPanel.data("branddetailurl", data.branddetailurl);
        quickPanel.data("brandID", data.brandAutoID);
       
        //Modified by ChenChi on Feb 23 2013
        var imagePath = data.image.toLowerCase();
        if (imagePath.indexOf("_std.jpg") > -1) {
            imagePath = imagePath.replace("_std.jpg", "_190x260.jpg");
        }
        //Added by ChenChi on Apr 12 2013, to tackle the blank image issue
        if (imagePath.indexOf("blank.jpg") > -1) {
            imagePath = imagePath.replace("blank.jpg", "blank_190x260.jpg");
        }

        imagePath = imagePath.replace("_190x190.jpg", "_190x260.jpg"); //Added by ChenChi on May 10 2013

        quickPanel.stuff.imageTag.attr("src", imagePath);

        var title = data.title.split("|");
        if (data.branddetailurl != null && data.branddetailurl != "" && title.length > 1) { //glaissa added aug 1 2013 for estee lauder
            var header = "<h2>" + title[0] + "</h2>";
            quickPanel.stuff.titleTag.parent().find("h2").remove();
            $(header).insertBefore(quickPanel.stuff.titleTag);
            quickPanel.stuff.titleTag.html(title[1]);
        } else {
            quickPanel.stuff.titleTag.html(data.title); 
        }

        var isRetailers = getRetailerID(dataOptions, "retailer");
        //console.log (isRetailers);

        if (data.price) {
            var textHolder = quickPanel.find("div.price");
            textHolder.html('S$' + numberWithCommas(data.price).replace('$', ''));

            if (undefined != data.prices && undefined != data.prices.OriginalPrice) {
                var tmp1 = parseFloat(data.prices.OriginalPrice.replace('$', '')),
                    tmp2 = parseFloat(data.price.replace('$', ''));

                var textHolder = quickPanel.find("div.price");
                textHolder.parent().find("div.oldPrice").remove();
                if (tmp1 > tmp2) {                    
                    textHolder.after("<div class=\"oldPrice\" style=\"font-size:11px;text-decoration: line-through;text-align: right;\">S$" + numberWithCommas(data.prices.OriginalPrice).replace('$','') + "</div>");
                }
            } 
        }
        

        if (isRetailers >= 0) {
            var retailerData = data.options[isRetailers];
            var temp = quickPanel.find("div.template ul.options.retailers").clone();
            temp.data("id", retailerData.id);
            temp.data("type", "retailer");
            temp.find("h1").replaceWith("<h1>" + retailerData.title + "</h1>");


            var tItemTemplate = temp.find("li").clone();
            temp.find("li").replaceWith("");

            for (var i = 0; i < retailerData.list.length; i++) {
                var tData = retailerData.list[i];
                var tItem = tItemTemplate.clone();
                tItem.data("id", tData.id);
                tItem.data("value", tData.value);


                if (tData.selected == 1) {
                    tItem.addClass("selected");
                }

                tItem.html(tData.label);
                temp.find("div.list").append(tItem);
                //temp.find("div.list").append('<div class="clear"></div>');

            }
            temp.append('<div class="clear"></div>');
            tHolder.append(temp);

        }

        //duplicate Radio bt options
        var radioGroups = 0;
        $.each(dataOptions, function (index, info) {
            if (info.type == "radio") {
                radioGroups++;
                var temp = quickPanel.find("div.template ul.options.radio").clone();
                temp.data("id", info.id);
                temp.data("type", "radio");
                temp.find("h1").replaceWith("<h1>" + info.title + "</h1>")

                var tItemTemplate = temp.find("li").clone();
                temp.find("li").replaceWith("");

                for (var i = 0; i < info.list.length; i++) {
                    var tData = info.list[i];
                    var tItem = tItemTemplate.clone();
                    tItem.data("id", tData.id);
                    tItem.data("value", tData.value);
                    if (tData.available == 0) {
                        tItem.addClass("inactive");
                    } else {
                        tItem.removeClass("inactive");
                    }

                    if (info.brandcode != null && info.brandcode != "" && info.title.toLowerCase() == "shade" && tData.label.search('/') > 0) { //glaissa added july 3 2013
                        tItem.addClass("brandingColor").attr("label", tData.label);
                        tItem.hover(function () { $(this).addClass("hoverColor"); }, function () { $(this).removeClass("hoverColor"); });
                    }

                    if (tData.selected == 1) {
                        tItem.addClass("selected");
                        if (info.brandcode != null && info.brandcode != "" && info.title.toLowerCase() == "shade" && tData.label.search('/') > 0) {
                            tItem.addClass("selectedColor");
                        }
                    }

                    if (info.brandcode != null && info.brandcode != "" && info.title.toLowerCase() == "shade" && tData.label.search('/') > 0) { //glaissa added july 3 2013                   
                        var label = tData.label.substr(tData.label.search('/'));
                        tItem.html("").css("background-color", "#" + label.replace(/ /g, '').replace('/', ''));
                    } else { tItem.html(tData.label); }

                    temp.append(tItem);
                    temp.find("div.list").append(tItem);
                }

                tHolder.append(temp);
                //tHolder.append('<div class="divider"></div>');
                temp.append('<div class="clear"></div>');
                //return false; 
            };
        });

        //duplicate Combo options
        $.each(dataOptions, function (index, info) {
            if (info.type == "combo") {
                var temp = quickPanel.find("div.template ul.options.combo").clone();
                temp.data("id", info.id);
                temp.data("type", "combo");
                temp.find("h1").replaceWith("<h1>" + info.title + "</h1>")

                var tSelectHolder = temp.find("li select");

                var tItemTemplate = temp.find("li select option").clone();
                tItemTemplate.parent().data("id", info.id);
                temp.find("li select option").replaceWith("");

                for (var i = 0; i < info.list.length; i++) {
                    var tData = info.list[i];
                    var tItem = tItemTemplate.clone();
                    tItem.data("id", tData.id);
                    tItem.data("value", tData.value);
                    tItem.html(tData.label);
                    temp.find("li select").append(tItem);
                    temp.find("div.list").append(tItem);
                }

                tHolder.append(temp);
                //tHolder.append('<div class="divider"></div>');
                temp.append('<div class="clear"></div>');
                //return false; 
            };
        });

        //quickPanel.stuff.radioCount = radioGroups;
        //quickPanel.stuff.isSingleGroup = radioGroups == 1;
        quickPanel.stuff.stockSpinner = null;
        //quickPanel.stuff.stock = 1;  // always ensure at least 1 stock by default unless otherwise stated

        //duplicate Input options
        $.each(dataOptions, function (index, info) {
            if (info.type == "input") {
                if (info.stock != null) {
                    //quickPanel.stuff.inputStockLabel.html(info.stock);
                    //quickPanel.stuff.inputStockText.css("visibility", "visible");
                    quickPanel.stuff.inputStockText.css("visibility", "hidden"); //Modified by Chen Chi on Mar 18 2013: hide the stock text always, requested by Brendan
                }
                else {
                    quickPanel.stuff.inputStockText.css("visibility", "hidden");
                }
                var temp = quickPanel.stuff.inputUL.clone();

                temp.data("id", info.id);
                temp.data("type", "input");


                temp.find("h1").replaceWith("<h1>" + info.title + "</h1>")

                var tSelectHolder = temp.find("li select");

                var tItemTemplate = temp.find("li select option").clone();
                tItemTemplate.parent().data("id", info.id);


                tHolder.append(temp);
                //tHolder.append('<div class="divider"></div>');
                tHolder.append('<div class="clear"></div>');
                ///*
                var spinnerOptions = { min: (info.min != null ? info.min : 1), step: 1 };
                if (info.max != null) spinnerOptions.max = info.max;
                var spinner = temp.find("input").spinner(spinnerOptions);
                spinner.spinner("value", spinnerOptions.min);
                quickPanel.stuff.stockSpinner = spinner;
                if (info.stock != null) {

                    var myStockLabel = temp.find(".stocklabel");
                    myStockLabel.html(info.stock);

                    temp.find("input").addClass("stock");
                    //                    myStockLabel.css("visibility", "visible");
                    myStockLabel.css("visibility", "hidden"); //Modified by Chen Chi on Mar 18 2013, hide the stock info always, requested by Brendan
                }
                else myStockLabel.css("visibility", "hidden");
                //*/

                //return false; 
            };
        });
    }


    function customSetup(data, optionsHolder) {
        lazyInitQuickStuff();
        setOptions2(data, optionsHolder);
    }
    this.customSetup = customSetup;

    function setOptions(data) {
        setOptions2(data);

        quickPanel.stuff.service = new ProductOptionsService(quickPanel.stuff.optionsHolder, quickPanel.stuff.btnHolder, quickPanel, null, quickPanel.stuff.stockSpinner);
        quickPanel.stuff.service.setCallbackCart(onAddedToCartSuccess);
    }

    function onAddedToCartSuccess() {
        //ASCENTIS-glaissa:05032013
        modal.showFree("Information", "Item(s) added to cart.", function () { closeOptionsPanel(); }, 400, 100);
        $('body').css({ 'overflow': 'visible' });
        if ($("#ProductDetails").html() != undefined) {
            holder.fadeOut(1000);
        }
    }

    var alreadyOpened = false;
    function CallbackFunction() {
        modal.closeAll();
        return false;
    }

    function onEditFlightSuccess() {
        //ASCENTIS-glaissa:05032013
        flightConfirmed = confirmFlight;
        //modal.showFree("Information", "Flight information has been " + (flightConfirmed == true ? "confirmed." : "changed."), (checkOut != null ? checkOut : reloadPage == true ? function () { window.location.reload(); } : CallbackFunction), 400, 100);        
        if (checkOut != null) {
            checkOut();
        } else {
            if (reloadPage == true) {
                window.location.reload();
            } else { CallbackFunction(); }
        }
        $('body').css({ 'overflow': 'visible' });
        flightPanel.fadeOut(1000);
        holder.fadeOut(1000);
    }


    function getRetailerID(obj, search) {
        var returnKey = -1;
        $.each(obj, function (key, info) {
            if (info.type == search) {
                returnKey = key;
                return false;
            };
        });

        return returnKey;
    }

    //Merged with Kilo 20130501 by glaissa
    //Merged with Kilo 20130731 by glaissa
    var shownMap = 0;
    function showMapPanel(terminal) {
        mapPanel.find("> ul > li").css({ display: "none" });
        var ulHolder = mapPanel.find("> ul");
        var img = ulHolder.find("img");

        if (IS_TOUCH) {
            window.open(img.data("src"), "_blank");
            return;
        }

        switch (terminal) {
            case "t1":
                shownMap = 0;
                mapPanel.find("div.header").find("h1").html("Terminal 1");

                $(mapPanel.find("> ul > li")[0]).css({ display: "block" });
                break;
            case "t2":
                shownMap = 1;
                mapPanel.find("div.header").find("h1").html("Terminal 2");
                $(mapPanel.find("> ul > li")[1]).css({ display: "block" });
                break;
            case "t3":
                shownMap = 2;
                mapPanel.find("div.header").find("h1").html("Terminal 3");
                $(mapPanel.find("> ul > li")[2]).css({ display: "block" });

                break;

        }

        var tPadding = 75;
        holder.css({ height: $(document).height() });
        holder.fadeIn(1000);
        //mapPanel.fadeIn(1000);
        TweenMax.to(mapPanel, 1, { css: { autoAlpha: 1} });
        // height:80%; width:80%;top:50%; left:50%; margin-left:-763px; margin-top:-384px;

        var goH = ($(window).height() - tPadding * 2);
        var goW = ($(window).width() - tPadding * 2);

        mapPanel.css({ width: goW, height: goH });

        mapPanel.css({ top: $(window).scrollTop() + tPadding, left: tPadding });
        mapPanel.find("div.header").css({ zIndex: 1 });
        mapPanel.find("> ul").css({ overflow: "hidden" });

        img.attr("src", $(img[shownMap]).data("src"));
        ulHolder.bind("mousemove", mapPanelMove);
    }


    function mapPanelMove(e) {
        var target = $(mapPanel.find("> ul > li")[shownMap]).find("img");
        var tW = target.width();
        var tH = target.height();

        var tPos = rPosition(mapPanel.find("> ul"), e.pageX, e.pageY);
        //console.log ("mapPanelMove", e.pageX, e.pageY, tPos);
        var rX = tPos.x / mapPanel.width();
        rX = (rX < 0) ? 0 : (rX > 1) ? 1 : rX;
        var rY = tPos.y / (mapPanel.height() - 44);
        rY = (rY < 0) ? 0 : (rY > 1) ? 1 : rY;

        var goXa = tW - mapPanel.width();
        var goYa = tH - (mapPanel.height() - 44);

        mapPanel.find("> ul > li").css({ marginTop: 0 - goYa * rY, marginLeft: 0 - goXa * rX });

        //console.log ("mapPanelMove", goYa * rY);
    }

    function closeMapPanel() {
        mapPanel.find("> ul").unbind("mousemove", mapPanelMove);
        //mapPanel.fadeOut(1000)
        TweenMax.to(mapPanel, 1, { css: { autoAlpha: 0} });
        holder.fadeOut(1000);
        flightPanel.fadeOut(1);
        quickPanel.fadeOut(1);
    }

    function rPosition(element, mouseX, mouseY) {
        var offset = element.offset();
        var x = mouseX - offset.left;
        var y = mouseY - offset.top;

        return { 'x': x, 'y': y };
    }
    //Merged with Kilo 20130430 by glaissa - end

    //Created by ChenChi on Jan 28 2013
    function initiateSubmitButton() {
        if (quickPanel) {
            try {
                var allSelected = true;
                //console.log(quickPanel.stuff.optionsHolder);

                quickPanel.stuff.optionsHolder.find("ul.options:not('.input')").each(function () {

                    if ($(this).find("li.selected").length == 0) {
                        allSelected = false;
                    }
                });

                if (allSelected) {
                    quickPanel.stuff.addToCartBtn.removeClass("disabled");
                }
            } catch (exe) {
                console.log(exe);
            }
        }
    }
}
var $overlay;
var flightConfirmed = false;
$(document).ready(function () {
    $overlay = new Overlay();
    $overlay.init();
});
