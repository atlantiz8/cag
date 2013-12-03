<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="Product.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Product.ProductPage" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
  
    <link rel="stylesheet" href="../CSS/product.css" />
    <link rel="stylesheet" href="../CSS/960.css" />
    <script type="text/javascript" src="../JS/wishlist.js"></script>
    <script type="text/javascript" src="../JS/extraspanel.js"></script>
    <script type="text/javascript" src="../JS/login.js"></script>
    <script type="text/javascript" src="../JS/ascentis/LanguageEN_US.js"></script>
    <script type="text/javascript" src="../JS/ascentis/LaunchingPage.js"></script>
    <%--<script type="text/javascript" src="../JS/ascentis/Product.js"></script>--%>
    <script type="text/javascript" src="../JS/productoptions.js"></script>
    <script type="text/javascript" src="../JS/productdetails.js"></script>
   <%-- <script type="text/javascript" src="../JS/ascentis/RecommendRecent.js" ></script>--%>
   <script type="text/javascript">
       $(function () {
           $("#testhr").tooltip({
               
               position: {
                   my: "left center",
                   at: "right+10 center"
               },
               tooltipClass: "entry-tooltip-positioner",
                              
           });
       });
</script> 
<style type="text/css"> 
/* .ui-tooltip{
            max-width: 290px;
            width: 290px;
            height:45px;
          
           }
       
          .ui-tooltip-content{
            background-color: #ffff00;
              margin:1px;
              border:1px;
              padding:1px;
              text-align:center;          
            }
           
             .tooltip.top    { margin-top: -15px;padding:1px; }
.tooltip.right  { margin-left: 1px;padding:1px; }
.tooltip.bottom { margin-top: 1px; padding:1px;  }
.tooltip.left   { margin-left: -5px;padding:1px; } */
.entry {
    position: relative;
    right: -200px;
    width: 300px;
}
.entry-tooltip-positioner {
    position: relative !important;
    /* left: 800px !important;*/
   right:10px;
   top:-10px;
}

