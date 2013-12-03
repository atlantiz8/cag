using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using System.Web.UI.HtmlControls;
using System.Text;
using Facebook;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Ascentis.Ecommerce.CommonLib;
using System.Configuration;

namespace Ascentis.Ecommerce.BuddiesPortal
{
    public partial class Default : BaseClass.BasePage
	{
		protected void Page_Load(object sender, EventArgs e)
        {
            //view all POST variables
            //foreach (string var in Request.Form)
            //{
            //    Response.Write(var + " " + Request[var] + "<br>");
            //}

            string app_data = "no app data";
            if (Request.Form["signed_request"] != null)
            {
                app_data = GetAppData();
            }
            Response.Write("<h3>"+app_data+"</h3>");
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

            ////all of these print out
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
            //    Response.Write("<p>You've like our page!</p>");
            //}

            return app_data;
        }
	}
}