using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ascentis.Ecommerce.BuddiesPortal.BaseClass
{
    public class BasePage : System.Web.UI.Page
    {
        //glaissa,get member session 2013.1.28
        private const string SESSION_MEMBERAUTOID = "MemberAutoID";
        private const string SESSION_MEMBERID = "MemberID";
        private const string SESSION_MEMBERNAME = "MemberName";


        /// author:jack 20130109
        /// <summary>
        /// override InitializeCulture
        /// </summary>
        protected override void InitializeCulture()
        {
            var languageCookie = Request.Cookies.Get("Language");
            if (languageCookie != null)
            {
                Page.UICulture = languageCookie.Value;
                Page.UICulture = "en-US";
            }
            base.InitializeCulture();
        }

        /// author:jack 20130109
        /// update: Sandy 2013.3.7 add a ToLower function.
        /// <summary>
        /// get current language type such as: en-US zh-CN
        /// </summary>
        /// <returns>string</returns>
        public string GetCurrentLanguage()
        {
            
            if (HttpContext.Current.Request.Cookies["Language"] == null)
            {
                try
                {
                    HttpCookie cookie = new HttpCookie("Language");
                    //ascentis-glaissa mar 08 2013: removed toLower function
                    //cookie.Value = HttpContext.Current.Request.UserLanguages[0].ToString().ToLower();
                    cookie.Value = HttpContext.Current.Request.UserLanguages[0].ToString();
                    cookie.Path = "/";
                    HttpContext.Current.Response.AppendCookie(cookie);
                }
                catch (Exception ex)
                {
                    return "en-US";
                }
            }
            //return HttpContext.Current.Request.Cookies["Language"].Value;
            return "en-US";
        }

        /// author:jack 20130109
        /// <summary>
        /// is odd
        /// </summary>
        /// <param name="n">number</param>
        /// <returns>bool</returns>
        public bool IsOdd(int n)
        {
            return Convert.ToBoolean(n % 2);
        }

        /// author:jack 20130109
        /// <summary>
        /// get current language string
        /// </summary>
        /// <returns>BaseClase.PublicLanguageAttribute</returns>
        public BaseClass.PublicLanguageAttribute GetLanguageStr()
        {
            BaseClass.PublicLanguageAttribute language = new BaseClass.PublicLanguageAttribute();
            if (GetCurrentLanguage().Trim().ToLower() == "zh-CN".Trim().ToLower())
            {
                language.SetLanguageAttributeValue();
            }
            return language;
        }

        /// glaissa 20130128
        /// <summary>
        /// Get Current Member AutoID
        /// </summary>
        public int CurrentMemberAutoID
        {
            get
            {
                int currentUserAutoID = 0;
                if (HttpContext.Current.Session[SESSION_MEMBERAUTOID] != null)
                {
                    currentUserAutoID = Convert.ToInt32(HttpContext.Current.Session[SESSION_MEMBERAUTOID]);                    
                }
                else
                {
                    GetAuthenticatedMember();
                    if (HttpContext.Current.Session[SESSION_MEMBERAUTOID] != null)
                    {
                        currentUserAutoID = Convert.ToInt32(HttpContext.Current.Session[SESSION_MEMBERAUTOID]);
                    }
                }
                return currentUserAutoID;
            }
        }

        /// glaissa 20130128
        /// <summary>
        /// Get Current Member ID
        /// </summary>
        public string CurrentMemberID
        {
            get
            {
                string currentMemberID = String.Empty;
                if (HttpContext.Current.Session[SESSION_MEMBERID] != null)
                {
                    currentMemberID = HttpContext.Current.Session[SESSION_MEMBERID].ToString();
                }
                else
                {
                    GetAuthenticatedMember();
                    if (HttpContext.Current.Session[SESSION_MEMBERID] != null)
                    {
                        currentMemberID = HttpContext.Current.Session[SESSION_MEMBERID].ToString();
                    }
                }
                return currentMemberID;
            }
        }

        /// glaissa 20130128
        /// <summary>
        /// Get Current Member Name
        /// </summary>
        public string CurrentMemberName
        {
            get
            {
                string currentMemberName = String.Empty;
                if (HttpContext.Current.Session[SESSION_MEMBERNAME] != null)
                {
                    currentMemberName = HttpContext.Current.Session[SESSION_MEMBERNAME].ToString();
                }
                else
                {
                    GetAuthenticatedMember();
                    if (HttpContext.Current.Session[SESSION_MEMBERNAME] != null)
                    {
                        currentMemberName = HttpContext.Current.Session[SESSION_MEMBERNAME].ToString();
                    }
                }
                return currentMemberName;
            }
        }

        private void GetAuthenticatedMember()
        {
            try
            {
                string currentMember = HttpContext.Current.User.Identity.Name.ToString().Trim();
                if (!String.IsNullOrEmpty(currentMember))
                {
                    if (currentMember.LastIndexOf("@") >= 0)
                    {
                        currentMember = currentMember.Substring(0, currentMember.LastIndexOf("@"));
                    }
                    using (Ascentis.Ecommerce.EcommPortal.MemberWCFClient.UserServiceClient msc = new Ascentis.Ecommerce.EcommPortal.MemberWCFClient.UserServiceClient())
                    {
                        DataEntity.WebUIEntity.MemberEntity member = msc.GetMemberEntityProfile(currentMember);
                        if (member != null)
                        {
                            HttpContext.Current.Session[SESSION_MEMBERAUTOID] = member.AutoID;
                            HttpContext.Current.Session[SESSION_MEMBERID] = currentMember;                            

                            string displayName = member.Name;
                            if (displayName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                            {
                                displayName = displayName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                            }
                            HttpContext.Current.Session[SESSION_MEMBERNAME] = displayName;
                        }
                    }
                }
            }
            catch (Exception)
            {

            }
        }

        protected override void OnPreRender(EventArgs e)
        {
            base.OnPreRender(e);
            //AutoRedirect();
        }

        private void ClearSessionAndCookies()
        {
            Page.Session.Abandon();

            if (null !=Page.Request.Cookies["memberID"])
            {
                HttpCookie Cookie = new HttpCookie("memberID");
                Cookie.Value = "";
                Cookie.Expires = DateTime.Now.AddDays(-5);
                Page.Response.Cookies.Add(Cookie);
            }
            if (null != Page.Request.Cookies["wishlistData"])
            {
                HttpCookie Cookie = new HttpCookie("wishlistData");
                Cookie.Expires = DateTime.Now.AddDays(-5);
                Page.Response.Cookies.Add(Cookie);
            }


            if (null != Page.Request.Cookies["Cart-" + CurrentMemberAutoID])
            {
                Page.Request.Cookies["Cart-" + CurrentMemberAutoID].Value = "";
                Page.Response.Cookies["Cart-" + CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-5);
            }
            if (null != Request.Cookies["CartCount-" + CurrentMemberAutoID])
            {
                Page.Request.Cookies["CartCount-" + CurrentMemberAutoID].Value = "";
                Page.Response.Cookies["CartCount-" + CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-5);
            }

            if (null != Page.Request.Cookies["recentlySelected"])
            {
                Page.Request.Cookies["recentlySelected"].Value = "";
                Page.Response.Cookies["recentlySelected"].Expires = DateTime.Now.AddDays(-5);
            }

            if (null != Page.Request.Cookies["IsGuest"])
            {
                Page.Request.Cookies["IsGuest"].Value = "";
                Page.Response.Cookies["IsGuest"].Expires = DateTime.Now.AddDays(-5);
            }
        }
        
        public void AutoRedirect()
        {
            if (CurrentMemberAutoID > 0)
            {
                int int_MilliSecondsTimeOut = ((this.Session.Timeout > 1 ? this.Session.Timeout - 1 : 1) * 60000 - 2000);

                string str_Script = @"
                <script type='text/javascript'>                     
                    $(document).ready(function () {                        
                        window.setInterval('modal.showConfirmWithSessionCountdown()'," + int_MilliSecondsTimeOut.ToString() + @");
                    });
                </script>";

                ClientScript.RegisterClientScriptBlock(this.GetType(), "Redirect", str_Script);
            }
            else
            {
                System.Web.Security.FormsAuthentication.SignOut();
                ClearSessionAndCookies();
            }
        }

    }
}