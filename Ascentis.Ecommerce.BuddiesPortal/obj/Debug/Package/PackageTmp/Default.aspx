<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/LandingPage.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
<script src="JS/init_fb.js" type="text/javascript"></script>
<script src="//connect.facebook.net/en_UK/all.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

<input type="text" id="accesstoken" />

<div id="userDetail"></div>

<div id="result"></div>

<input id="btnRemoveAllPermission" type="button" value="button" onclick="remove_all_permission();" />

<div id="fb-root"></div>
</asp:Content>


