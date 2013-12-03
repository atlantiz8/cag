<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="ProductListings.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Product.ProductListings" %>
<%--<%@ OutputCache CacheProfile="OutputCacheProfile" VaryByParam="*" %>--%>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../CSS/productlistings.css" />
	<link rel="stylesheet" href="../CSS/960.css" />	
    <script src="../JS/home1a.js" type="text/javascript"></script>
    <script src="../JS/ascentis/LanguageEN_US.js" type="text/javascript"></script>
    <script src="../JS/ascentis/LaunchingPage.js" type="text/javascript"></script>
    <script src="../JS/ascentis/ProductListings.js" type="text/javascript"></script>
    <script src="../JS/pagination.js" type="text/javascript"></script>
    <style  type="text/css">

    #pagination div.holder div.holder ul li a.ploader{
        background: url("../img/loader/white.gif") no-repeat scroll 14px 13px transparent !important;    
        }
    #sorting {font-family:"myriad-pro", Arial, Helvetica, sans-serif;margin-top:-2px}
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ItemFixedSplashholer" runat="server">
    	<div id="header">
        	<div class="masterhead">
            	
                <div class="content">
                    <div class="category"><h1>&nbsp;</h1></div>
                    <div class="clear"></div>
                    <div class="breadcrumbs">&nbsp;</div>
                </div>
                
                <ul class="pagination">
                    <li>Sort by</li>
                    <li><select id="sorting"></select></li>
                	<li>
                        <asp:Localize ID="lclItemsPerPage" runat="server" Text="<%$Resources:lang,ItemsPerPage %>"></asp:Localize>:
                    </li>
                    <li><a href="#" data-index="30" class="active">30</a></li>
                    <li><a href="#" data-index="50">50</a></li>
                    <li><a href="#" data-index="100">100</a></li>	
           		</ul>
            
            <div class="clear"></div>
            </div>
            <div class="searchresults"></div>
			<%--<div class="searchresults">Sorry but <span class="bold">Watche</span> returns <span class="bold">0</span>&nbsp;results.  <a class="suggest"></a>&nbsp;</div>--%>
            
            <div class="clear"></div>
		</div>	
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ItemProductPresentHolder" runat="server">
        <div id="container">
        </div>       
          <div id="ProductHelp" style="display:block;position:relative;height:40px;text-align: center;font-size:13px;font-weight: 400;">
          Can't find a product? <a href="">Contact us</a> and let us help!</div> 
        <div id="pagination">
        </div>
</asp:Content>
