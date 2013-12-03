using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Ascentis.Ecommerce.BuddiesPortal
{
    

    public partial class Redirect : System.Web.UI.Page
    {
        protected override void OnLoad(EventArgs e)
        {
            //view all POST variables
            //foreach (string var in Request.QueryString)
            //{
            //    Response.Write(var + " " + Request[var] + "<br>");
            //}

            if (Request.QueryString["view"] != null)
            {
                string view = Request.QueryString["view"];
                switch (view)
                {
                    case "landing": Response.Redirect("https://www.facebook.com/changiuat/app_522474577834445"); break;

                    default: Response.Redirect("https://www.facebook.com/changiuat/app_522474577834445"); break;
                }
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
        }
    }
}