<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CitibankGateway.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Checkout.CitibankGateway" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <script type="text/javascript" src="../JS/libs/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="../JS/libs/jquery-ui-1.9.1.custom.min.js"></script>
    <script type="text/javascript" src="../JS/libs/easing/EasePack.min.js"></script>
    <script type="text/javascript" src="../JS/libs/TweenMax.min.js"></script>	
    <style type="text/css">
    body {margin:0;padding:0;font-family:"myriad-pro", Arial, Helvetica, sans-serif; font-weight:400; color:#605143; font-size:17px;}
    .content1 {width:80%; margin:0 20px 20px;}
    .content2 { width:90%;  margin:0;}
    </style>
    <script>
        function centerBox(target) {
            var tX = $(window.parent).width() * 0.5 - target.width() * .5;
            var tY = $(window.parent).scrollTop() + $(window.parent).height() * 0.5 - target.height() * .5;
            target.css({ left: tX, top: tY });

            TweenMax.to($('#overlay-container2', window.parent.document), 1, { css: { autoAlpha: 1} });
            TweenMax.to($('#overlay-container2 div.default', window.parent.document), 1, { css: { autoAlpha: 1} });
        };
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>

    </div>
    </form>
    <script type="text/javascript">
        <% =JsEvalString %>
    </script>
</body>
</html>