</style>
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ItemFixedSplashholer" runat="server">
      <div id="header">
        <div class="masterhead">
            
            <div class="content">
                <div class="category"><h1>Product Details</h1></div>
                <div class="clear"></div>
                <!--mili, 20130207, hide breadcrumbs-->
                <div class="breadcrumbs">Home  /  Product</div>
            </div>
            
        <div class="clear"></div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ItemProductPresentHolder" runat="server">
    <div id="wrapper"><%-- Merged with Kilo 20130227 version by ChenChi --%>
    	<div class="container_16">
        	
            <div class="clear"></div>
            
            <%--<div class="grid_8">
            	
            </div>--%>
            <div class="grid_8" id="ProductSlideshowHolder">
				<div id="product-slideshow">
					<div class="container">
						<div class="img-container">
							<img src="" class="image" />					
						</div>
					</div>
				</div>
                <ul class="controls">
                	<a href="#" class="active"><li>1</li></a>
                    <a href="#"><li>2</li></a>
                </ul>
                <div class="zoom"><img src="../img/icon/zoom.png" height="9" width="9" class="icon"/><span id="hover-to-zoom">Hover To Zoom</span></div>
                <div class="alert" style="display:none"><%--request by user--%>
                	<a href="#"><img src="../img/icon/alert.png" height="13" width="17" class="icon"/>Click for more info.</a>
                    <div class="clear"></div>
                    *This item is a LAG, the chosen country of destination requires product to be collected at Collection Centre.
                </div>
				
				
            </div>
            
           	<%--<div class="grid_8 details" id="ProductDetails">
                
            </div>--%>
            <div class="grid_8 details" id="ProductDetails" data-id="123" data-isLAG="0" data-isAgeLimit="0" data-memberAge="0">
				 <div id="product-zoomer">
					<img src="../img/products/item_2.jpg" />
				</div>
            	<div class="name"></div>
                
                <div class="clear"></div>
                
                <div class="prices">
                   <ul class="title ui-pricelabels">
                        <li class="promo" style="display:none">Promo Price</li>
                        <li class="origi" style="display:none;font-size:14px;font-weight:bold;">Airport Price</li>
                        <%-- wlh added on Aug 30 2013 : need to change text when CAG confirm now temporialy add descrpition--%>
                        <li class="downtown" style="display:none">List Price (<a id="testhr" href="#" title="iShopChangi displays the average price of this product found at key international airports in the Asia-Pacific region (spirits), or the recommended retail prices downtown (other products)." >?</a>)<div style="display:none;">iShopChangi displays the average price of this product found at key international airports in the Asia-Pacific region (spirits), or the recommended retail prices downtown (other products).</div></li> 
                        <li class="saving" style="display:none;color:#e16a58;">Savings</li>
                    </ul>
                    
                    <ul class="price ui-prices">
                        <li class="promo"><span class="ui-price"></span></li>
                        <li class="origi"><span class="ui-price" style="font-size:14px;font-weight:bold;"></span></li>
                        <li class="downtown"><span class="ui-price"></span></li>
                        <li class="saving"><span class="ui-price" style="color:#e16a58;"></span></li>
                    </ul>
                </div>
                
                <div class="clear"></div>
                
                
                <div class="selection" id="ProductOptions">
					<!--
                	<ul class="options retailers" data-id="0" data-type="retailer">
						<h1>Retailers</h1>
						<div class="list">	
							<li class="selected" data-id="0" data-value="0">Retailer 1</li>
							<li data-id="1" data-value="1">Retailer 2</li>
						</div>
						<div class="clear">	</div>
					</ul>
					<ul class="options radio" data-type="radio" data-id="1">
	                	<h1>Color</h1>
	                    <div class="list">
							<li data-id="0" data-value="0">Red</li>
							<li data-id="1" data-value="1" class="inactive" >Green</li>
							<li data-id="2" data-value="2">Blue</li>
							<li data-id="3" data-value="3">Purple</li>
							<li data-id="4" data-value="4">Orange</li>
						</div>
						<div class="clear"></div></ul>
						
					<ul class="options radio" data-type="radio" data-id="2">
	                	<h1>Combo List</h1>
	                    <div class="list">        	
							<li data-id="0" data-value="0">A</li>
							<li data-id="1" data-value="1">B</li>
							<li data-id="2" data-value="2">C</li>
							<li data-id="3" data-value="3">D</li>
						</div>
	                <div class="clear"></div></ul>
					<ul class="options input" data-type="input" data-id="999">
	                	<h1>Quantity</h1>
						<input name="quantity" type="text" value="1" class="stock"></input>  
						<span class="stocktext" style="visibility: visible;">&nbsp;&nbsp;In stock: <span class="stocklabel">12</span></span>
	                </ul><div class="clear"></div>
					-->  <!-- if input isn't stock-related, take out: class="stock". -->
                </div>
                
                <div class="clear"></div>
                
                <div class="buttons">
                	<%--<a class="button soldout">
                        <div class="text">Sold Out</div>
                    </a>--%>
                    
                    <a href="#" class="button red ui-submit disabled">
                        <div class="text"><img class="icon" src="../img/icon/cart.png">Add To Cart</div>
                        <div class="loader"></div>
                    </a>
                    
                    <a class="button white ui-wishlist">
                        <div class="text"><img class="icon" src="../img/icon/wishlist_brown.png">Add To Wishlist</div>
                        <div class="loader"></div>
                    </a>
                    
                </div>
                
                <div class="clear"></div>
                
                <div class="content expand">
                	<a class="minimize">Overview</a>
                    <div class="clear"></div>
                    <span class="text overview">
                    
                    </span>
                    <div class="clear"></div>
                </div>
                
                <div class="content mini">
                	<a class="maximize">Product Description</a>
                    <span class="text details">
                    
                    </span>
                    <div class="clear"></div>
                </div>
                
                <div class="content mini" style="display:none"><%--hide: requested by users--%>
                	<a class="maximize">Collection & Return Policy</a>
                    <span class="text policy">
                    
                    </span>
                    <div class="clear"></div>
                </div>
                
            </div>

            
            <div class="clear"></div>
            
        </div>
        
        <div class="extras" id="tabRowHolder">
        	<div class="container_16">
            
                <div class="grid_16">
                    
                    <ul class="nav">
                    	<li class="active">
                            <asp:Localize ID="lclRecommended" runat="server" Text="<%$Resources:lang,RecommendedItems %>"></asp:Localize>
                        </li>
                        <li>
                            <asp:Localize ID="Localize1" runat="server" Text="<%$Resources:lang,RecentlyViewedItems %>"></asp:Localize>
                        </li>
                        <div class="clear"></div>
                    </ul>
                    
                    <div class="clear"></div>
                    
                    
                	<div class="arrows">
                        <a class="right"></a>
                        <a class="left"></a>
                        <div class="clear"></div>
                    </div>
                        
                    <div class="holder">
                    	<div class="panel" id="container2">
	                      	
	                        <ul class="recommended-items">
	                            
	                    	</ul>
	                        
	                        <div class="clear"></div>
	                        
	                        <ul class="recent-items">
	                            
	                    	</ul>
	                        
                    	</div>    
                    
                    </div>
                    
                        
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</asp:Content>
