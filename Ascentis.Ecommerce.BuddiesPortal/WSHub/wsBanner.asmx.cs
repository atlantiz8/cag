using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Text;

using Ascentis.Ecommerce.DataEntity.DataEntity;
using Ascentis.Ecommerce.DataEntity.DTO;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Created by ChenChi on Jan 16 2013
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsBanner : WsValidator
    {
        [WebMethod]
        public string GetSplashBanner(string languageCode)
        {
            string result = string.Empty;

            try
            {
                if (!string.IsNullOrEmpty(languageCode))
                {
                    using (BannerWCFClient.BannerServiceClient bs = new BannerWCFClient.BannerServiceClient())
                    {
                        //result = bs.GetSplashBanner(languageCode);
                       VBannerInfoDTO[] objResult = bs.GetSplashBannerInfo(languageCode);

                       StringBuilder sb = new StringBuilder();
                       sb.Append("{\"status\":0,\"params\":{\"banners\":[");

                       VBannerInfoDTO item;
                       int length = objResult.Length;
                       for (int i = 0; i < length; i++)
                       {
                           item = objResult[i];

                           sb.Append("{\"btype\":\"" + (item.BannerTypeName.IndexOf("Sub") > -1 ? "s" : "b") + "\", \"image\":\"" + item.Image + "\", \"link\":\"" + item.Link + "\"}");

                           if (i < length - 1)
                           {
                               sb.Append(",");
                           }
                       }

                       sb.Append("]}}");

                       result = sb.ToString().Replace("\\", "");

                        //result = result.Replace("\\", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return result;
        }
    }
}
