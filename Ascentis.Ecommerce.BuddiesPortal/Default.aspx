<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
<script src="JS/init_fb.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

<input type="text" id="accesstoken" />

<div id="userDetail"></div>

<div id="friendsUsingAppPreview" onclick="$('#friendsUsingApp').dialog('open');" style="border:1px solid #000000; margin: 20px; width:400px;">
<div style="height: 21px;">Friends using this app.</div>
</div>

<div id="friendsUsingApp">
</div>

<div id="result"></div>

<input id="btnRemoveAllPermission" type="button" value="button" onclick="remove_all_permission();" />
<input id="btnCreate" type="button" value="Create Wishlist" onclick="create_wishlist();" />
<input id="wishlistID" type="text" />
<input id="btnShare" type="button" value="Share Wishlist" onclick="share_wishlist();" />

<div id="fb-root"></div>
</asp:Content>