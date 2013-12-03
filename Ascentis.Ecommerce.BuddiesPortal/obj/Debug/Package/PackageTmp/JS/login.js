var target;
var panel;
var isTouch;
var touchHover = TouchHoverHandler;
var _htmlBody;
var btn_account;
var btn_account_span;

function showPanel(e) {
    e.preventDefault();
    //touchHover(null, panel); //Merged with Kilo by glaissa, aug 07 2013
    panel.addClass("hover");
}

function hidePanel(e) {
    e.preventDefault();

    //    if (isTouch) { //Merged with Kilo by glaissa, aug 07 2013
//        _htmlBody.unbind("mousedown", hidePanel);
//    }
    panel.removeClass("hover");
}

function loadLoginDONE(status) {
    //console.log("loadLoginDONE :", status);

    panel = $('#nav-right').find('div.dropdown');
    panel.find("div.content a.loginbt div.text").css({ display: "block" });
    panel.find("div.content a.loginbt div.loader").css({ display: "none" });

    switch (status) {
        case "0":
            swapAccountContent();

            break;
        case "1":
            panel.find("div.content div.error").css({ display: "block" });
            break;
    }
}

function swapAccountContent() {
    //var linkPanel = target.find("div.panel a.account span");
    btn_account = target.find("div.panel a.account");
    btn_account_span = btn_account.find("span");
    var linkPanel = btn_account_span;
    linkPanel.text("Account");

    var panelContent = panel.find("div.content");
    //panelContent.replaceWith(accountContent);
    TweenMax.to(panelContent.children(), 0.6, { css: { autoAlpha: 0 }, onComplete: swapIntroAniDone, ease: Power4.easeOut });

}
function swapIntroAniDone() {
    var panelContent = panel.find("div.content");
    var accountContent = target.find("div.template div.after").children().clone();
//    console.log("accountContent:" + accountContent.find(".editflightbt").html());
    panelContent.html(accountContent);
    TweenMax.to(panelContent.children(), 1.2, { css: { autoAlpha: 1 }, ease: Power4.easeOut });

    setAccountBts()
}

function onLogoutLoadDone(tData) {
    //console.log("Logout");
    //var linkPanel = target.find("div.panel a.account span");
    btn_account = target.find("div.panel a.account");
    btn_account_span = btn_account.find("span");

    var linkPanel = btn_account_span;
    linkPanel.text("Log In");

    var panelContent = panel.find("div.content");
    TweenMax.to(panelContent.children(), 0.6, { css: { autoAlpha: 0 }, onComplete: onlogOutSwapAniDone, ease: Power4.easeOut });
}

function onlogOutSwapAniDone() {
    var panelContent = panel.find("div.content");
    var tContent = target.find("div.template div.loginT").children().clone();
    //console.log("onLogOutClick :", panelContent);
    panelContent.html(tContent);

    setLoginScreenBts()

    TweenMax.to(panelContent.children(), 1.2, { css: { autoAlpha: 1 }, ease: Power4.easeOut });
}

function setLoginScreenBts() {
    panel.find("a.close").click(hidePanel);  //Merged with Kilo by glaisa, aug 07 2013
    //panel.find("div.content div.login a.loginbt").click(onLoginClick);

    $("#txtPwd").keypress(function (e) {
        var input = e.keyCode;
        if (input == 13) {
            if (window.location.href.search('/Brands/') > -1) {
                try {
                    GetSelectedProduct();
                } catch (ex) { }
            }
            $('#hdPwd').val(userPwd(this.value));
            CheckGuestCartWishlist();            
        }
        return true;
    });

    $("a#login").click(function () {
        if (window.location.href.search('/Brands/') > -1) {
            try {
                GetSelectedProduct();
            } catch (ex) { }
        }

        CheckGuestCartWishlist();
        return false;
    });
}

function CheckGuestCartWishlist() {
    var IsGuest = false, guestID = "", cartItems = "", wishlistItems = "";
    if ($.cookie("IsGuest") != null) IsGuest = $.cookie("IsGuest");
    if ($.cookie("memberID") != null) guestID = $.cookie("memberID");
    if ($.cookie("Cart-" + guestID) != null) cartItems = $.cookie("Cart-" + guestID);
    if ($.cookie("wishlistData_" + guestID) != null) wishlistItems = $.cookie("wishlistData_" + guestID);

    if ((IsGuest == "true" || IsGuest == true) && (cartItems != "" || wishlistItems != "")) {
        $("#txtPwd").val('');        
        $("#hdReplaceCart").val("true");
        __doPostBack('ctl00$login', '');
        return false;

    } else {
        $("#txtPwd").val(''); 
        $("#hdReplaceCart").val("false");
        __doPostBack('ctl00$login', '');
        return true; 
    }
}

function setAccountBts() {
    panel.find("a.close").click(hidePanel); //Merged with Kilo by glaisa, aug 07 2013
    //panel.find("div.content a.logoutbt").click(onLogOutClick)
    target.find("div.content a.myaccountbt").click(function () {
        window.location.href = wsHubPath + "Member/MyAccount.aspx";
    });
}

function Login(tTarg) {
    target = tTarg;
    this.init = init;

    function init() {
        _htmlBody = $("html, body");

        isTouch = IS_TOUCH;
        btn_account = target.find("div.panel a.account");
        btn_account_span = btn_account.find("span");

        //btn_account.bind(!isTouch ? "mouseenter" : "mouseleave", showPanel); //Merged with Kilo by glaisa, aug 07 2013
        if (isTouch) btn_account.mousedown(showPanel);
        if (!isTouch) btn_account.mouseenter(showPanel);

        panel = target.find("div.dropdown");

        panel.children().mousedown(stopEvent); //Merged with Kilo by glaisa, aug 07 2013
        btn_account.mousedown(stopEvent);

        if (!isTouch) panel.mouseleave(hidePanel);
        setLoginScreenBts();
        setAccountBts();
        //console.log(panel);

    }

    function stopEvent(e) {
        if (!$(e.target).hasClass("closing")) e.stopPropagation();
    }
}

//ascentis-glaissa added may 06 2013
function userPwd(val) {
    return $.sha256(val); 
    //return val;
}

$(document).ready(function () {
    var login = new Login($("#nav-right"));
    login.init();
});


