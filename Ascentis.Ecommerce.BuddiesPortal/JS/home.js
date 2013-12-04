(function () {

    var _pageCount = 2;
    function LoadImageStack(arr, callback) {
        var stack = [];
        var i = arr.length;
        while (--i > -1) {
            stack.push(arr[i]);
        }
        var count = 0;

        function onLoadDone() {
            callback(count++);
            if (stack.length) loadImage(stack.pop());
        }

        function loadImage(url) {
            var img = new Image();
            img.onload = onLoadDone;
            img.src = url;

        }

        if (stack.length) {
            loadImage(stack.pop());
        }
    }


    /**
    SLIDESHOW LOGIC for Homepage
    */

    $(document).ready(function () {
        var SlideShow = $("#SlideShow");
        var SlideShow_link = SlideShow.children(".link");
        var SlideShow_navHolder = SlideShow.children(".nav");
        var SlideShow_navChildren;
        var SlideShow_navChildren_len;
        var PARAM_BANNERS;
        var SlideShow_index = 0
        var Slideshow_loadCount = 0;
        var SlideShow_imgStack;
        var SlideShow_img;
        var curSlideTimeout = -1;
        var curSlideInterval = -1;
        var curSlideStartTime;
        var curSlidePagiElem;
        var curSlidePagiElemWidth;
        var NEXTSLIDE_TIME = 4000;
        var targetSlide = -1;
        var isSlideTransiting = false;
        var IsFirstSubSplashBanner = false;

        SlideShow_link.click(function (e) {
            if (isSlideTransiting) {
                e.preventDefault();
                // alert('Main Banner : false');
                return false;

            }
            // alert('Main Banner : true');
            return true;
        });

        function slideInDone() {
            // alert('Main Banner : slideInDone');
            SlideShow.find('img').first().unbind('click');
            isSlideTransiting = false;
            if (targetSlide != SlideShow_index) {
                showSlide(targetSlide);
                return;
            }
            SlideShow_link.removeClass("disabled");
            SlideShow_link.attr("href", PARAM_BANNERS[SlideShow_index].link);
            if (PARAM_BANNERS[SlideShow_index].link != '' && $.trim(PARAM_BANNERS[SlideShow_index].link) != '') {
                SlideShow.find('img').first().click(function () {
                    window.open(
                                  PARAM_BANNERS[SlideShow_index].link,
                                  '_blank'
                                );
                });
            }

            if (curSlideTimeout < 0 && SlideShow_index < Slideshow_loadCount) {
                setTimerForNextSlide();
            }

        }

        function setTimerForNextSlide() {
            // alert("setTimerForNextSlide");
            var cElem = $(SlideShow_navChildren[SlideShow_index]);
            curSlidePagiElem = cElem.children(".loadnext");
            curSlideStartTime = (new Date()).getTime();

            curSlideTimeout = setTimeout(nextSlide, NEXTSLIDE_TIME);
            curSlideInterval = setInterval(updateSlideTimer, 30);
        }

        function updateSlideTimer() {

            var dt = (new Date()).getTime() - curSlideStartTime;
            var ratio = (dt / NEXTSLIDE_TIME);
            if (ratio > 1) ratio = 1;
            if (ratio < 0) ratio = 0;

            curSlidePagiElem.width(ratio * curSlidePagiElemWidth);
        }


        function initSlideShow() {
            // alert("InitSlideShow");
            SlideShow_link.css("display", "block");
            SlideShow_navHolder.css("display", "block");
            SlideShow_img = $("<img></img>");
            SlideShow_img.attr("src", PARAM_BANNERS[0].image);
            SlideShow.prepend(SlideShow_img);
            SlideShow_img.css("opacity", 0);
            curSlidePagiElem = $(SlideShow_navChildren[0]).addClass("selected").children(".loadnext");
            curSlidePagiElemWidth = $(SlideShow_navChildren[0]).width();
            targetSlide = 0;
            SlideShow_img.stop().animate({ opacity: 1 }, 1000, function () { slideInDone(); });
            //css( "background-image", url('img/banner/banner_1.jpg') );
            //"src", ;


        }

        function nextSlide() {
            var vi = SlideShow_index + 1;

            if (vi >= SlideShow_navChildren_len) {
                vi = 0;
            }

            selectSlide(vi);

        }



        function selectSlide(val) {
            if (targetSlide == val) return;

            if (SlideShow_index >= 0) {
                $(SlideShow_navChildren[SlideShow_index]).children(".loadnext").width(0);
            }


            if (targetSlide >= 0) $(SlideShow_navChildren[targetSlide]).removeClass("selected");
            var cElem = $(SlideShow_navChildren[val]);
            cElem.addClass("selected");

            if (curSlideInterval >= 0) {
                clearInterval(curSlideInterval); // t
                curSlideInterval = -1;
            }
            if (curSlideTimeout >= 0) {
                clearTimeout(curSlideTimeout);
                curSlideTimeout = -1;
            }
            targetSlide = val;
            if (!isSlideTransiting) {

                showSlide(val);
            }


        }

        function showSlide(val) {



            SlideShow_index = val;

            var cElem = $(SlideShow_navChildren[val]);



            SlideShow.css("background-image", "url('" + PARAM_BANNERS[val].image + "')");
            SlideShow_link.css("cursor", "default");
            //Added by ChenChi on Feb 23 2013
            SlideShow_link.attr("target", "_blank");

            isSlideTransiting = true;
            SlideShow_link.addClass("disabled");
            SlideShow_img.stop().animate({ opacity: 0 }, 1000, function () { SlideShow_link.css("cursor", "pointer"); SlideShow_img.attr("src", PARAM_BANNERS[val].image); SlideShow_img.css("opacity", 1); slideInDone(); });
        }


        function onLoadStackedItemDone(index) {
            Slideshow_loadCount++;
            if (index == 0) {
                initSlideShow();

            }
            else if (!isSlideTransiting && curSlideTimeout < 0 && index == SlideShow_index + 1) {

                setTimerForNextSlide();

            }

            var d = PARAM_BANNERS[index];
            $(SlideShow_navChildren[index]).removeClass("disabled");

        }

        function onNavItemClick() {
            var targ = $(this);
            if (targ.hasClass("disabled")) return;

            selectSlide(parseInt(targ.data("id")));
        }
        // alert('Main Banner:empty');
        SlideShow_navHolder.empty();
        SlideShow_navHolder.css("display", "none");
        SlideShow_link.css("display", "none");

        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsBanner.asmx/GetSplashBanner",
            data: "{'languageCode':'" + $("#language").val() + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                try {
                    var data = msg.d;
                    data = $.parseJSON(data);

                    if (data.status != 0) return;

                    // if (params.status
                    var arr = data.params.banners;

                    var len = arr.length;
                    var i;
                    var htmlStr = "";
                    var toStack = [];
                    for (i = 0; i < len; i++) {
                        //Modified by ChenChi on Feb 23 2013
                        if (arr[i].btype == 'b') {
                            // alert(arr[i].image);
                            toStack.push(arr[i].image);
                            htmlStr += '<div data-id="' + i + '" class="numholder disabled"><div class="loadnext" style="width:0px;"></div><div class="number noselect">' + (i + 1) + '</div></div>';
                        }
                        else if (arr[i].btype == 's') {
                            //need to change this place;
                            if (IsFirstSubSplashBanner == false) {
                                var anchor = $("div.splash").find("a.firstsplash"),
                                // shortImg = $("#Promosplash").find("img.short"),
                                longImg = $("#Promosplash").find("img.long");

                                $(anchor).attr("href", arr[i].link).attr("target", "_self"); //Modified by ChenChi on Feb 23 2013                          
                                // $(shortImg).attr("src", arr[i].image.replace(".jpg", "190x290.jpg"));
                                $(longImg).attr("src", arr[i].image);
                                IsFirstSubSplashBanner = true;
                            }
                            else {
                                var anchor = $("div.splash").find("a.secondsplash"),
                                // shortImg = $("#Promosplash").find("img.short"),
                                longImg = $("#Promosplash").find("img.long1");

                                $(anchor).attr("href", arr[i].link).attr("target", "_self"); //Modified by ChenChi on Feb 23 2013                          
                                // $(shortImg).attr("src", arr[i].image.replace(".jpg", "190x290.jpg"));
                                $(longImg).attr("src", arr[i].image);
                                IsFirstSubSplashBanner = false;
                                arr.splice(i, 1);
                                len--;
                                i--;
                            }


                        }
                    }
                    PARAM_BANNERS = arr;

                    SlideShow_navHolder.html(htmlStr);

                    SlideShow_imgStack = new LoadImageStack(toStack, onLoadStackedItemDone);
                    // alert("Main Banner:SlideshowImg:" + SlideShow_imgStack);
                    SlideShow_navChildren = SlideShow_navHolder.children();
                    SlideShow_navChildren_len = SlideShow_navChildren.length;

                    SlideShow_navChildren.click(onNavItemClick);


                } catch (exe) {

                }
            }
        });
    });


    // ______________________________________________________________________


    /**
    MASONARY LAYOUT LOGIC for Homepage
    */

    var columnW = 200;
    var container;
    var items;
    var promoItems;
    var imgs = null;
    var lastAvailColumns = 0;
    var _window = $(window);

    var curReplaced;
    var FIRST_ITEM_GONE = false;

    function checkForReplacement() {
    }

    $(document).ready(function () {   // STARt ready layout

        var PromoTemplate;

        var ProductTemplate = $("#ProductTemplate");
        ProductTemplate.removeAttr("id");
        var ProductTemplate_image = ProductTemplate.find("img.pimg");
        var ProductTemplate_buttons = ProductTemplate.find("div.buttons");
        var ProductTemplate_url = ProductTemplate_buttons.find(".view");
        var ProductTemplate_title = ProductTemplate.find(".panel .name");
        var ProductTemplate_from = ProductTemplate.find(".panel .from");
        var ProductTemplate_price = ProductTemplate.find(".panel .price");
        var ProductTemplate_soldout = ProductTemplate_buttons.find(".red");
        var ProductTemplate_soldout_text = ProductTemplate_soldout.children(".text");
        var ProductTemplate_badge = ProductTemplate.find(".badge");


        var PromoTemplate = $("#PromoTemplate");
        PromoTemplate.removeAttr("id");

        var rng = new ParkMiller();
        rng.seed(Math.round(Math.random() * 2147483647));

        container = $('.container');
        // hide container initially until masonary is up
        $(".container").css("display", "none");
        //setupProductContainer(container);


        promoItems = container.find(".promotag");
        items = container.children(".item");
        imgs = items.find("img.pimg");
		console.log(items);
		console.log(imgs);

        items.filter(function () { return $(this).hasClass("closable") }).children(".btn-close").click(function () {
            $(this).parent().remove();
            container.masonry("reload");
        });

        var setupImages = function () {

            var randIndex = Math.floor(rng.uniform() * 3);
			console.log(randIndex);
            //$(this).width( randIndex
            var imgElem = $(this);
			console.log(imgElem);
            var src = imgElem.attr("src");
            src = src.split("_");
            var srcDim = dimensions[randIndex];
			console.log(srcDim);
            imgElem.data("id", src[0]);
            imgElem.data("width", srcDim[0]);
            imgElem.data("height", srcDim[1]);
            imgElem.parent().append($('<img class="loader" src="img/ajax-loader.gif"></img>'));
        }


        // More butotn functionality
        $("#MoreBtn").click(function () {
            var me = $(this);

            //ascentis-glaissa:added mar 27 2013
            var loadMoreTxt = $("#MoreBtn").find("div.text");
            var loadMoreLoader = $("#MoreBtn").find("div.loader");
            loadMoreTxt.css("display", "none");
            loadMoreLoader.css("display", "block");

            if (me.hasClass("disabled")) return;

            me.addClass("disabled");


            var sizeProduct = 10;
            var sizeBanner = 2;  
            var languageType = $.cookie('Language');

            var gcont = $("div.container").find("div.buttons");
            var gids = "";
            $.each(gcont, function (item) {
                if ($(this).attr("data-group"))
                    gids = gids + $(this).attr("data-group") + "|";
            });
            gids = gids.replace(/\|$/, "");

            //var sData = { pageSizeProduct: "" + sizeProduct + "", pageSizeBanner: "" + sizeBanner + "", pageSizeBest: "" + sizeBest + "", currentPageIndex: "" + _pageCount + "", langType: "" + languageType + ""};
            var sData = { pageSizeProduct: "" + sizeProduct + "", pageSizeBanner: "" + sizeBanner + "", currentPageIndex: "" + _pageCount + "", langType: "" + languageType + "", gids: "" + gids + "" };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsProduct.asmx/GetLoadMoreProductGroup",
                contentType: "application/json; charset=utf-8",
                dataType: "json"

            }).done(function (data) {
                var porducts = $.parseJSON(data.d);
                if (0 == porducts.params.items.length) {
                    $("#MoreBtn").hide();
                    return;
                }
                parseLoadMoreData(data);

                promoItems = container.find(".promotag");
                items = container.children(".item");
                imgs = items.find("img.pimg");

                $("#MoreBtn").removeClass("disabled");

                //ascentis-glaissa:added mar 27 2013
                loadMoreTxt.css("display", "block");
                loadMoreLoader.css("display", "none");

                ChangiProducts.setWidthForPriceAndWidth();
            });
            return false;
        });

        var dimensions = [
			[190, 190],  // square
			[190, 260],  // portrait
			[390, 260]  // landscape
		];
        imgs.each(setupImages);


        $("#PromoTag .promotag.first .btn-close").click(function () { $(this).parent().remove(); FIRST_ITEM_GONE = true; checkForReplacement() });

        //wlh added 26 Sep 2013 for OverlayVisit
        $(" #OverlayVisitMain .OverlayVisitDivClose .OverlayVisitClose").click(function () {
            $("#subscribe_field1").val("");
            $("#OverlayVisitMain").css("display", "none");
            $("#overlay-container").css("display", "none");
        });

        container.masonry({
            itemSelector: '.item:visible',
            columnWidth: columnW,
            gutterWidth: 0,
            isResizable: false,
            isFitWidth: false

        });
        container.css("display", "block");
        _window.trigger("resize");

        var parseLoadMoreData = function (data) {
            var porducts = $.parseJSON(data.d);
            var items = porducts.params.items;
            var i;

            var len = items.length;
            var d;

            var cont = $("<div></div>");
            var nitem;
            for (i = 0; i < len; i++) {
                d = items[i];
                if (d.type === "product") {

                    ProductTemplate.data("id", d.id);
                    ProductTemplate_image.attr("src", d.image);
                    ProductTemplate_title.html(d.title);
                    ProductTemplate_buttons.attr("data-retailer", d.retailer);
                    ProductTemplate_buttons.attr("data-group", d.group);

                    //Modified by ChenChi on Jun 28 2013 for Nuance Watson Integration
                    ProductTemplate_buttons.attr("data-groupcode", d.groupcode);
                    ProductTemplate_buttons.attr("data-branddetailurl", (null == d.branddetailurl ? "" : wsHubPath + d.branddetailurl));
                    ProductTemplate_buttons.attr("data-brandID", d.brandID);
                    ProductTemplate_buttons.attr("data-brandCode", d.brandCode);

                    ProductTemplate_url.attr("href", d.url);
                    ProductTemplate_soldout.removeClass("soldout").addClass("red");
                    ProductTemplate_soldout_text.html('<img class="icon" src="img/icon/cart.png"/>' + language.AddToCart);
                    ProductTemplate_badge.removeClass("n").removeClass("p").removeClass("ex").removeClass("b").removeClass("e");
                    if (d.badge != "none") {
                        for (var x = 0; x < d.badge.length; x++) {
                            ProductTemplate_badge.addClass(d.badge[x] == "new" ? "n " : d.badge[x] == "promotion" ? "p " : d.badge[x] == "exclusive" ? "ex " : d.badge[x] != "best" ? "e " : "b ");
                        }

                        //ProductTemplate_badge.html(d.badge != "best" ? "" + language.Editor + "<br />" + language.Pick + "" : "" + language.Best + "<br />" + language.Seller + "");//Commented out by ChenChi on May 10 2013
                    } else {//Added by ChenChi on Apr 16 2013
                        ProductTemplate_badge.css('z-index', '-10');
                    }


                    ProductTemplate_from.html('<br/><span class="price">' + d.price + '</span>'); //Modified by ChenChi on Feb 27 2013  // Modified by win lai fixed the price format and note this price is already included S$xx
                    var dummyOverlay = ProductTemplate.find(".dummybg");
                    dummyOverlay.parent().removeClass('notouch');
                    dummyOverlay.find("span.amount").html("S$" + numberWithCommas(parseFloat(d.saving.replace('S$', '')).toFixed(2)));
                    //if (d.groupcode != undefined && d.groupcode != '') {//Added by ChenChi on Aug 21 2013                        
                    //    dummyOverlay.find("span.brandcode").html(d.brandCode);
                    //}

                    nitem = ProductTemplate.clone();
                    nitem.css("display", "block");

                }
                else {
                    if ((d.url.indexOf(".aspx?P1=") > -1) || (d.url.indexOf(".aspx?H1=") > -1)) {
                        nitem = PromoTemplate.clone();
                        $(nitem).find('a').first().attr('href', d.url);
                        $(nitem).find('img').first().attr('src', d.image);

                        if (d.htmlBody != '') {
                            var title = d.htmlBody.substring(d.htmlBody.indexOf("<Title>") + 7, d.htmlBody.indexOf("</Title>"));

                            var price = d.htmlBody.substring(d.htmlBody.indexOf("<Price>") + 7, d.htmlBody.indexOf("</Price>"));
                            $(nitem).append("<div class=\"panel\"><div class=\"from nofrom\"><br><span class=\"price\">From S$" + numberWithCommas(price.replace('S$', '')) + "<\/span><\/div><div class=\"name\" style=\"width: 143px;\">" + title + "<\/div><\/div>")

                        }

                        nitem.css("display", "block");
                    } else {
                        nitem = PromoTemplate.clone();
                        $(nitem).find('a').first().attr('href', d.url);
                        $(nitem).find('img').first().attr('src', d.image);
                        nitem.css("display", "block");
                    }

                }
                cont.append(nitem);

            }

            if (IS_TOUCH) InitNoTouchCont(cont);
            cont = cont.children();
            ChangiProducts.initList(cont);

            var imgData = cont.find("img.pimg");

            imgData.each(setupImages);

            $(".container").append(cont);


            adjustSizing(null, imgData);

            _pageCount++;

        }


    });


    // Adjust sizing logic upon window resize
    // TODO: Always ensure got at least 1 portrait item and 1 landscape item.

    var adjustSizing = function (e, myImgs) {

        var rng = new ParkMiller();
        rng.seed(Math.round(Math.random() * 2147483647));
        if (myImgs == null) myImgs = imgs;
        if (myImgs == null) return;


        function onImgLoaded(e) {
            //$(this).css("background-color", "auto");
            e = $(this);
            e.parent().removeClass("loading");
            e.unbind("load");
        }

        var w = container.width();
        var availableColumns = Math.floor((w) / columnW);
        var upToCol = Math.floor(availableColumns * .5);
        if (upToCol < 0) upToCol = 0;
        if (upToCol > 3) upToCol = 3;

        var count;


        if (e == null || availableColumns != lastAvailColumns) {
            count = 4;
            rng.autoseed();

            myImgs.each(function () {
                var elem = $(this);
                //	if (elem.hasClass("fixed")) return;
                if (upToCol > 0) count--;
                if (count <= 0) upToCol = 0;
                var dw = parseInt(elem.data("width"));
                var dh = parseInt(elem.data("height"));


                var imgW = Math.floor(rng.uniform() * (dw > dh ? upToCol : upToCol > 2 ? 2 : upToCol));
                var addColumnsUsed = imgW;

                if (dw > dh) {
                    if (imgW <= 0) imgW = 1;
                }
                imgW *= columnW;
                imgW += columnW;
                imgW -= 10;



                var elemParent = elem.parent();
                elemParent.width(imgW);
                var ch = Math.round(dh * (imgW / dw));

                if (imgW > 190) {
                    elemParent.addClass("larger");
                }
                else {
                    elemParent.removeClass("larger");
                }


                var tarSrc = elem.data("id") + "_" + imgW + "x" + ch + ".jpg";
                if (elem.attr("src") != tarSrc) {
                    elemParent.addClass("loading");
                    elem.load(onImgLoaded);
                    elem.attr("src", tarSrc); //Enabled by ChenChi on Feb 15 2013
                }

                //	console.log(elem.data("id") + "_" + imgW+"x"+ch + ".jpg");

                elem.attr("width", imgW).attr("height", ch);

                //elem.parent().removeClass("loading");

            });


            if ((availableColumns - 4) < 2) {
                promoItems.removeClass("long");
                if (FIRST_ITEM_GONE) checkForReplacement();
            }
            else {
                promoItems.addClass("long");
                if (FIRST_ITEM_GONE) checkForReplacement();
            }

            //alert("A:"+myImgs.length);
            container.masonry("reload");
        }

        var capW = _window.width();
        var tarW = (availableColumns * (columnW));
        //tarW = tarW  < 980 ? 980 : tarW;
        //container.css("width", (availableColumns * (columnW)) + "px");
        tarW = Math.round((capW - tarW + 8) * .5);
        var minW = 0;
        if (tarW < 4) {

            //-tarW;
            tarW = 4;
        }

        //tarW += 5+ 5*minW;
        container.css("left", tarW + "px");

        lastAvailColumns = availableColumns;

    };
    _window.resize(adjustSizing);

})();		