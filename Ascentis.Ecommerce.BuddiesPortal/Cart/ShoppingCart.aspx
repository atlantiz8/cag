<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="ShoppingCart.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Cart.ShoppingCart" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../CSS/product.css" />
    <link rel="stylesheet" href="../CSS/960.css" />   
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="stylesheet" href="../css/shoppingcart.css">
    <link rel="stylesheet" href="../css/product.css">
    <style>
        #filter > .right > .button > .holder > .dropdown {margin-top:29px; }
    </style>

    <script type="text/javascript" src="../JS/ascentis/LanguageEN_US.js"></script>
    <script type="text/javascript" src="../JS/ascentis/LaunchingPage.js"></script>   
    <script src="../JS/ascentis/RecommendRecent.js" type="text/javascript"></script>
    <script src="../JS/shoppingcart.js" type="text/javascript"></script>
    <script src="../JS/extraspanel.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ItemFixedSplashholer" runat="server">
    <div class="notification error" style="display:none">
        <div class="clear"></div>
        <div class="text">
            
        <div class="clear"></div>
        </div>
    </div>
    <div id="header">
        <div class="masterhead">
           
            <div class="content">
                <div class="category"><h1>Cart</h1></div>
                <div class="clear"></div>
                <div class="breadcrumbs">Home  /  Cart</div>
            </div>
            
        <div class="clear"></div>
        </div>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ItemProductPresentHolder" runat="server">
    	<div class="container_16">
        <div class="cart">
            <div class="grid_16">
                <ul class="titlebar" style="font-size:13px">
                    <li>Item</li>
                    <li style="margin-left:255px;">Options</li>
                    <li style="margin-left:165px;">Quantity</li>
                    <li style="margin-left:100px;">Unit Price</li>
                    <li style="float:right;">Total</li>
                </ul>
            </div>
            
            <div class="clear"></div>
			
            <div class="grid_16">
                <div class="content">
                    <div class="template" style="display:none;">
                        <div class="groupbox">
                    
                            <div class="groupbar">
                                <div class="groupheader"></div>
                                <%--<ul class="groupvoucher">
                                    <li>E-coupon:</li>
                                    <li>
                                        <select type="" name="groupvoucher">
                                            <option>E-Coupon 1</option>
                                            <option>E-Coupon 2</option>							    
                                        </select>
                                    </li>
                                </ul>--%>
                                <div class="clear"></div>
                            </div>
                    
                            <div class="item row" id="0" style="display:none; width:918px;padding:20px 10px;position:relative; border-bottom:1px solid #dddad6;">
                                <div class="itemimg"><img height="59px" width="59px" src="" class="img" /></div>
                        
                                <div class="itemdes">
                                    <li><h1 class="itemname"></h1></li>
                                    <li class="itemnum"></li>
                                    <li class="alert" style="display:none">
                                        <a><img src="../img/icon/alert.png" height="13" width="17" class="icon"/>More info</a>
                                        <div class="clear"></div>
                                       <div class="msg"> *This item is a LAG, the chosen country of destination requires product to be collected at Collection Centre.</div>
                                    </li>
                                </div>
                        
                                <div class="itemoption">
                            
                                    <ul class="name">
                                        <li></li>
                                        <%--<li>E-Voucher:</li>--%>
                                    </ul>
                            
                                    <ul class="selection">
                                        <li></li>
                                    </ul>
                            
                                    <div class="clear"></div>
                            
                                    <%--<select type="" name="singlevoucher">
                                        <option>E-Coupon 1</option>
                                        <option>E-Coupon 2</option>
                                    </select>--%>
                            
                                </div>
                        
                                <ul class="itemqty">
                                    <li class="limitedQty" style="display:none"></li>
                                    <li><span class="oldValue" style="display:none"></span></li>
                                    <li><input type="text" name="itemqty" maxlength="6"></input></li>
                                    <div class="clear"></div>
                                    <li>
                                        <a class="simplebutton" href="#" id="0">
                                            <div class="text">Update</div>
                                            <div class="loader"></div>
                                        </a>
                                    </li>
                                    <li class="qtylag" style="display:none">* This item is not available in the desired quantity or not in stock.</li>
                                </ul>
                        
                                <ul class="itemunit">
                                    <li class="unitprice"></li>
                                    <li class="downtownprice">List Price: <span></span></li>
                                    <li class="gstsavings">GST Savings: <span class="savings"></span></li>
                                </ul>
                        
                                <div class="itemtotal"><span></span></div>
                        
                                <div class="clear"></div>	
                        
                                 <a class="simplebutton itemremove" href="#">Remove</a>

                            </div>
                    
                            <div class="clear"></div>                                       
                        </div>
                    </div>
                </div>
                
                <div class="clear"></div>
                
                <div class="endline"></div>
                
                <div class="clear"></div>
                
                <div class="grid_5 alpha">
                    <div class="flightinfo" style="margin-top:0">
                        <div class="titlebar"><div class="icon"></div>Flight Information</div>
                        <ul class="flightNo">
                            <li class="title">Flight No.</li>
                            <li class="info">&nbsp;</li>
                            <div class="clear"></div>
                        </ul>
                        <div class="clear"></div>
                        
                        <ul class="passport">
                            <li class="title">Passport No.</li>
                            <li class="info">&nbsp;</li>
                            <div class="clear"></div>
                        </ul>
                        <div class="clear"></div>
                        
                        <ul class="flightDest">
                            <li class="title">Destination</li>
                            <li class="info">&nbsp;</li>
                            <div class="clear"></div>
                        </ul>
                        <div class="clear"></div>
                        
                        <ul class="flightDate">
                            <li class="title">Flight Date</li>
                            <li class="info">&nbsp;</li>
                            <div class="clear"></div>
                        </ul>
                        <div class="clear"></div>
                        
                        <ul class="flightTime">
                            <li class="title">Departure Time</li>
                            <li class="info">&nbsp;</li>
                            <div class="clear"></div>
                        </ul>
                        <div class="clear"></div>
                        
                        <div style="float:right;margin-right:18px;">
                            <ul>
                                <li><a class="updatebtn">Update</a></li>
                            </ul>                        
                        </div>
                        
                        <div class="clear"></div>
                    </div>
                </div>
                
                <div class="grid_8 push_3" style="width:472px">
                	<div class="ecoupon">
                        <ul class="promo" style="margin-left:19px"><li style="margin-top:7px">Promotion Code:&nbsp;&nbsp;</li></ul>
                        <ul><li><input type="text" id="promocode" maxlength="20"></input></li></ul>
                        <div class="clear"></div>
                    </div>
                    
                    <div class="clear"></div>
                    
                    <div class="total">
                    	<ul class="titles">
                        	<li>Total Savings</li>
                            <%--<li>Total Points Earned</li>--%>
                            <%--<li>
                            	<div class="text">Total E-Coupon Discount(s)</div>
                            	<a href="#" class="icon"></a>
                            </li>--%>
                        </ul>
                        
                        <ul class="prices">
                        	<li></li>
                            <%--<li>200pts</li>
                            <li>$56.00</li>--%>
                        </ul>
                        <div class="clear"></div>
                        
                        <div class="divider"></div>
                        
                        <ul>
                        	<li class="titles">Total</li>
                            <li class="prices"></li>
                        </ul>
                        
                        <div class="clear"></div>
                        
                        <div class="divider"></div>
                        
                        <div class="buttons">
                            <a class="button white">
                                <div class="text">Continue Shopping</div>
                                <div class="loader"></div>
                            </a>
                        	<a class="button red">
                                <div class="text">Proceed to Checkout</div>
                                <div class="loader"></div>
                            </a>
                            <a class="button brown">
                                <div class="text">Save & Continue Later</div>
                                <div class="loader"></div>
                            </a>
                            <div class="clear"></div>
                        </div>
                        
                        
                    </div>
                    
                </div>
           	</div>
        </div>           
            <div class="clear"></div>
            
        </div>
        
        <div class="extras" id="tabRowHolder">
        	<div class="container_16">
            
                <div class="grid_16">
                    
                    <ul class="nav">
                    	<li class="active">Recommended Items</li>
                        <li>Recently Viewed Items</li>
                        <li>Wishlist</li>
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
	                        
	                        <ul class="recent-items">    
	                    	</ul>
	                        
	                        <ul class="wishlist">
	                        </ul>
                    	</div>        
                    
                    </div>
                    
                        
                </div>
                <div class="clear"></div>
            </div>
        </div>

</asp:Content>
