<%@ Page Language="C#" MasterPageFile="~/MasterPage/LaunchingPageCB.Master" AutoEventWireup="true" CodeBehind="error.aspx.cs" Inherits="Ascentis.Ecommerce.BuddiesPortal.error" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link href="CSS/404.css" rel="stylesheet" type="text/css" />
</asp:Content>

<asp:Content  ID="aa" ContentPlaceHolderID="ItemProductPresentHolder" runat="server">
    <div id="wrapper">
    	
        <div id="header">
            <div class="masterhead">
                
                <div class="content">
                    <%--<div class="category"><h1>Page Not Found</h1></div>
                    <div class="clear"></div>
                    <div class="breadcrumbs">Home  /  Error</div>--%>
                </div>
                
            <div class="clear"></div>
            </div>
        </div>
        
        <div class="clear"></div>
        
    	<div class="container_12 error">
        
        	<div class="grid_16 mainimage">
                <%--<img src="img/cservice/mainimage.jpg">--%> 							
            </div>
            
            <div class="clear"></div>
        	
            <div class="grid_8 push_2 content">
            	<h1>Page Not Found</h1>
            	Sorry, you may have encountered an error. Please try again later.<br>
                <%--Should this problem persist, please <a href="../CustomerService/ContactUs.aspx">contact us</a>.--%>
            </div>
            
            <div class="clear"></div>
            
        	
    	</div>
    </div>
</asp:Content>
