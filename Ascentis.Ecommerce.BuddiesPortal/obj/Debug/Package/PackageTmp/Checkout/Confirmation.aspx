<%@ Page Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="Confirmation.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.Checkout.Confirmation_Receipt" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../CSS/960.css">
    <link rel="stylesheet" href="../CSS/checkout.css">
    <link rel="stylesheet" href="../CSS/shoppingcart.css">  
    <style>
        #filter > .right > .button > .holder > .dropdown {margin-top:29px; }
    </style>
    <script type="text/javascript" src="../JS/ascentis/LanguageEN_US.js"></script>
    <script type="text/javascript" src="../JS/ascentis/LaunchingPage.js"></script>  
    <script src="../JS/checkout.js" type="text/javascript"></script>
   
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="ItemFixedSplashholer" runat="server">

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="ItemProductPresentHolder" runat="server">
      
    	<div class="notification error" style="display:none">
            <div class="clear"></div>
            <div class="text">
                
                <div class="clear"></div>
            </div>
        </div>
        
    	<div id="header">
            <div class="masterhead">
                
                <div class="content">
                    <div class="category"><h1>Checkout</h1></div>
                    <div class="clear"></div>
                    <div class="breadcrumbs">Home  /  Checkout </div>
                </div>
                
                <%-- glaissa removed may 01 2013 %>
