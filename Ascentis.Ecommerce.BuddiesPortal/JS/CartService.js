function CartService() {
    this.AddToCartHandler = AddToCartHandler;

    var sci = null, overlayID = "#overlay-container";
    this.ShoppingCartItem = sci;
    this.OverlayDivID = overlayID;

    function AddToCartHandler(ShoppingCartItem) {
        if (ShoppingCartItem.Quantity == undefined || ShoppingCartItem.Quantity == null) return false;
        sci = ShoppingCartItem;        
        var member = $.cookie("memberID");
        if (0 == member || undefined == member || null == member || "" == member) {
            $.cookie("memberID", 0, { path: "/" });
            modal.closeAll();                
            modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                    function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                    LoginCallbackFunction,
                    ContinueAsGuest,
                    CloseOverlay, 520, 110);
        } else { PerformValidation(); }
    }

    function PerformValidation() {
        var options = [];
        for (var x = 0; x < sci.ChosenAttributeSet.length; x++) {
            options.push({ id: sci.ChosenAttributeSet[x].AttributeAutoID, value: sci.ChosenAttributeSet[x].AttributeOptionAutoID });
        }
        var sData = { GroupAutoID: sci.ProductGroupAutoID, LangType: $.cookie("Language"), RetailerAutoID: sci.RetailerAutoID, options: options, Quantity: sci.Quantity };
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetProductInfo",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(sData),
            success: function (data) {
                var obj = $.parseJSON(data.d);
                if (obj != null) {
                    SetParamValues(obj);
                    modal.closeAll();

                    //LimitedQty     
                    if (!ValidateQty()) return;

                    //Alcohol Volume
                    if (sci.ProductParam.IsAlcohol) {
                        if (!ValidateAlcoholVolume()) return;
                    }

                    //LAG/Alcohol                    
                    var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
                    if (IsGuest == "true" || IsGuest == true) {
                        ValidateLAG_Alcohol();
                    } else {
                        //Flight Details                        
                        if (sci.FlightInfoParam == null || sci.FlightInfoParam.FlightNumber == 0 || sci.FlightInfoParam.FlightNumber == "") {
                            modal.closeAll();
                            $("#overlay-container").css({ height: $(document).height() });
                            $("#overlay-container").fadeIn(1000);
                            $overlay.showFlightPanel(false, false, false, ValidateLAG_Alcohol, true);
                        } else { ValidateLAG_Alcohol(); }
                    }
                }
            }
        });
    }

    function SetParamValues(Param) {
        sci.MemberAutoID = Param.MemberAutoID;
        sci.CurrentItemQuantity = Param.CurrentItemQuantity;
        sci.TotalAlcoholVolumeInCart = Param.TotalAlcoholVolumeInCart;
        sci.AlcoholVolumeForCurrentItem = Param.AlcoholVolumeForCurrentItem;
        sci.MemberAge = Param.MemberAge;        
        sci.BrandDetailUrl = Param.BrandDetailUrl;
        sci.TotalLAGItemsInCart = Param.TotalLAGItemsInCart;

        sci.MemberDOB = Param.DateOfBirth;
        guestDOB = sci.MemberDOB != "" ? sci.MemberDOB : guestDOB;
        sci.MemberDOB = sci.MemberDOB == "" ? guestDOB : sci.MemberDOB;

        guestAge = sci.MemberAge > 0 ? sci.MemberAge : guestAge;
        sci.MemberAge = sci.MemberAge <= 0 ? guestAge : sci.MemberAge;

        sci.ProductParam.ProductAutoID = Param.ProductAutoID;
        sci.ProductParam.IsLAG = Param.IsLAG;
        sci.ProductParam.IsAlcohol = Param.IsAlcohol;
        sci.ProductParam.LimitedQty = Param.LimitedQty;
        sci.ProductParam.AgeLimit = Param.AgeLimit;

        var FlightDtl = new FlightInfoParam();
        FlightDtl.FlightNumber = 0;
        FlightDtl.DepartureDatetime = "";
        FlightDtl.DestinationCountryCode = "";
        if ((Param.FlightNumber != undefined && Param.FlightNumber != null) || (Param.DestinationCountryCode != "") || (Param.DestinationAirportCode != "")) { 
            FlightDtl.FlightNumber = Param.FlightNumber;
            FlightDtl.DestinationAirportCode = Param.DestinationAirportCode;
            FlightDtl.DestinationCountryCode = Param.DestinationCountryCode;
            FlightDtl.DepartureDatetime = Param.DepartureDatetime;
        }
        sci.FlightInfoParam = FlightDtl;

        guestDest = sci.FlightInfoParam.DestinationCountryCode != "" ? sci.FlightInfoParam.DestinationCountryCode : guestDest;
        sci.FlightInfoParam.DestinationCountryCode = sci.FlightInfoParam.DestinationCountryCode == "" ? guestDest : sci.FlightInfoParam.DestinationCountryCode;
    }

    function ValidateQty() {
        if (sci.ProductParam.LimitedQty > 0 && sci.CurrentItemQuantity > sci.ProductParam.LimitedQty) {
            if (sci.CurrentItemQuantity - sci.Quantity >= sci.ProductParam.LimitedQty) {
                modal.showFree("Information", "Maximum allowable quantity for " + sci.ProductGroupTitle + " is " + sci.ProductParam.LimitedQty + ".<br/>You already have exceeded the maximum.", CloseOverlayCallbackFunction, "auto", "auto");
            } else {
                modal.showFree("Information", "Maximum allowable quantity for " + sci.ProductGroupTitle + " is " + sci.ProductParam.LimitedQty + ".<br/>Please update the product quantity.", CallbackFunction, "auto", "auto");
            }
            return false;
        } else { return true; }
    }

    function ValidateAlcoholVolume() {
        if ((sci.TotalAlcoholVolumeInCart + sci.AlcoholVolumeForCurrentItem) > 10) {
            if (sci.TotalAlcoholVolumeInCart >= 10) {
                modal.showFree("Information", "Maximum volume of alcoholic beverages allowed is 10 litres per flight.<br/>You already have exceeded the maximum.", CloseOverlayCallbackFunction, "auto", "auto");
            } else {
                modal.showFree("Information", "Maximum volume of alcoholic beverages allowed is 10 litres per flight.<br/>Please update the product quantity.", CallbackFunction, "auto", "auto");
            }
            return false;
        } else { return true; }
    }

    function ValidateLAG_Alcohol() {
        var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
        if (IsGuest == "true" || IsGuest == true) {
            if (sci.ProductParam.IsAlcohol == true) {                
                if ((IsGuest == "true" || IsGuest == true) && (sci.TotalAlcoholVolumeInCart == 0 && (guestDOB == "" || guestDest == ""))) {
                    modal.showWithInputs("Alcohol Item",
                    "To purchase alcohol items, please ensure that you are of<br/>legal drinking age in Singapore.",
                    ".bday", GetGuestDetails, CloseOverlayCallbackFunction, function () { LoadLists(1); }, 450, 200, false);
                } else { ValidateAgeDestination(); }
            } else if (sci.ProductParam.IsLAG == true) {
                if ((IsGuest == "true" || IsGuest == true) && (sci.TotalLAGItemsInCart == 0 && guestDest == "")) {
                    modal.showWithInputs("LAG Item",                    
                    "You have selected an item that is either a liquid, aerosol,<br/>or gel (LAG). Please be aware that certain restrictions may<br/>apply based on your destination.",
                    ".destination", GetGuestDetails, CloseOverlayCallbackFunction, function () { LoadLists(2); }, 450, 200, false);
                } else { ValidateAgeDestination(); }
            } else { AddToCart(); }
        } else {
            if (sci.FlightInfoParam == null || sci.FlightInfoParam.FlightNumber == 0 || sci.FlightInfoParam.FlightNumber == "") {
                var FlightInfo = new FlightInfoParam;
                var flightDetails = $("#FlightDetails");
                FlightInfo.FlightAutoID = flightDetails.attr("data-flightID");
                FlightInfo.DestinationAirportCode = flightDetails.attr("data-airportCode");
                FlightInfo.DestinationCountryCode = flightDetails.attr("data-flightDest");
                FlightInfo.DepartureDatetime = flightDetails.find("#flightDate").val();
                sci.FlightInfoParam = FlightInfo;
            }

            if (sci.ProductParam.IsLAG == true || sci.ProductParam.IsAlcohol == true) {
                ValidateAgeDestination();
            } else { AddToCart(); }
        }
    }

    function ValidateAgeDestination() {
        if (sci.MemberAge < parseInt(LAG_AgeLimit) && sci.ProductParam.AgeLimit == true && sci.ProductParam.IsAlcohol == true) {
            modal.showFree("Alcoholic item", "Sorry, you have to be of legal age to purchase this product.", CloseOverlayCallbackFunction, "auto", 100);
        } else {
            modal.closeAll();
            if (IsDestinationLAGProhibited(sci.FlightInfoParam.DestinationCountryCode, LAG_ProhibitedCountry)) {
                modal.showFree("LAGs item", "You have picked a LAGs item. Unfortunately, the Online Retail service <br /> is unable to fulfill orders where the destination is to Australia or America. <br />Please check-in earlier to make your purchase at the outlet.", CloseOverlayCallbackFunction, "auto", 135);
            } else if (sci.ProductParam.IsAlcohol == true) {
                var destination = ((sci.FlightInfoParam.DestinationAirportCode != null && sci.FlightInfoParam.DestinationAirportCode != "") ? sci.FlightInfoParam.DestinationAirportCode : sci.FlightInfoParam.DestinationCountryCode);
                var sData = { Destination: sci.FlightInfoParam.DestinationAirportCode };
                $.ajax({
                    type: "POST",
                    data: JSON.stringify(sData),
                    url: wsHubPath + "WSHub/wsShoppingCart.asmx/GetLAGLiquorMsgByAirportCode",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                }).done(function (data) {
                    data = $.parseJSON(data.d);
                    var msg = "";
                    if (data != "") {
                        msg = "Duty-free allowance for <u>" + sci.FlightInfoParam.DestinationCountryCode + "</u> is<br /><i>" + data + "</i>.<br />Purchases exceeding the allowance might be subjected to duty upon arrival.";
                    } else {
                        msg = "You have picked an alcoholic item. As your destination<br />is <u>" + sci.FlightInfoParam.DestinationCountryCode + "</u>, please<br />take note of the LAG (Liquids, Aerosols, and Gels)<br />restrictions at your travel destination.<br />Purchases exceeding the allowance might be<br />subjected to duty upon arrival."
                    }
                    modal.showConfirm("Alcoholic item", msg, AddToCart, CloseOverlayCallbackFunction, 430, 100);
                });
            } else { AddToCart(); }
        }
    }

    function GetGuestDetails() {
        if (sci.ProductParam.IsAlcohol == true) {            
            var day = parseInt($("div.inputs.bday").find("select.bdayfield.dayPicker").val());
            var mth = parseInt($("div.inputs.bday").find("select.bdayfield.mthPicker").val());
            var year = parseInt($("div.inputs.bday").find("select.bdayfield.yearPicker").val());

            var d = new Date();
            var cMonth = d.getMonth() + 1;                
            var dob = year + '/' + mth + '/' + day;

            memberAge = d.getFullYear() - year;
            memberAge = memberAge - (mth + 1 > cMonth ? 1 : mth + 1 < cMonth ? 0 : day > d.getDate() ? 1 : 0);        
            sci.MemberDOB = dob;

            sci.MemberAge = memberAge;
            guestDOB = dob;
            guestAge = memberAge;

            sci.FlightInfoParam.DestinationAirportCode = $("#overlay-container2 div.quicklook.withInputs").find("div.inputs.bday select.country").val();
            sci.FlightInfoParam.DestinationCountryCode = $("#overlay-container2 div.quicklook.withInputs").find("div.inputs.bday select.country :selected").text();
        } else {
            sci.FlightInfoParam.DestinationAirportCode = $("#overlay-container2 div.quicklook.withInputs").find("div.inputs.destination select.country").val();
            sci.FlightInfoParam.DestinationCountryCode = $("#overlay-container2 div.quicklook.withInputs").find("div.inputs.destination select.country :selected").text();
        }
        
        guestDest = sci.FlightInfoParam.DestinationCountryCode;       
        ValidateAgeDestination();
    }

    function UpdateGuestDetails() {
        var sData = { GuestAutoID: sci.MemberAutoID, BirthDate: sci.MemberDOB, Destination: guestDest, Name: "", EmailAddress: "", Passport: "", FlightAutoID: "", FlightDate: "", NewsLetter: false };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsMember.asmx/UpdateGuestDetails",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {}
        });
    }

    function IsDestinationLAGProhibited(FlightDestination, ProhibitedCountries) {
        var countries = ProhibitedCountries.split(",");
        for (var x = 0; x < countries.length; x++) {
            if (FlightDestination.search(countries[x]) >= 0) { return true; }
        }
        return false;
    }

    function AddToCart() {
        var IsGuest = $.cookie("IsGuest") != null ? $.cookie("IsGuest") : "false";
        if ((IsGuest == "true" || IsGuest == true) && guestDOB != "") { UpdateGuestDetails(); }

        var options = [];
        for (var x = 0; x < sci.ChosenAttributeSet.length; x++) {
            options.push({ id: sci.ChosenAttributeSet[x].AttributeAutoID, value: sci.ChosenAttributeSet[x].AttributeOptionAutoID });
        }

        var sData = { group: sci.ProductGroupAutoID, langType: $.cookie("Language"), retailer: sci.RetailerAutoID, options: options, type: "cart", qty: sci.Quantity, flightAutoID: (sci.FlightInfoParam.FlightAutoID == 0 ? null : sci.FlightInfoParam.FlightAutoID), flightDate: (sci.FlightInfoParam.FlightAutoID == 0 ? null : sci.FlightInfoParam.DepartureDatetime), flightDest: guestDest };
        $.ajax({
            type: "POST",
            data: JSON.stringify(sData),
            url: wsHubPath + "WSHub/wsShoppingCart.asmx/CreateShoppingCartItem2",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (result) {
            result = $.parseJSON(result.d);
            switch (result.status) {
                case 0:
                    {
                        modal.showFree("Information", "Item(s) added to cart.",
                        function () {
                            CloseOverlayCallbackFunction();
                            //add to cart from the recommended/recent/wishlist tab
                            if (window.location.href.search("ShoppingCart") > -1) {
                                $shoppingCartPg.ClearCart();
                                $shoppingCartPg.init();
                            }
                        }, 400, 100);
                        var cartItem = { cartID: result.cartID, name: sci.ProductGroupTitle, image: sci.ProductGroupImage, qty: sci.Quantity, retailerID: sci.RetailerAutoID, productgroupID: sci.ProductGroupAutoID, branddtlurl: sci.BrandDetailUrl, brandID: sci.ProductParam.BrandAutoID };
                        cartPanel.setCartCookie(sci.MemberAutoID, cartItem, true);
                        guestDOB = (sci.ProductParam.IsAlcohol == true) ? "" : guestDOB; guestDest = "";
                        break;
                    }
                case 1:
                    {
                        modal.showFree("Error", "Sorry, we were unable to add the item to your cart. Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", CallbackFunction, "auto", 110);
                        break;
                    }
            }
        });
    }

    function LoginCallbackFunction() {
        if ($("#overlay-container")) $("#overlay-container").fadeOut(1000);
        var touchHover = TouchHoverHandler;
        touchHover(null, $("#nav-right").find("div.dropdown"));
        $("#nav-right").find("div.dropdown").find(" input[name='email']").focus();        
    }

    function CloseOverlayCallbackFunction() {
        //TODO: need to check for branding later        
        if ($("#ProductDetails").html() == undefined) {
            if ($("#overlay-container2")) {
                $('body').css({ 'overflow': 'visible' });
            }
            if ($(overlayID)) { $(overlayID).fadeOut(1000); }
        } else {
            if ($("#FlightDetails")) {
                $('body').css({ 'overflow': 'visible' });
                $("#FlightDetails").fadeOut(1000);
                $(overlayID).fadeOut(1000);
            }
        }
    }

    function CallbackFunction() { return false; }
    function CloseOverlay() { if ($("#overlay-container")) $("#overlay-container").fadeOut(1000); }

    function ContinueAsGuest() {
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsMember.asmx/CreateGuestAccount",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (result) {
            if (result.d != null && result.d != "") {
                PerformValidation();
            }
        });
    }

    function LoadLists(Both) {
        LoadCountries(); if (Both==1) LoadCalendar();
        var holder = $("#overlay-container2 div.quicklook.withInputs");
        var fields = holder.find("div.inputs div.fields");
        holder.find("a.confirmbt").addClass("disabled");
        fields.change(function () {
            if (holder.find("div.inputs.bday").css("display") == "block") {
                var day = holder.find("div.inputs.bday").find("select.bdayfield.dayPicker").val();
                var mth = holder.find("div.inputs.bday").find("select.bdayfield.mthPicker").val();
                var year = holder.find("div.inputs.bday").find("select.bdayfield.yearPicker").val();
                var ctry = holder.find("div.inputs.bday select.country");
                if (day == '' || mth == '' || year == '' || ctry.val() == '' || ctry.prop("selectedIndex") == 0) {
                    holder.find("a.confirmbt").addClass("disabled");
                } else { holder.find("a.confirmbt").removeClass("disabled"); }
            } else {
                var ctry = holder.find("div.inputs.destination select.country");
                if (ctry.val() == '' || ctry.prop("selectedIndex") == 0) {
                    holder.find("a.confirmbt").addClass("disabled");
                } else { holder.find("a.confirmbt").removeClass("disabled"); }
            }
        });
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
        var holder = $("#overlay-container2 div.quicklook.withInputs");
        var sel = (holder.find("div.inputs.bday").css("display") == "block") ? holder.find("div.inputs.bday") : holder.find("div.inputs.destination");
        var selMonth = sel.find("select.bdayfield.mthPicker").val() - 1;
        var selYear = sel.find("select.bdayfield.yearPicker").val();
        var days = getNumberOfDays(selYear, selMonth);
        var day = sel.find("select.bdayfield.dayPicker").val();
        sel.find("select.bdayfield.dayPicker").empty();
        for (var i = 1; i <= days; i++) {
            sel.find("select.bdayfield.dayPicker").append($('<option />').val(i).html(i));
        }
        if (days == undefined) {
            for (var i = 1; i <= 31; i++) {
                sel.find("select.bdayfield.dayPicker").append($('<option />').val(i).html(i));
            }
        }
        if (day != null || day != '') { sel.find("select.bdayfield.dayPicker").val(day); }
    }

    function LoadCountries() {
        $.ajax({
            type: "POST",
            url: wsHubPath + "WSHub/wsFlight.asmx/GetFlightDestinationCountries",
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (result) {
            if (result.d == null) return;
            var list = $.parseJSON(result.d);
            if (list != null) {
                var country = $("#overlay-container2 div.quicklook.withInputs").find("select.country");
                country.empty();
                country.append("<option>&nbsp;</option>");
                for (var i = 0; i < list.length; i++) {
                    country.append($('<option />').val(list[i].substring(list[i].search("\\(")).replace("(", "").replace(")", "")).html(list[i]));
                }
                if (sci.FlightInfoParam.DestinationAirportCode != null && sci.FlightInfoParam.DestinationAirportCode != "") {
                    country.val(sci.FlightInfoParam.DestinationAirportCode);
                }
            }
        });
    }
}

var $CartService;
$(document).ready(function () {
    $CartService = new CartService();
});
