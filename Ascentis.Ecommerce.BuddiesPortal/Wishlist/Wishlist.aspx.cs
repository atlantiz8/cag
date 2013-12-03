using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;

using Ascentis.Ecommerce.DataEntity.DataEntity;
using Facebook;

namespace Ascentis.Ecommerce.BuddiesPortal.Wishlist
{
    public partial class Wishlist :BaseClass.BasePage
    {
        private string shareFolderURL = ConfigurationManager.AppSettings["ImageSharedFolderURL"];
        protected void Page_Load(object sender, EventArgs e)
        {
            HtmlMeta meta_url = new HtmlMeta();
            //meta_url.Name = "og-url";
            meta_url.Attributes["property"] = "og:url";
            meta_url.Content = Request.Url.ToString();
            this.Page.Header.Controls.Add(meta_url);

            HtmlMeta meta_title = new HtmlMeta();
            //meta_title.Name = "og-title";
            meta_title.Attributes["property"] = "og:title";
            meta_title.Content = "My Wishlist";
            this.Page.Header.Controls.Add(meta_title);

            HtmlMeta meta_image = new HtmlMeta();
            //meta_image.Name = "og-image";
            meta_image.Attributes["property"] = "og:image";
            meta_image.Content = "http://www.desertskycommunityschool.org/wp-content/uploads/2013/02/wishlist_256.gif";
            this.Page.Header.Controls.Add(meta_image);

            HtmlMeta meta_image2 = new HtmlMeta();
            //meta_image.Name = "og-image";
            meta_image2.Attributes["property"] = "og:image";
            meta_image2.Content = "https://fbcdn-photos-d-a.akamaihd.net/hphotos-ak-prn1/p74x74/851586_531503430264893_538310029_n.png";
            this.Page.Header.Controls.Add(meta_image2);

            HtmlMeta meta_desc = new HtmlMeta();
            //meta_desc.Name = "og-desc";
            meta_desc.Attributes["property"] = "og:description";
            meta_desc.Content = "My awesome wishlist in Changi Buddies!";
            this.Page.Header.Controls.Add(meta_desc);

            long memberID = 1234;
            string langType = "en-US";
            int recordCount = 30;

            if(Request.QueryString["memberID"] != null)
                memberID = long.Parse(Request.QueryString["memberID"]);
            //Response.Write("<p>" + memberID.ToString() + "</p>");
            string[] wishes = null;
            // groupID=174&retailerID=12

            //test connection to DB
            using (MemberWCFClient.UserServiceClient msc = new MemberWCFClient.UserServiceClient())
            {
                //DataEntity.WebUIEntity.MemberEntity member = msc.UpdateMemberLoginAttempt("peter.ku@ascentis.com.my", true, 30);
                DataEntity.WebUIEntity.MemberEntity member = msc.GetMemberEntityProfile("peter.ku@ascentis.com.my");
                if (member == null)
                {
                    Response.Write("<h2>empty member</h2>");
                }
                else
                {
                    HtmlMeta member_tag = new HtmlMeta();
                    //member_tag.Name = "MEMBER";
                    member_tag.Content = member.AutoID + " " + member.Name + " " + member.Password;
                    this.Page.Header.Controls.Add(member_tag);
                    memberID = member.AutoID;
                }
            }

            //retrieve wishlist
            using (WishlistWCFClient.WishlistServiceClient wcfWishlistClient = new WishlistWCFClient.WishlistServiceClient())
            {
                wishes = wcfWishlistClient.GetWishesUrlByMemberID(memberID, recordCount);
                if (wishes != null)
                {
                    HtmlMeta[] meta_wish = new HtmlMeta[wishes.Length];
                    for (int i = 0; i < wishes.Length; i++)
                    {
                        meta_wish[i] = new HtmlMeta();
                        //meta_wish[i].Name = "wish";
                        meta_wish[i].Attributes["property"] = "changi_buddies:wish";
                        meta_wish[i].Content = "http://" + Request.Url.Host + "/Wishlist/Wish.aspx?" + wishes[i];
                        this.Page.Header.Controls.Add(meta_wish[i]);

                    }
                }
            }


            if (Request.Form["signed_request"] != null)
            {
                string app_data = GetAppData();
            }
        }

        protected string GetAppData()
        {
            var fb = new FacebookClient();
            //dynamic result = fb.Get("me"); //- doesn't work without authentication and not required at this point
            //dynamic id = result.id; //- doesn't work without authentication and not required at this point

            dynamic signedRequest = fb.ParseSignedRequest(ConfigurationManager.AppSettings["fb_app_secret"], Request.Params["signed_request"]);
            /*{
                "algorithm":"HMAC-SHA256",
                "app_data":"test1234",
                "expires":1383105600,
                "issued_at":1383101121,
                "oauth_token":"CAAHbMBedsc0BAGaSJZBeXFS5ZBR4O6rRvscPBgShvAGYmpNiLYd0R8yiA9sa1RWQ4i3W1tPjjSVwxw5JBSfPfqZBpZAve9V7DmSCUVT62I9AZCTrIy1xu6tegC9xrvXTzHmcmZAaQAnZCWKrdMs4SrQAJI9EnWHdF4vRvakEC0QZA4NPsr5UDLe4ZCxS1iFPGVCsZD",
                "page":{
                    "id":"313622935444202",
                    "liked":true,
                    "admin":false
                },
                "user":{
                    "country":"my",
                    "locale":"en_US",
                    "age":{
                        "min":21
                    }
                },
                "user_id":"695050278"
            }*/
            dynamic SignedRequestData = signedRequest["page"];
            dynamic app_data = signedRequest.app_data;

            //all of these print out
            //Response.Write("<h1>signedRequest</h1>");
            //Response.Write(signedRequest);
            //Response.Write("<h1>signedRequest[]</h1>");
            //Response.Write(signedRequest["page"]);
            //Response.Write("<h1>signedRequest.page</h1>");
            //Response.Write(signedRequest.page);
            //Response.Write("<h1>signedRequest[page][liked]</h1>");
            //Response.Write(signedRequest["page"]["liked"]);
            //Response.Write("<h1>signedRequest[page][liked]</h1>");
            //Response.Write((signedRequest.page).liked);
            //Response.Write("<h1>App_data</h1>");
            //Response.Write(app_data);

            //if (signedRequest["page"]["liked"] == true)
            //{
            //    //this does print if the page has been liked.
            //    Response.Write("herr");
            //}

            return app_data;
        }
    }
}