using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Configuration;
using System.Net;
using System.Text;
using System.IO;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;
using Ascentis.Ecommerce.DataEntity.AdminEntity;
using Ascentis.Ecommerce.DataEntity.DataEntity;


namespace Ascentis.Ecommerce.BuddiesPortal.MasterPage
{
    public partial class LaunchingPageCB : System.Web.UI.MasterPage
    {
        string langType = string.Empty;
        //BaseClass.BasePage baseFun;
        protected string JsEvalString = string.Empty;
        protected string JsEvalString2 = string.Empty;

        protected void Page_Load(object sender, EventArgs e)
        {
            //baseFun = new BaseClass.BasePage();
            //langType = baseFun.GetCurrentLanguage();
            if (!IsPostBack)
            {                
            }
        }

    }
}
