function WishlistService() {
    this.AddToWishlistHandler = AddToWishlistHandler;
    this.SetWishlistMenu = SetWishlistMenu;

    var ws = null, overlayID = "#overlay-container";
    this.OverlayDivID = overlayID;

    function AddToWishlistHandler(WishlistParam) {
        ws = WishlistParam;
        if (WishlistParam.MemberAutoID != 0 && WishlistParam.MemberAutoID != undefined && WishlistParam.MemberAutoID != null && WishlistParam.MemberAutoID != "") {
            var sData = { memberID: "" + WishlistParam.MemberAutoID + "", productGroupID: "" + WishlistParam.ProductGroupAutoID + "", index: "" + WishlistParam.WishlistIndex + "" }
            //ws = WishlistParam;
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(AddToWishlistDone);
        } else {
            //modal.showFree("Login required", "Please login or signup to proceed.<br/>If you do not have an existing account, please sign up for one.", LoginCallbackFunction, "auto", 110);
            modal.showThreeButtons("Login required", "Please login or signup to proceed.<br />Or you may wish to continue shopping as a guest user.",
                function () { window.location.href = wsHubPath + "Member/Register.aspx"; },
                LoginCallbackFunction,
                function () { AddToWishlistAsGuest(WishlistParam.ProductGroupAutoID, WishlistParam.WishlistIndex) },
                function () { },
                520, 110);
        }
    }

    function AddToWishlistAsGuest(groupid, wishlistindex) {
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
                    ws.MemberAutoID = member;
                    var sData = { memberID: "" + member + "", productGroupID: "" + groupid + "", index: "" + wishlistindex + "" };
                    $.ajax({
                        type: "POST",
                        data: JSON.stringify(sData),
                        url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    }).done(AddToWishlistDone);
                },
                error: function (er) {
                    //alert(er.Message);
                }
            });
        }
        else {
            ws.MemberAutoID = member;
            var sData = { memberID: "" + member + "", productGroupID: "" + groupid + "", index: "" + wishlistindex + "" };
            $.ajax({
                type: "POST",
                data: JSON.stringify(sData),
                url: wsHubPath + "WSHub/wsMember.asmx/AddToWishlist",
                contentType: "application/json; charset=utf-8",
                dataType: "json"
            }).done(AddToWishlistDone);
        }
    }

    function AddToWishlistDone(e) {
        var p = $.parseJSON(e.d);
        var member = $.cookie("memberID");
        var data = $.cookie("wishlistData_" + member);
        var count = 0;
        if (data) {
            data = $.parseJSON(data);
            if (data != null) {
                count = data.count == undefined ? 0 : data.count;
            }
        }

        if (p == 1 || p == 2) {
            if (p == 1) { count += 1; }
            else { count = wishlistAllCount; }

            var str = "{\"count\":" + count + ",\"items\":[";
            str += "{\"id\":\"" + ws.ProductGroupAutoID + "\", \"retailID\":\"" + ws.RetailerAutoID + "\", \"name\":\"" + ws.ProductGroupTitle + "\",  \"image\":\"" + ws.ProductGroupImage + "\", \"branddetailurl\":\"" + ws.BrandDetailUrl + "\", \"brandID\":\"" + ws.BrandAutoID + "\" },";

            if (data && data.items && data.items.length > 0) {
                var len = data.items.length;
                if (len > 0) {
                    for (var i = 0; i < len; i++) {
                        if (i > (wishlistAllCount - 2)) {
                            break;
                        }
                        var tData = data.items[i];
                        str += "{\"id\":\"" + tData.id + "\", \"retailID\":\"" + tData.retailID + "\", \"name\":\"" + tData.name + "\",  \"image\":\"" + tData.image + "\", \"branddetailurl\":\"" + tData.branddetailurl + "\", \"brandID\":\"" + ws.BrandAutoID + "\" },";
                    }
                }
            }
            str = str.substring(0, str.length - 1);
            str += "]}";

            $.cookie("wishlistData_" + member, str, {
                path: "/"
            });

            data = $.parseJSON(str);
            SetWishlistMenu(data);
        }

        switch (p) {
            case 1:
                modal.showFree("Information", "Item added to wishlist.", CloseOverlayCallbackFunction, 400, 100);
                break;
            case 2:
                modal.showFree("Information", "Item added to wishlist. <br />Please note that only most recent " + (wishlistAllCount > 0 ? wishlistAllCount : 20) + " items can  be saved in your wishlist.", CloseOverlayCallbackFunction, 500, 130);
                break;
            case 3:
                modal.showFree("Information", "This product already exists on your wishlist.", CloseOverlayCallbackFunction, "auto", 100);
                break;
            default:
                modal.showFree("Error", "Please try again later.<br />Should this problem persists, please contact us at enquiry@changiairport.com.", function () {
                    return false;
                }, "auto", 110);
                break;
        }

    }

    function SetWishlistMenu(data) {
        var target = $("#filter div.right div.wishlist-btn");
        target.find("div.count").html(data.count);
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

    function LoginCallbackFunction() {
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
        }
    }

    function CallbackFunction() { return false; }
}

var $WishlistService;
$(document).ready(function () {
    $WishlistService = new WishlistService();
});