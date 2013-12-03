using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using Ascentis.Ecommerce.CommonLib;

namespace Ascentis.Ecommerce.BuddiesPortal
{
    public class Global : System.Web.HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // 在应用程序启动时运行的代码
            log4net.Config.XmlConfigurator.Configure();
        }

        void Application_End(object sender, EventArgs e)
        {
            //  在应用程序关闭时运行的代码

        }

        void Application_BeginRequest(object sender, EventArgs e)
        {
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
        }

        void Application_Error(object sender, EventArgs e)
        {
            Response.Write("Aplication Error Occured");
            // 在出现未处理的错误时运行的代码
            try
            {
            }
            catch (HttpException ex1)
            {
                if (ex1.ErrorCode == 401)
                {
                    Logger.WriteLog(ELogLevel.FATAL, LogCategory.Gen, "Unauthorized Request: " + ex1.StackTrace);
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex2)
            {
                Logger.WriteLog(ELogLevel.ERROR, LogCategory.Gen, ex2.StackTrace);
            }

            //HttpContext.Current.Response.Redirect("~/error.aspx", true);
        }

        void Session_Start(object sender, EventArgs e)
        {
            // 在新会话启动时运行的代码

        }

        void Session_End(object sender, EventArgs e)
        {
            // 在会话结束时运行的代码。 
            // 注意: 只有在 Web.config 文件中的 sessionstate 模式设置为
            // InProc 时，才会引发 Session_End 事件。如果会话模式设置为 StateServer 
            // 或 SQLServer，则不会引发该事件。

        }

        public override string GetVaryByCustomString(HttpContext context, string custom)
        {
            if (custom == "Language")
            {
                HttpCookie cookie = Request.Cookies["Language"];
                if (cookie != null)
                {
                    //return cookie.Value;
                    return "en-US";
                }
            }
            //return base.GetVaryByCustomString(context, custom);
            return "en-US";

        }

    }
}
