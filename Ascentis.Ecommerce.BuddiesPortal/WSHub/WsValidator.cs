using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using Ascentis.Ecommerce.CommonLib;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    public class WsValidator : System.Web.Services.WebService
    {
        public String EcommHost
        {
            get { return ConfigurationManager.AppSettings["EcommHost"]; }

        }

        public WsValidator()
        {
            //Uri url = HttpContext.Current.Request.UrlReferrer;
            //if (url == null || url.AbsolutePath.Contains(".asmx") || !url.DnsSafeHost.Equals(EcommHost))
            //{
            //    throw new HttpException(401, "Unauthorized Request");
            //}            
        }
    }
}