using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;

namespace Ascentis.Ecommerce.BuddiesPortal.Wishlist
{
    public partial class Wish : System.Web.UI.Page
    {
        private string shareFolderURL = ConfigurationManager.AppSettings["ImageSharedFolderURL"];
        protected void Page_Load(object sender, EventArgs e)
        {
            HtmlMeta meta_url = new HtmlMeta();
            meta_url.Name = "og-url";
            meta_url.Attributes["property"] = "og:url";
            meta_url.Content = Request.Url.ToString();
            this.Page.Header.Controls.Add(meta_url);
            
        //<meta property="fb:app_id"          	content="522474577834445" /> 
        //<meta property="og:type"            	content="changi_uat:wish" /> 
        //<meta property="og:site_name"			content="www.iShopChangi.com" />
        //<meta property="og:url"             	content="<?php echo "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?>" /> 
        //<meta property="og:title"           	content="<?php echo $wish['title'] ?>" /> 
        //<meta property="og:image"           	content="<?php echo $wish['image'] ?>" /> 
        //<meta property="og:description"			content="<?php echo $wish['desc'] ?>" />
        //<meta property="changi_uat:group_id"    content="<?php echo $wish['group_id'] ?>" />
        //<meta property="changi_uat:retailer_id"	content="<?php echo $wish['retailer_id'] ?>" />
            
            long groupID = 173;
            int retailerID = 11;
            string langType = "en-US";

            if(Request.QueryString["groupID"] != null)
                groupID = long.Parse(Request.QueryString["groupID"]);
            if(Request.QueryString["retailerID"] != null)
                retailerID = int.Parse(Request.QueryString["retailerID"]);

            ProductGroupEntity pgEntity = new ProductGroupEntity();

            using (ProductGroupWCFClient.ProductGroupServiceClient wcfProductGroup = new ProductGroupWCFClient.ProductGroupServiceClient())
            {
                pgEntity = wcfProductGroup.GetProductGroupEntityInfoByRetailer(groupID, retailerID, langType);

                HtmlMeta meta_title = new HtmlMeta();
                meta_title.Name = "og-title";
                meta_title.Attributes["property"] = "og:title";
                meta_title.Content = pgEntity.Title;
                this.Page.Header.Controls.Add(meta_title);

                HtmlMeta meta_image = new HtmlMeta();
                meta_image.Name = "og-image";
                meta_image.Attributes["property"] = "og:image";
                meta_image.Content = pgEntity.Image;
                this.Page.Header.Controls.Add(meta_image);

                HtmlMeta meta_desc = new HtmlMeta();
                meta_desc.Name = "og-desc";
                meta_desc.Attributes["property"] = "og:description";
                meta_desc.Content = pgEntity.Overview;
                this.Page.Header.Controls.Add(meta_desc);

                HtmlMeta meta_groupID = new HtmlMeta();
                meta_groupID.Name = "group-id";
                meta_groupID.Attributes["property"] = "changi_buddies:group_id";
                meta_groupID.Content = groupID.ToString();
                this.Page.Header.Controls.Add(meta_groupID);

                HtmlMeta meta_retailerID = new HtmlMeta();
                meta_retailerID.Name = "retailer-id";
                meta_retailerID.Attributes["property"] = "changi_buddies:retailer_id";
                meta_retailerID.Content = retailerID.ToString();
                this.Page.Header.Controls.Add(meta_retailerID);
            }
        }
    }
}