<%--                <div class="secured">
                    <div class="securedimage"></div>
                    <span>You are on<br />a Secure Site</span>
                </div>--%>
                
            <div class="clear"></div>
            </div>
        </div>
        
        <div class="clear"></div>
        
    	<div class="container_16">
        	
            <div class="grid_16 steps">
            	<ul>
                    
                    <li class="active"><div class="step-no">1</div>Confirmation</li>
                    <li><div class="step-no">2</div>Receipt</li>
                </ul>
                <div class="clear"></div>
            </div>
            
            <div class="clear"></div>
            
            <div class="grid_11">
                

                
                <div class="clear"></div>
                
                <div class="buttons">
                    <a href="#" class="button white">
                        <div class="text">Reset</div>
                        <div class="loader"></div>
                    </a>
                    
                    <a class="button red nextstepbtn">
                        <div class="text">Proceed To Next Step</div>
                        <div class="loader"></div>
                    </a>
                    <div class="clear"></div>
                </div>
            
            </div>
            

            
            <div class="clear"></div>
            
            <div class="grid_16">
            
            	<div class="cart displaybox">
                	<div class="titlebar">
                        <span>Order Summary</span>
                    </div>
                
                	<div class="content">
                    
                        <ul class="titlebar_2">
                            <li>Item</li>
                            <li style="margin-left:255px;">Options</li>
                            <li style="margin-left:155px;">Quantity</li>
                            <li style="margin-left:100px;">Unit Price</li>                            
                            <li style="float:right;">Total</li>
                        </ul>
                		
                        <div class="groupbox hub-gb">
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
                    
                                        <div class="item row" id="0" style="display:none; width:876px;padding:20px 10px;position:relative; border-bottom:1px solid #dddad6;">
                                            <div class="itemimg">
                                                <img height="59px" width="59px" src="" class="img" />
                                            </div>
                        
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
                                                    <li class="qty"></li>
                                                    <div class="clear"></div>
                                                    <%--<li><a class="simplebutton" href="#" id="0">Update</a></li>--%>
                                                    <li class="qtylag" style="display:none">* This item is not available in the desired quantity or not in stock.</li>
                                                </ul>
                        
                                                <ul class="itemunit">
                                                    <li class="unitprice"></li>
                                                    <li class="downtownprice">Downtown Price: <span></span></li>
                                                    <li class="gstsavings">GST Savings: <span class="savings"></span></li>
                                                </ul>
                        
                                                            <div class="itemtotal itemtotal_2"><span></span></div>
                        
                                                            <div class="clear"></div>	
                        
                                                          <%--  <a class="simplebutton itemremove" href="#">Remove</a>--%>
                                                        </div>
                    
                                        <div class="clear"></div>                                       
                                    </div>
                                </div>
                            </div>

                            <%--<div class="groupbar">
                                <div class="groupheader">Retailer: DFS Galleria</div>
                                <ul class="groupvoucher">
                                    <li>E-coupon:</li>
                                    <li>None
                                    </li>
                                </ul>
                                <div class="clear"></div>
                            </div>
                            
                            <div class="item white">
                                <div class="itemimg"><a href="#"></a></div>
                                
                                <div class="itemdes">
                                    <li><h1 class="itemname">Bottega Veneta Aviator Sunglasses</h1></li>
                                    <li class="itemnum">SKU:218319273</li>
                                    <li class="alert">
                                        <a href="#"><img src="../IMG/icon/alert.png" height="13" width="17" class="icon"/>Click for more info.</a>
                                        <div class="clear"></div>
                                        *This item is a LAG, the chosen country of destination requires product to be collected at Collection Centre.
                                    </li>
                                </div>
                                
                                <div class="itemoption">
                                    
                                    <ul class="name">
                                        <li>Color:</li>
                                        <li>Size:</li>
                                    </ul>
                                    
                                    <ul class="selection">
                                        <li>Green</li>
                                        <li>EU40</li>
                                    </ul>
                                    
                                    <div class="clear"></div>
                                    
                                    
                                </div>
                                
                                
                                <ul class="itemunit">
                                    <li class="unitprice">$340</li>
                                    <li>Downtown Price: <span>$410</span><br />GST Savings: <span>$80.30</span></li>
                                </ul>
                                
                                <ul class="itemqty">
                                    <li>3</li>
                                </ul>
                                
                                <div class="itemtotal"><span>$1020</span></div>
                                
                                <div class="clear"></div>	
                                
                            </div>
                            
                            <div class="clear"></div>
                            
                            <div class="item brown">
                                <div class="itemimg"><a href="#"></a></div>
                                
                                <div class="itemdes">
                                    <li><h1 class="itemname">Bottega Veneta Aviator Sunglasses</h1></li>
                                    <li class="itemnum">SKU:218319273</li>
                                </div>
                                
                                <div class="itemoption">
                                    
                                    <ul class="name">
                                        <li>Color:</li>
                                        <li>Size:</li>
                                        <li>E-Coupon:</li>
                                    </ul>
                                    
                                    <ul class="selection">
                                        <li>Green</li>
                                        <li>EU40</li>
                                        <li>Selected</li>
                                    </ul>
                                    
                                    <div class="clear"></div>
                                    
                                </div>
                                
                                <ul class="itemunit">
                                    <li class="unitprice">$340</li>
                                    <li>Downtown Price: <span>$410</span><br />GST Savings: <span>$80.30</span></li>
                                </ul>
                                
                                <ul class="itemqty">
                                    <li>3</li>
                                    <div class="clear"></div>
                                </ul>
                                
                                <div class="itemtotal"><span>$1020</span></div>
                                
                                <div class="clear"></div>	
                            </div>
                            --%>
                            
                        </div>
                        
                        <div class="clear"></div>
                        
                        <div class="endline"></div>
                        
                    	<div class="clear"></div>
                        
                        <div class="grid_6 alpha">
							
 							<div class="flightinfo">
								<div class="titlebar" ><div class="icon"></div>Flight Information</div>
								<ul class="flightNo">
									<li class="title">Flight No.</li>
									<li class="info"></li>
									<div class="clear"></div>
								</ul>
								<div class="clear"></div>
								
								<ul class="passport">
									<li class="title">Passport No.</li>
									<li class="info"></li>
									<div class="clear"></div>
								</ul>
								<div class="clear"></div>
								
								<ul class="flightDest">
									<li class="title">Destination</li>
									<li class="info"></li>
									<div class="clear"></div>
								</ul>
								<div class="clear"></div>
								
								<ul class="flightDate">
									<li class="title">Date of Departure</li>
									<li class="info"></li>
									<div class="clear"></div>
								</ul>
								<div class="clear"></div>
								
								<ul class="flightTime">
									<li class="title">Departure Time</li>
									<li class="info"></li>
									<div class="clear"></div>
								</ul>
								<div class="clear"></div>
							</div>    

                            <%--<ul class="ecoupon">
                                <li class="title">E-coupon Used:</li>
                                <li>Coupon Selected</li>
                                <div class="clear"></div>
                            </ul>--%>
							
														
                        </div>
						
                    
                        <div class="grid_8 alpha push_1" style="margin-left:27px;">
                            <div class="total">
                                <ul class="titles">
                                    <li class="savings">Total Savings</li>
                                    <%--<li>Total Points Earned</li>                                    
                                    <li>
                                        <div class="text">Total E-Coupon Discount(s)</div>
                                        <a href="#" class="icon"></a>
                                    </li>--%>
                                    <li class="promodiscount" style="display:none">Total Promotion Discount</li>
                                </ul>
                                
                                <ul class="prices">
                                    <li class="savings"></li>
                                    <%--<li>200pts</li>
                                    <li>$56.00</li>--%>
                                    <li class="promodiscount" style="display:none"></li>
                                </ul>
                                <div class="clear"></div>
                                
                                <div class="divider"></div>
                                
                                <ul>
                                    <li class="titles">Total</li>
                                    <li class="prices">$</li>
                                </ul>
                                
                                <div class="clear"></div>
                                
                                <div class="divider"></div>
                                
                            </div>
                            
                        </div>
                        
                        <div class="clear"></div>
                        
                	</div>
                    
                    <div class="clear"></div>
                    
            	</div>
                
                <div class="clear"></div>
                       
                <div class="security">                     
                    <div>
                        <img class="logo" src="../IMG/footer/entrust_site_seal.png">
                        <img class="check" src="../IMG/footer/secured.png">
                    </div>
                    <span class="text">Our payment site is secured by Entrust</span>  
                </div>
                <div class="clear"></div>
                <div class="buttons cartbtn">
                    <a href="#" class="button red pay-now">
                        <div class="text">Pay Now</div>
                        <div class="loader"></div>
                    </a>                    
                    <div class="clear"></div>
                </div>
        	<div class="clear"></div>
        	</div>
            
        </div>
        
        <div class="clear"></div>
        <input id="hdOrderNo" type="text" style="visibility:hidden"/>
</asp:Content>