using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;
using System.Configuration;
using System.Net;
using System.Text;
using System.Security;
using System.Security.Cryptography;
using System.Xml;
using System.Xml.Serialization;
using System.Text.RegularExpressions;
using Ascentis.Ecommerce.CommonLib;

using Ascentis.Ecommerce.DataEntity.WebUIEntity;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for wsMember
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsMember : WsValidator
    {

        string DB = ConfigurationManager.AppSettings["CRMWebService_CAG_DB"].ToString();
        string ENQUIRY_CODE = ConfigurationManager.AppSettings["CRMWebService_ENQUIRYCODE"].ToString();
        string OUTLET_CODE = ConfigurationManager.AppSettings["CRMWebService_OUTLETCODE"].ToString();
        string POS_ID = ConfigurationManager.AppSettings["CRMWebService_POSID"].ToString();
        string CASHIER_ID = ConfigurationManager.AppSettings["CRMWebService_CASHIERID"].ToString();
        string MEMBERSHIPTYPE_CODE = ConfigurationManager.AppSettings["CRMWebService_MEMBERSHIPTYPECODE"].ToString();
        string TIER_CODE = ConfigurationManager.AppSettings["CRMWebService_TIERCODE"].ToString();
        string MAILLIST = ConfigurationManager.AppSettings["CRMWebService_MailingList"].ToString();
        string MAILLIST_UNSUB = ConfigurationManager.AppSettings["CRMWebService_Unsubscribe"].ToString();

        [WebMethod(EnableSession = true)]
        public int CreateMemberProfile(bool IsCRMMember, string UserID, string Password, string Salutation, string FName, string LName,
            int PasswordSecurityQuestionId, string PasswordSecurityAnswer, string PassportNumber, string DateofBirth,
            string Gender, string ContactNo, string MobileNo, string Address1, string Address2, string PostalCode,
            string Nationality, string City, string Country, string NewsLetter, string CRMAuthResponse, string CRMCard, string OrderID)
        {
            int result = 0;
            string id = String.Empty;
            try
            {
                bool success = false;
                bool IsGuest = false;
                long GuestAutoID = 0;

                #region server site data validation

                if (!GenericValidator.IsValidEmail(UserID)) return -1;
                if (!GenericValidator.IsValidPassword(Password)) return -1;
                if (!string.IsNullOrEmpty(PassportNumber) && !GenericValidator.IsValidPassport(PassportNumber)) return -1;
                if (!string.IsNullOrEmpty(ContactNo) && !GenericValidator.IsValidContactNum(ContactNo)) return -1;
                if (!string.IsNullOrEmpty(MobileNo) && !GenericValidator.IsValidContactNum(MobileNo)) return -1;

                DateTime dt = Convert.ToDateTime(DateofBirth);
                if (!GenericValidator.IsValidBirthday(dt)) return -1;

                #endregion

                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    DataEntity.WebUIEntity.MemberEntity isMemberExist = wcfClient.GetMemberEntityProfile(UserID.Trim());

                    if (isMemberExist != null)
                    {
                        if (!(isMemberExist.IsGuest.HasValue && isMemberExist.IsGuest.Value))//DB record: not guest account
                        {
                            return -2; //email address exists
                        }
                        else//DB record: guest account
                        {
                            IsGuest = true;
                            GuestAutoID = isMemberExist.AutoID;
                        }
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(PassportNumber))
                        {
                            DataEntity.WebUIEntity.MemberEntity isPassportDOBExists = wcfClient.GetMemberEmailByPassportBirthDate(PassportNumber, 0, null, dt);
                            if (isPassportDOBExists != null)
                            {
                                return -4; //passport + DOB exists
                            }
                        }
                    }
                    DataEntity.DataEntity.Member newMember = newMember = new DataEntity.DataEntity.Member();
                    result = 1;

                    //Insert member to eCommerce
                    id = UserID;
                    newMember.UserID = UserID;
                    newMember.Password = HashPassword(Password);
                    newMember.Salutation = Salutation;
                    newMember.Name = FName + "#" + LName;
                    newMember.PasswordSecurityQuestionId = PasswordSecurityQuestionId;
                    newMember.PasswordSecurityAnswer = PasswordSecurityAnswer;
                    newMember.PassportNumber = PassportNumber;

                    newMember.DateofBirth = dt;
                    newMember.Gender = Gender; //Gender.Substring(0, 1);
                    newMember.ContactNo = ContactNo;
                    newMember.MobileNo = MobileNo;
                    newMember.Address1 = Address1;
                    newMember.Address2 = Address2;
                    newMember.PostalCode = PostalCode;
                    newMember.Nationality = Nationality;
                    newMember.City = City;
                    newMember.Country = Country;
                    newMember.IsAllowPromotion = NewsLetter == "1" ? true : false;
                    newMember.IsActive = false;
                    newMember.AddedBy = UserID;
                    newMember.AddedOn = DateTime.Now;

                    success = wcfClient.AddMember(ref newMember);

                    if (success)
                    {
                        result = 2;

                        //Create CRM Profile with Ecommerce membership type
                        CRMMemberRegistrationRequest member = new CRMMemberRegistrationRequest();
                        member.Command = "MEMBERSHIP REGISTRATION2";
                        member.DB = DB;
                        member.EnquiryCode = ENQUIRY_CODE;
                        member.OutletCode = OUTLET_CODE;
                        member.PosID = POS_ID;
                        member.CashierID = CASHIER_ID;
                        member.MembershipTypeCode = MEMBERSHIPTYPE_CODE;
                        member.TierCode = TIER_CODE;
                        member.Name = FName;
                        member.Nric = System.Guid.NewGuid().ToString();
                        member.Passport = newMember.PassportNumber;
                        member.Nationality = newMember.Nationality;
                        member.Email = newMember.UserID;
                        member.MobileNo = newMember.MobileNo;
                        member.Password = Password;
                        member.DOB = newMember.DateofBirth;
                        if (NewsLetter == "1")
                        {
                            MailingLists mailList = new MailingLists();
                            mailList.Name = MAILLIST;
                            member.MailingLists = new List<MailingLists>();
                            member.MailingLists.Add(mailList);
                        }

                        string xmlBody = GenerateXMLFromObj(member);
                        string response = SendSoapRequest(xmlBody);

                        CRMMemberRegistrationResponse regResponse;
                        regResponse = GenerateObjFromXML<CRMMemberRegistrationResponse>(response);
                        if (regResponse != null)
                        {
                            result = 6;

                            switch (regResponse.ReturnStatus)
                            {
                                case 1:
                                    {
                                        if (IsCRMMember && !String.IsNullOrEmpty(CRMAuthResponse))
                                        {
                                            CRMMemberAuthenticationResponse1 crmMemberAuthResponse = null;
                                            string CRMMemberID = String.Empty;
                                            JavaScriptSerializer jss = new JavaScriptSerializer();
                                            crmMemberAuthResponse = (CRMMemberAuthenticationResponse1)jss.Deserialize(CRMAuthResponse, typeof(CRMMemberAuthenticationResponse1));
                                            CRMMemberID = crmMemberAuthResponse.MemberInfo.MemberID;

                                            wcfClient.UpdateMemberCRMCardNoMemberID(newMember.AutoID, regResponse.CardInfo.CardNo, CRMCard, CRMMemberID);                                            
                                        }
                                        else
                                        {   
                                            wcfClient.UpdateMemberCRMCardNoMemberID(newMember.AutoID, regResponse.CardInfo.CardNo, String.Empty, regResponse.CardInfo.MemberID);
                                        }

                                        if (IsGuest)
                                        {
                                            wcfClient.ConvertGuestCheckoutOrder(GuestAutoID, newMember.AutoID, true);
                                        }

                                        result = 7;
                                        break;
                                    }
                                case 50:
                                    {
                                        result = -3;
                                        success = false;
                                        RollBackMember(newMember.UserID);
                                        break;
                                    }
                                default:
                                    {
                                        success = false;
                                        RollBackMember(newMember.UserID);
                                        result = 9;
                                        break;
                                    }
                            }
                        }

                        if (success)
                        {
                            using (SSOWCFClient.SSOSvcClient ssoClient = new SSOWCFClient.SSOSvcClient())
                            {
                                //add member to SSO
                                SSOWCFClient.Member ssoMember = new SSOWCFClient.Member();
                                ssoMember.ID = newMember.UserID;
                                ssoMember.Password = newMember.Password;
                                ssoMember.Email = newMember.UserID;
                                ssoMember.Salutation = newMember.Salutation;
                                ssoMember.Name = newMember.Name;
                                ssoMember.PasswordSecurityQuestionId = newMember.PasswordSecurityQuestionId;
                                ssoMember.PasswordSecurityAnswer = newMember.PasswordSecurityAnswer;
                                ssoMember.NRIC = newMember.PassportNumber;
                                ssoMember.DateofBirth = dt;
                                ssoMember.Gender = Gender; //newMember.Gender.Substring(0, 1);
                                ssoMember.ContactNo = newMember.ContactNo;
                                ssoMember.MobileNo = newMember.MobileNo;
                                ssoMember.Address1 = newMember.Address1;
                                ssoMember.Address2 = newMember.Address2;
                                ssoMember.PostalCode = newMember.PostalCode;
                                ssoMember.Nationality = newMember.Nationality;
                                ssoMember.City = newMember.City;
                                ssoMember.Country = newMember.Country;
                                ssoMember.IsAllowPromotion = newMember.IsAllowPromotion;
                                ssoMember.AddedBy = newMember.AddedBy == null ? "admin" : newMember.AddedBy;
                                ssoMember.AddedOn = DateTime.Today;

                                if (ssoClient.AddMember(ConfigurationManager.AppSettings["CRM_ClientCode"].ToString(), ssoMember))
                                {
                                    result = 10;
                                    //grant access to application
                                    ssoClient.AssignMemberToApplication(ConfigurationManager.AppSettings["CRM_ClientCode"].ToString(), ssoMember.ID, int.Parse(ConfigurationManager.AppSettings["SSO_AppID"]));

                                    result = SendRegistrationEmail(newMember.UserID.ToString().Trim());
                                }
                                else
                                {
                                    RollBackMember(newMember.UserID);
                                    result = 11;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                if (result != -2)
                {
                    RollBackMember(id);
                }
                result = -1;
            }
            return result;

        }

        [WebMethod(EnableSession = true)]
        public string CreateGuestAccount()
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    MemberEntity guest = wcfClient.CreateGuestAccount();
                    if (guest != null)
                    {
                        SetGuestAccount(guest.AutoID, guest.UserID, guest.Name);

                        StringBuilder sb = new StringBuilder();
                        sb.Append("{\"GuestAutoID\":\"" + guest.AutoID.ToString() + "\",");
                        sb.Append("\"GuestUserID\":\"" + guest.UserID + "\"}");
                        result = sb.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string SetGuestAccount(long GuestAutoID, string GuestEmail, string GuestName)
        {
            string result = String.Empty;
            try
            {
                HttpCookie idCookie = HttpContext.Current.Request.Cookies["memberID"];
                if (idCookie == null) idCookie = new HttpCookie("memberID");
                idCookie.Value = GuestAutoID.ToString();
                idCookie.Path = "/";
                HttpContext.Current.Response.Cookies.Add(idCookie);

                HttpCookie isGuestCookie = HttpContext.Current.Request.Cookies["IsGuest"];
                if (isGuestCookie == null) isGuestCookie = new HttpCookie("IsGuest");
                isGuestCookie.Value = "true";
                isGuestCookie.Path = "/";
                HttpContext.Current.Response.Cookies.Add(isGuestCookie);

                string displayName = GuestName;
                if (displayName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                {
                    displayName = displayName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                }

                HttpContext.Current.Session["MemberAutoID"] = GuestAutoID.ToString();
                HttpContext.Current.Session["MemberID"] = GuestEmail;
                HttpContext.Current.Session["MemberName"] = displayName;
                result = "1";
            }
            catch (Exception ex)
            {
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public int SendGuestSaveCartAndWishlistEmail(string Email)
        {
            int result = 0;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    long currentMemberAutoId = baseClass.CurrentMemberAutoID;

                    if (!String.IsNullOrEmpty(Email))
                    {
                        //validate if email exists
                        MemberEntity member = wcfClient.GetMemberEntityProfile(Email.Trim());
                        if (member != null)
                        {
                            if (member.IsGuest != null && member.IsGuest.Value == true)
                            {
                                if (currentMemberAutoId == member.AutoID)
                                {
                                    result = 1; // it is itself account, can be used.
                                }
                                else
                                {
                                    result = 3; // the email address is exist and it is a guest account
                                }
                            }
                            else if (member.IsGuest == null || member.IsGuest.Value == false)
                            {
                                result = 4; // the email address is exist and it is a normal account
                            }
                        }
                        else
                        {
                            result = 1; // the email address can be used
                        }
                    }
                    else
                    {
                        result = 2; // Email parameter should not be none
                    }
                    if (result != 1)
                    {
                        return result;
                    }
                    else
                    {
                        GuestEntity guest = wcfClient.GetGuestDetails(currentMemberAutoId);
                        if (guest != null)
                        {
                            string tokenID = guest.AutoID.ToString();

                            //send notification email
                            string mailFrom = ConfigurationManager.AppSettings["SmtpFromEmail1"].ToString();
                            string mailTo = Email;
                            string token = HashPassword(Email + tokenID);
                            string ecommURL = ConfigurationManager.AppSettings["EcommHost"].ToString().Trim();
                            ecommURL = (ecommURL.ToLower().StartsWith("http") ? ecommURL : "http://" + ecommURL);

                            string subject = "Click Here to Continue Shopping at iShopChangi.com";
                            StringBuilder sb = new StringBuilder();
                            sb.Append("<html><body>");
                            sb.Append("<font face=\"Arial\">");
                            sb.Append("Dear " + (!String.IsNullOrEmpty(guest.Name) ? guest.Name : "Guest") + ", <br /><br />");
                            sb.Append("Thank you for visiting iShopChangi. <br /><br />");
                            sb.Append("You may resume your session by clicking on the link below: <br /><br />");
                            sb.Append("<a href='" + ecommURL + "/cart/shoppingcart.aspx?token=" + token + "&id=" + tokenID + "' >" +
                                                    ecommURL + "/cart/shoppingcart.aspx?token=" + token + "&id=" + tokenID + "</a><br/><br/>");

                            sb.Append("Sincerely, <br />");
                            sb.Append("iShopChangi Team");
                            sb.Append("</font>");
                            sb.Append("</body></html>");

                            try
                            {
                                string smtp = ConfigurationManager.AppSettings["SmtpHost"].ToString();
                                string smtpUser = ConfigurationManager.AppSettings["SmtpUserName"].ToString();
                                string smtpPass = ConfigurationManager.AppSettings["SmtpPassword"].ToString();
                                SendEmail email = new SendEmail(mailFrom, mailTo, null, smtp, smtpUser, smtpPass);
                                email.SendMessage(subject, sb.ToString(), null, true);

                                // update the email address to guest's UserID column
                                result = wcfClient.UpdateGuestUserID(currentMemberAutoId, Email) ? 1 : -1;
                            }
                            catch (Exception)
                            {
                                result = -2; // exception error
                            }
                        }
                        else
                        {
                            result = -3; // can not get a correct member autoid from seesion/cookies.
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = -99; // exception error.
            }
            return result;
        }

        [WebMethod]
        public int SendRegistrationEmail(string Email)
        {
            int result = 12;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    string tokenID = String.Empty;
                    DataEntity.WebUIEntity.MemberEntity memberCreated = wcfClient.GetMemberEntityProfile(Email);
                    tokenID = memberCreated != null ? memberCreated.AutoID.ToString().Trim() : String.Empty;

                    string firstName = memberCreated.Name;
                    if (firstName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                    {
                        firstName = firstName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                    }

                    //send notification email
                    string mailFrom = ConfigurationManager.AppSettings["SmtpFromEmail1"].ToString();
                    string mailTo = Email;
                    string token = HashPassword(Email + tokenID);
                    string ecommURL = ConfigurationManager.AppSettings["EcommHost"].ToString().Trim();
                    ecommURL = (ecommURL.ToLower().StartsWith("http") ? ecommURL : "http://" + ecommURL);

                    string subject = "Welcome to iShopChangi.com";
                    StringBuilder sb = new StringBuilder();
                    sb.Append("<html><body>");
                    sb.Append("<font face=\"Arial\">");
                    sb.Append("Dear " + firstName + ", <br /><br />");
                    sb.Append("Thank you for signing up at iShopChangi. Shop with us before you fly at " + ecommURL + ". <br /><br />");
                    sb.Append("Please click on the link below to activate your account:<br /><br />");
                    sb.Append("<a href='" + ecommURL + "/Default.aspx?c=" + token + "&i=" + tokenID + "' >" +
                                            ecommURL + "/Default.aspx?c=" + token + "&i=" + tokenID + "</a><br/><br/>");

                    sb.Append("Sincerely, <br />");
                    sb.Append("iShopChangi Team");
                    sb.Append("</font>");
                    sb.Append("</body></html>");

                    try
                    {
                        string smtp = ConfigurationManager.AppSettings["SmtpHost"].ToString();
                        string smtpUser = ConfigurationManager.AppSettings["SmtpUserName"].ToString();
                        string smtpPass = ConfigurationManager.AppSettings["SmtpPassword"].ToString();
                        SendEmail email = new SendEmail(mailFrom, mailTo, null, smtp, smtpUser, smtpPass);
                        email.SendMessage(subject, sb.ToString(), null, true);
                        result = 12;
                    }
                    catch (Exception)
                    {
                        result = -5;
                    }
                }
            }
            catch (Exception ex)
            {
                result = -5;
            }
            return result;
        }


        private void RollBackMember(string memberID)
        {
            using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
            {
                DataEntity.DataEntity.Member newMember = wcfClient.GetMemberProfile(memberID);
                if (newMember != null)
                {
                    wcfClient.DeleteMember(memberID);
                }
            }
        }

        [WebMethod(EnableSession = true)]
        public string VerifyCaptcha(string captcha)
        {
            string result = String.Empty;
            if (HttpContext.Current.Request.Cookies["CAPTCHA"] != null)
            {
                result = HttpContext.Current.Request.Cookies["CAPTCHA"].Value.Equals(HashPassword(captcha)) ? "true" : "false";
            }

            return result;
        }

        //[WebMethod]
        //public string VerifyCaptcha(string privatekey, string remoteip, string challenge, string response)
        //{
        //    string svrResponse = string.Empty;
        //    string url = "http://www.google.com/recaptcha/api/verify";
        //    string postData = "privatekey=" + privatekey + "&remoteip=" + remoteip + "&challenge=" + challenge + "&response=" + response;
        //    try
        //    {
        //        WebRequest rq = WebRequest.Create(url);
        //        rq.Method = "POST";

        //        Byte[] byteArray = Encoding.UTF8.GetBytes(postData);
        //        rq.ContentType = "application/x-www-form-urlencoded";
        //        rq.ContentLength = byteArray.Length;

        //        Stream streamData = rq.GetRequestStream();
        //        streamData.Write(byteArray, 0, byteArray.Length);
        //        streamData.Close();

        //        WebResponse rs = rq.GetResponse();
        //        streamData = rs.GetResponseStream();

        //        StreamReader reader = new StreamReader(streamData);
        //        svrResponse = reader.ReadToEnd();
        //        reader.Close();
        //        streamData.Close();
        //        rs.Close();
        //    }
        //    catch
        //    {

        //    }
        //    return svrResponse;
        //}

        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string AddToWishlist(string memberID, string productGroupID, string index)
        {
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            long sMemberAutoID = baseClass.CurrentMemberAutoID;
            long cMemberAutoID = long.Parse(memberID);

            if (sMemberAutoID == cMemberAutoID)
            {
                using (WishlistWCFClient.WishlistServiceClient wcfClient = new WishlistWCFClient.WishlistServiceClient())
                {
                    return wcfClient.AddToWishlist(long.Parse(memberID), long.Parse(productGroupID), int.Parse(index)).ToString();
                }
            }

            return string.Empty;
        }


        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string DeleteWishlistByMemberIDAndIndex(string memberID, string index)
        {
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            long sMemberAutoID = baseClass.CurrentMemberAutoID;
            long cMemberAutoID = long.Parse(memberID);

            if (sMemberAutoID == cMemberAutoID)
            {
                using (WishlistWCFClient.WishlistServiceClient wcfClient = new WishlistWCFClient.WishlistServiceClient())
                {
                    return wcfClient.DeleteWishlistByMemberIDAndIndex(long.Parse(memberID), int.Parse(index)) ? "1" : "0";
                }
            }

            return string.Empty;
        }

        string cardStatus = String.Empty;

        [WebMethod(EnableSession = true)]
        public string GetMemberProfile()
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    string MemberID = baseClass.CurrentMemberID;
                    DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberEntityProfile(MemberID);
                    StringBuilder sb = new StringBuilder();
                    if (member != null)
                    {
                        if (HttpContext.Current.Request.Cookies["SSOAuth"] != null && !string.IsNullOrEmpty(HttpContext.Current.Request.Cookies["SSOAuth"].Value))
                        {
                            int cookieCount = HttpContext.Current.Request.Cookies.Count;
                            for (int i = 0; i < cookieCount; i++)
                            {
                                HttpContext.Current.Request.Cookies[i].Expires = DateTime.Now.AddMinutes(Session.Timeout);
                            }
                        }

                        sb.Append("{\"name\":\"" + StrHelper.InputTextEncode(member.Name.Replace("#", " ")) + "\", ");
                        sb.Append("\"gender\":\"" + (string.IsNullOrEmpty(member.Gender) ? "" : (member.Gender == "M" ? "Male" : "Female")) + "\", ");
                        sb.Append("\"birthday\":\"" + member.DateofBirth.Value.ToString("MM-dd-yyyy") + "\", ");
                        sb.Append("\"nationality\":\"" + StrHelper.InputTextEncode(member.Nationality) + "\", ");
                        sb.Append("\"address\":\"" + StrHelper.InputTextEncode(member.Address1 + " " + member.Address2) + " ");
                        sb.Append(StrHelper.InputTextEncode(member.City + " " + member.Country + " " + member.PostalCode) + "\", ");
                        sb.Append("\"address1\":\"" + StrHelper.InputTextEncode(member.Address1) + "\", ");
                        sb.Append("\"address2\":\"" + StrHelper.InputTextEncode(member.Address2) + "\", ");
                        sb.Append("\"city\":\"" + StrHelper.InputTextEncode(member.City) + "\", ");
                        sb.Append("\"country\":\"" + StrHelper.InputTextEncode(member.Country) + "\", ");
                        sb.Append("\"postalcode\":\"" + StrHelper.InputTextEncode(member.PostalCode) + "\", ");
                        sb.Append("\"email\":\"" + StrHelper.InputTextEncode(MemberID) + "\", ");
                        sb.Append("\"passport\":\"" + StrHelper.InputTextEncode(member.PassportNumber) + "\", ");
                        sb.Append("\"contactNo\":\"" + StrHelper.InputTextEncode(member.ContactNo) + "\", ");
                        sb.Append("\"mobileNo\":\"" + StrHelper.InputTextEncode(member.MobileNo) + "\", ");
                        sb.Append("\"cardNo\":\"" + StrHelper.InputTextEncode(member.CRMCardNo) + "\", ");
                        sb.Append("\"newsLetter\":\"" + member.IsAllowPromotion + "\", ");

                        //get CR points
                        double points = 0;
                        //string cardStatus = String.Empty;                        
                        try
                        {
                            if (!String.IsNullOrEmpty(member.CRMCardNo))
                            {
                                points = Convert.ToDouble(GetMemberCRPoints(member.CRMCardNo));
                            }
                        }
                        catch (Exception ex)
                        {
                        }

                        sb.Append("\"cardstatus\":\"" + cardStatus + "\", ");
                        sb.Append("\"points\":\"" + points.ToString() + "\" } ");
                        result = sb.ToString();
                    }
                }
                return result;
            }
            catch (Exception)
            {

            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetGuestDetails()
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    GuestEntity guest = wcfClient.GetGuestDetails(baseClass.CurrentMemberAutoID);
                    if (guest != null)
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.Append("{\"status\":0, ");
                        sb.Append("\"AutoID\":" + guest.AutoID + ",");
                        sb.Append("\"Name\":\"" + guest.Name + "\",");
                        sb.Append("\"Email\":\"" + guest.Email + "\",");
                        sb.Append("\"Passport\":\"" + guest.Passport + "\",");
                        sb.Append("\"IsAllowPromotion\":\"" + (guest.IsAllowPromotion.HasValue && guest.IsAllowPromotion.Value ? "1" : "0") + "\",");
                        if (guest.DateOfBirth != null)
                        {
                            sb.Append("\"DateOfBirth\":\"" + guest.DateOfBirth.Value.ToString("dd MMM yyyy") + "\",");
                        }
                        else
                        {
                            sb.Append("\"DateOfBirth\":\"\",");
                        }
                        sb.Append("\"FlightNo\":\"" + guest.FlightNumber + "\",");
                        sb.Append("\"AirportCode\":\"" + guest.AirportCode + "\",");
                        sb.Append("\"FlightTerminal\":\"" + guest.TerminalNumber + "\",");
                        sb.Append("\"FlightDestination\":\"" + guest.DestinationCountry + "\",");

                        if (guest.DepartureDateTime != null)
                        {
                            DateTime fDate = guest.DepartureDateTime.Value.Date;
                            sb.Append("\"FlightDateTime\":\"" + fDate.ToString("dd MMM yyyy") + "\", ");
                            TimeSpan diff = fDate.Subtract(DateTime.Now);
                            sb.Append("\"FlightDT114Flag\":\"" + ((diff.TotalHours >= 24 && diff.TotalHours <= 336) ? "1" : "0") + "\", ");
                            sb.Append("\"FlightDepartureTime\":\"" + guest.DepartureDateTime.Value.ToString("dd MMM yyyy") + "\"} ");
                        }
                        else
                        {
                            sb.Append("\"FlightDateTime\":\"\",");
                            sb.Append("\"FlightDepartureTime\":\"\"} ");

                        }
                        result = sb.ToString();
                    }
                    else
                    {
                        result = "{\"status\":2 }";
                    }
                }
            }
            catch (Exception)
            {
                result = "{\"status\": 1 }";
            }
            return result;
        }

        [WebMethod]
        public string GetMemberCRPoints(string CardNo)
        {
            string result = String.Empty;
            double points = 0;
            try
            {
                if (!String.IsNullOrEmpty(CardNo))
                {
                    CRMCardEnquiryRequest cardEnq = new CRMCardEnquiryRequest();
                    cardEnq.Command = "CARD ENQUIRY";
                    cardEnq.DB = DB;
                    cardEnq.EnquiryCode = ENQUIRY_CODE;
                    cardEnq.OutletCode = OUTLET_CODE;
                    cardEnq.PosID = POS_ID;
                    cardEnq.CashierID = CASHIER_ID;
                    cardEnq.CardNo = CardNo;

                    string xmlBody = GenerateXMLFromObj(cardEnq);
                    string response = SendSoapRequest(xmlBody);

                    CRMCardEnquiryResponse enqResponse;
                    enqResponse = GenerateObjFromXML<CRMCardEnquiryResponse>(response);
                    if (enqResponse != null && enqResponse.ReturnStatus == 1)
                    {
                        points = enqResponse.CardInfo.TotalPointsBAL;
                        cardStatus = enqResponse.CardInfo.MembershipStatusCode.Trim().ToUpper();
                        result = points.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public int UpdateMemberProfile(string EmailAdd, string Passport, string BirthDate, string ContactNo1, string ContactNo2, int NewsLetter, string Address1, string Address2, string PostalCode, string City, string Country)
        {
            int result = 0;
            try
            {
                string ClientCode = ConfigurationManager.AppSettings["CRM_ClientCode"].ToString();

                #region Server site data validation
                                
                if(!string.IsNullOrEmpty(Passport)) Passport = StrHelper.InputTextEncode(Passport.Trim());
                if (!string.IsNullOrEmpty(ContactNo1)) ContactNo1 = StrHelper.InputTextEncode(ContactNo1.Trim());
                if (!string.IsNullOrEmpty(ContactNo2)) ContactNo2 = StrHelper.InputTextEncode(ContactNo2.Trim());
                if (!string.IsNullOrEmpty(EmailAdd)) EmailAdd = StrHelper.InputTextEncode(EmailAdd.Trim());


                DateTime dt = Convert.ToDateTime(BirthDate);
                if (!GenericValidator.IsValidBirthday(dt)) return -1;

                if (!string.IsNullOrEmpty(Passport) && !GenericValidator.IsValidPassport(Passport)) return -1;

                if (!GenericValidator.IsValidContactNum(ContactNo1)) return -1;
                if (!string.IsNullOrEmpty(ContactNo2) && !GenericValidator.IsValidContactNum(ContactNo2)) return -1;

                if (!GenericValidator.IsValidEmail(EmailAdd)) return -1;

                #endregion

                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    string MemberID = baseClass.CurrentMemberID;

                    if (MemberID != EmailAdd)
                    {
                        DataEntity.WebUIEntity.MemberEntity isEmailExist = wcfClient.GetMemberEntityProfile(EmailAdd);
                        if (isEmailExist != null)
                        {
                            return -3;
                        }

                        using (SSOWCFClient.SSOSvcClient ssoClient = new SSOWCFClient.SSOSvcClient())
                        {
                            SSOWCFClient.Member ssoMemberExist = ssoClient.GetMemberProfile(ClientCode, EmailAdd);
                            if (ssoMemberExist != null)
                            {
                                return -4;
                            }
                        }
                    }

                    DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberEntityProfile(MemberID);
                    if (member != null)
                    {                        
                        member.UserID = EmailAdd;
                        member.PassportNumber = Passport;
                        member.DateofBirth = dt;
                        member.ContactNo = ContactNo1;
                        member.MobileNo = ContactNo2;
                        member.IsAllowPromotion = NewsLetter == 1 ? true : false;
                        member.Address1 = Address1;
                        member.Address2 = Address2;
                        member.PostalCode = PostalCode;
                        member.City = City;
                        member.Country = Country;
                        member.ModifiedBy = MemberID;
                        bool ecommUpdate = false;
                        if (MemberID != EmailAdd)
                        {
                            ecommUpdate = wcfClient.UpdateMemberEmailID(MemberID, member);
                        }
                        else
                        {
                            ecommUpdate = wcfClient.UpdateMemberProfile(member);
                        }

                        if (ecommUpdate)
                        {
                            result = 1;

                            try
                            {
                                //update CRM
                                CRMMemberEnquiryRequest memberEnq = new CRMMemberEnquiryRequest();
                                memberEnq.Command = "MEMBER ENQUIRY";
                                memberEnq.DB = DB;
                                memberEnq.EnquiryCode = ENQUIRY_CODE;
                                memberEnq.OutletCode = OUTLET_CODE;
                                memberEnq.PosID = POS_ID;
                                memberEnq.CashierID = CASHIER_ID;
                                memberEnq.MemberID = member.CRMMemberID;

                                string xmlBody = GenerateXMLFromObj(memberEnq);
                                string response = SendSoapRequest(xmlBody);

                                CRMMemberEnquiryResponse enqResponse;
                                enqResponse = GenerateObjFromXML<CRMMemberEnquiryResponse>(response);
                                if (enqResponse != null)
                                {
                                    if (enqResponse.ReturnStatus == 1 && enqResponse.MemberLists.Count > 0)
                                    {
                                        result = 2;

                                        CRMUpdateProfileRequest memberUpd = new CRMUpdateProfileRequest();
                                        memberUpd.Command = "UPDATE PROFILE2";
                                        memberUpd.DB = DB;
                                        memberUpd.EnquiryCode = ENQUIRY_CODE;
                                        memberUpd.OutletCode = OUTLET_CODE;
                                        memberUpd.PosID = POS_ID;
                                        memberUpd.CashierID = CASHIER_ID;
                                        memberUpd.FilterByMemberID = member.CRMMemberID;

                                        //only update email 
                                        memberUpd.Email = member.UserID;
                                        memberUpd.MailingLists = enqResponse.MemberLists[0].MailingLists;

                                        MailingLists mailList = new MailingLists();
                                        if (NewsLetter == 1)
                                        {
                                            if (memberUpd.MailingLists.Count > 0)
                                            {
                                                MailingLists unsub = memberUpd.MailingLists.Single(m => m.Name == MAILLIST_UNSUB);
                                                if (unsub != null)
                                                {
                                                    memberUpd.MailingLists.Remove(unsub);
                                                }
                                            }
                                            mailList.Name = MAILLIST;
                                            memberUpd.MailingLists.Add(mailList);
                                        }
                                        else
                                        {
                                            if (memberUpd.MailingLists.Count > 0)
                                            {
                                                MailingLists unsub = memberUpd.MailingLists.Single(m => m.Name == MAILLIST);
                                                if (unsub != null)
                                                {
                                                    memberUpd.MailingLists.Remove(unsub);
                                                }
                                            }
                                            mailList.Name = MAILLIST_UNSUB;
                                            memberUpd.MailingLists.Add(mailList);
                                        }

                                        memberUpd.Passport = enqResponse.MemberLists[0].Passport;
                                        memberUpd.DOB = enqResponse.MemberLists[0].DOB;
                                        memberUpd.ContactNo = enqResponse.MemberLists[0].ContactNo;
                                        memberUpd.MobileNo = enqResponse.MemberLists[0].MobileNo;

                                        memberUpd.Name = enqResponse.MemberLists[0].Name;
                                        memberUpd.NRIC = enqResponse.MemberLists[0].NRIC;
                                        memberUpd.Gender = enqResponse.MemberLists[0].Gender;
                                        memberUpd.Nationality = enqResponse.MemberLists[0].Nationality;
                                        memberUpd.Block = enqResponse.MemberLists[0].Block;
                                        memberUpd.Level = enqResponse.MemberLists[0].Level;
                                        memberUpd.Unit = enqResponse.MemberLists[0].Unit;
                                        memberUpd.Street = enqResponse.MemberLists[0].Street;
                                        memberUpd.Building = enqResponse.MemberLists[0].Building;
                                        memberUpd.PostalCode = enqResponse.MemberLists[0].PostalCode;
                                        memberUpd.Country = enqResponse.MemberLists[0].Country;
                                        memberUpd.Address1 = enqResponse.MemberLists[0].Address1;
                                        memberUpd.Address2 = enqResponse.MemberLists[0].Address2;
                                        memberUpd.Address3 = enqResponse.MemberLists[0].Address3;
                                        memberUpd.FaxNo = enqResponse.MemberLists[0].FaxNo;
                                        memberUpd.FacebookID = enqResponse.MemberLists[0].FacebookID;
                                        memberUpd.FacebookName = enqResponse.MemberLists[0].FacebookName;
                                        memberUpd.FacebookPhotoLink = enqResponse.MemberLists[0].FacebookPhotoLink;
                                        memberUpd.FacebookToken = enqResponse.MemberLists[0].FacebookToken;
                                        memberUpd.FacebookTokenExpiry = enqResponse.MemberLists[0].FacebookTokenExpiry;

                                        xmlBody = GenerateXMLFromObj(memberUpd);

                                        response = SendSoapRequest(xmlBody);
                                        CRMUpdateProfileResponse updResponse;
                                        updResponse = GenerateObjFromXML<CRMUpdateProfileResponse>(response);
                                        if (updResponse != null)
                                        {
                                            result = 3;
                                            if (updResponse.ReturnStatus == 1)
                                            {

                                            }
                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {

                            }

                            //update sso
                            using (SSOWCFClient.SSOSvcClient ssoClient = new SSOWCFClient.SSOSvcClient())
                            {
                                SSOWCFClient.Member ssoMember = ssoClient.GetMemberProfile(ClientCode, MemberID);
                                if (ssoMember != null)
                                {
                                    result = 4;
                                    ssoMember.ID = EmailAdd;
                                    ssoMember.Email = EmailAdd;
                                    ssoMember.NRIC = member.PassportNumber;
                                    ssoMember.DateofBirth = dt;
                                    ssoMember.ContactNo = member.ContactNo;
                                    ssoMember.MobileNo = member.MobileNo;
                                    ssoMember.IsAllowPromotion = member.IsAllowPromotion;
                                    ssoMember.Address1 = Address1;
                                    ssoMember.Address2 = Address2;
                                    ssoMember.PostalCode = PostalCode;
                                    ssoMember.City = City;
                                    ssoMember.Country = Country;

                                    if (MemberID != EmailAdd)
                                    {
                                        int AppID = 0;
                                        int.TryParse(ConfigurationManager.AppSettings["SSO_AppID"].ToString(), out AppID);
                                        if (ssoClient.UpdateMemberEmailID(ClientCode, MemberID, ssoMember, AppID))
                                        {
                                            result = 5;
                                            System.Web.Security.FormsAuthentication.SetAuthCookie(EmailAdd + "@" + ClientCode, false);
                                            HttpContext.Current.Session["MemberID"] = EmailAdd;
                                        }
                                    }
                                    else
                                    {
                                        if (ssoClient.UpdateMember(ClientCode, ssoMember)) { result = 5; }
                                    }
                                }
                            }
                        }
                        else
                        {
                            result = -1;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = -2;
            }
            return result;

        }

        [WebMethod]
        public string IsGuestEmailExist(long GuestAutoID, string EmailAddress, string LanguageCode)
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    if (!String.IsNullOrEmpty(EmailAddress))
                    {
                        //validate if email exists
                        MemberEntity guest = wcfClient.GetMemberEntityProfile(EmailAddress.Trim());
                        if (guest != null && guest.AutoID != GuestAutoID)
                        {
                            if (guest.IsGuest != null && guest.IsGuest.Value == true)
                            {
                                string status = String.Empty;
                                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                                {
                                    List<ShoppingCartEntity> lstItems = sc.GetShoppingCartByMemberID(guest.AutoID, LanguageCode, false).ToList();
                                    status = (lstItems != null && lstItems.Count() > 0) ? "1" : "2";
                                }

                                return "{\"status\":" + status + ",\"guestID\":" + guest.AutoID + ",\"guestEmail\":\"" + guest.UserID + "\",\"guestName\":\"" + guest.Name + "\"}";
                            }
                            else if (guest.IsGuest == null || guest.IsGuest.Value == false)
                            {
                                return "{\"status\":3,\"guestID\":" + guest.AutoID + ",\"guestEmail\":\"" + guest.UserID + "\",\"guestName\":\"" + guest.Name + "\"}";
                            }
                        }
                        else
                        {
                            return "{\"status\":0}";
                        }
                    }
                }
            }
            catch (Exception)
            { }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public int VerifyGuestSaveLink(long GuestAutoID, string token,string LanguageCode)
        {
            int result = -1;
            using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
            {
                DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberProfileByAutoID(GuestAutoID);
                if (member != null)
                {
                    string VerifyToken = HashPassword(member.UserID.Trim() + GuestAutoID.ToString());
                    if (token == VerifyToken)
                    {
                        if (member.ModifiedOn.HasValue)
                        {
                            if (member.ModifiedOn.Value.AddDays(7).CompareTo(DateTime.Now) > 0)
                            {
                                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                                {
                                    List<ShoppingCartEntity> lstItems = sc.GetShoppingCartByMemberID(member.AutoID, LanguageCode, false).ToList();
                                    if (lstItems == null)
                                    {
                                        result = 2;
                                    }
                                    else if (lstItems.Count() <= 0)
                                    {
                                        result = 2;
                                    }
                                    else
                                    {
                                        // Verify token???
                                        result = 1;
                                    }
                                    // set Session、Cookies, and ask page reload or init.
                                    SetGuestAccount(member.AutoID, member.UserID, member.Name);
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }

        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string UpdateGuestDetails(long GuestAutoID, string BirthDate, string Destination, string Name, string EmailAddress, string Passport, string FlightAutoID, string FlightDate, bool NewsLetter)
        {
            string result = String.Empty;

            #region server site data validation

            if (!string.IsNullOrEmpty(BirthDate) && BirthDate != "//")
            {
                DateTime dtTmp = new DateTime();
                DateTime.TryParse(BirthDate, out dtTmp);

                if (!GenericValidator.IsValidBirthday(dtTmp)) throw new ArgumentException("Invalid birthday");
            }

            if (!string.IsNullOrEmpty(EmailAddress) && !GenericValidator.IsValidEmail(EmailAddress)) throw new ArgumentException("Invalid email address");

            if (!string.IsNullOrEmpty(Passport) && !GenericValidator.IsValidPassport(Passport)) throw new ArgumentException("Invalid passport number");

            #endregion

            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long sMemberAutoID = baseClass.CurrentMemberAutoID;

                if (sMemberAutoID == GuestAutoID)
                {
                    using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                    {
                        long flightID = 0;
                        long.TryParse(FlightAutoID, out flightID);

                        DateTime? dtFlight = null;
                        if (!String.IsNullOrEmpty(FlightDate))
                        {
                            dtFlight = Convert.ToDateTime(FlightDate);
                        }
                        result = wcfClient.UpdateGuestDetails(GuestAutoID, BirthDate, Destination, Name, EmailAddress, Passport, flightID, dtFlight, NewsLetter).ToString();
                    }
                }
            }
            catch (Exception)
            { }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string Authenticate_CRMMember(string cardNo, string password)
        {
            string result = String.Empty;
            try
            {
                CRMMemberEnquiryRequest memberEnq = new CRMMemberEnquiryRequest();
                memberEnq.Command = "MEMBER ENQUIRY";
                memberEnq.DB = DB;
                memberEnq.EnquiryCode = ENQUIRY_CODE;
                memberEnq.OutletCode = OUTLET_CODE;
                memberEnq.PosID = POS_ID;
                memberEnq.CashierID = CASHIER_ID;
                memberEnq.NRIC = password;

                string xmlBody = GenerateXMLFromObj(memberEnq);
                string response = SendSoapRequest(xmlBody);

                CRMMemberEnquiryResponse enqResponse;
                enqResponse = GenerateObjFromXML<CRMMemberEnquiryResponse>(response);
                if (enqResponse != null)
                {
                    CRMMemberAuthenticationResponse authResponse = new CRMMemberAuthenticationResponse();
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    if (enqResponse.ReturnStatus == 1 && enqResponse.MemberLists.Count > 0 && enqResponse.CardLists.Count > 0)
                    {
                        CRMCardResponseInfo card = enqResponse.CardLists.Find(c => c.CardNo == cardNo);
                        if (card == null)
                        {
                            authResponse.IsValid = false;
                            result = jss.Serialize(authResponse);
                        }
                        else
                        {
                            //DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberEntityProfile(MemberID);
                            bool isCardUsed = false;
                            using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                            {
                                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                                isCardUsed = wcfClient.IsCRCardUsed(cardNo, baseClass.CurrentMemberAutoID);
                            }

                            if (isCardUsed)
                            {
                                result = jss.Serialize("EXISTS");
                            }
                            else
                            {
                                authResponse.IsValid = true;
                                authResponse.MemberInfo = enqResponse.MemberLists[0];
                                List<CRMMembershipCardResponseInfo> memCardList = new List<CRMMembershipCardResponseInfo>();
                                foreach (CRMCardResponseInfo c in enqResponse.CardLists)
                                {
                                    CRMMembershipCardResponseInfo memCard = new CRMMembershipCardResponseInfo();
                                    memCard.CardNo = c.CardNo;
                                    memCard.MemberID = c.MemberID;
                                    memCard.MembershipTypeCode = c.MembershipTypeCode;
                                    memCard.MembershipStatusCode = c.MembershipStatusCode;
                                    memCardList.Add(memCard);
                                }
                                authResponse.MembershipCardLists = memCardList;
                                result = jss.Serialize(authResponse);
                            }
                        }
                    }
                    else
                    {
                        authResponse.IsValid = false;
                        result = jss.Serialize(authResponse);
                    }
                }

                //CRMMemberAuthenticationRequest member = new CRMMemberAuthenticationRequest();
                //member.Command = "MEMBER AUTHENTICATION";
                //member.DB = DB;
                //member.EnquiryCode = ENQUIRY_CODE;
                //member.OutletCode = OUTLET_CODE;
                //member.PosID = POS_ID;
                //member.CashierID = CASHIER_ID;
                //member.UserIDisCardNo = true;
                //member.UserID = cardNo;
                //member.Password = password;

                //string xmlBody = GenerateXMLFromObj(member);
                //string response = SendSoapRequest(xmlBody);

                //CRMMemberAuthenticationResponse authResponse;
                //authResponse = GenerateObjFromXML<CRMMemberAuthenticationResponse>(response);
                //if (authResponse != null)
                //{                    
                //    CRMMembershipCardResponseInfo card = authResponse.MembershipCardLists.Find(c => c.MembershipTypeCode == MEMBERSHIPTYPE_CODE);
                //    JavaScriptSerializer jss = new JavaScriptSerializer();
                //    if (card != null)
                //    {
                //        result = jss.Serialize("EXISTS");
                //    }
                //    else
                //    {                        
                //        result = jss.Serialize(authResponse);
                //    }
                //}
            }
            catch (Exception ex)
            {
            }
            return result;
        }

        [WebMethod]
        public string GetLists()
        {
            string result = String.Empty;
            try
            {
                string[] countries = System.IO.File.ReadAllLines(Server.MapPath("/Member/Countries.txt"), Encoding.UTF7);
                StringBuilder sb = new StringBuilder();
                sb.Append("{\"country\":[");
                foreach (string country in countries)
                {
                    if (!String.IsNullOrEmpty(country)) sb.Append("{\"option\":\"" + country + "\"},");
                }
                sb.Remove(sb.Length - 1, 1);
                sb.Append("], \"nationality\":[");

                string[] nats = System.IO.File.ReadAllLines(Server.MapPath("/Member/Nationalities.txt"), Encoding.UTF7);
                foreach (string nat in nats)
                {
                    if (!String.IsNullOrEmpty(nat)) sb.Append("{\"option\":\"" + nat + "\"},");
                }
                sb.Remove(sb.Length - 1, 1);
                sb.Append("], \"countrycode\":[");

                string[] ctrycodes = System.IO.File.ReadAllLines(Server.MapPath("/Member/CountryCode.txt"), Encoding.UTF8);
                foreach (string ctrycode in ctrycodes)
                {
                    if (!String.IsNullOrEmpty(ctrycode)) sb.Append("{\"option\":\"" + ctrycode + "\", \"value\":\"" + ctrycode.Substring(ctrycode.IndexOf("(") + 1).Replace(")", "") + "\"},");
                }
                sb.Remove(sb.Length - 1, 1);
                sb.Append("]}");
                result = sb.ToString();
            }
            catch (Exception ex)
            {
            }
            JavaScriptSerializer jss = new JavaScriptSerializer();
            return jss.Serialize(result);
        }

        [WebMethod]
        public string SendForgotPasswordLink(string Email)
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    DataEntity.WebUIEntity.MemberEntity isMemberExist = wcfClient.GetMemberEntityProfile(Email);
                    if (isMemberExist == null)
                    {
                        return "{\"status\":1}";
                    }

                    string subject = "Reset Password";
                    string token = HashPassword(Email.Trim() + isMemberExist.AutoID.ToString().Trim());
                    string ecommURL = ConfigurationManager.AppSettings["EcommHost"].ToString().Trim();
                    ecommURL = (ecommURL.ToLower().StartsWith("http") ? ecommURL : "http://" + ecommURL);

                    string firstName = isMemberExist.Name;
                    if (firstName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                    {
                        firstName = firstName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                    }

                    StringBuilder sb = new StringBuilder();
                    sb.Append("<html><body>");
                    sb.Append("<font face=\"Arial\">");
                    sb.Append("Dear " + firstName + ", <br /><br />");
                    sb.Append("Please click on the link below to reset your password:<br /><br />");
                    sb.Append("<a href='" + ecommURL + "/Forget.aspx?t=1&c=" + token + "&i=" + isMemberExist.AutoID.ToString().Trim() + "' >" +
                                            ecommURL + "/Forget.aspx?t=1&c=" + token + "&i=" + isMemberExist.AutoID.ToString().Trim() + "</a><br /><br />");
                    sb.Append("Sincerely, <br />");
                    sb.Append("iShopChangi Team");
                    sb.Append("</font>");
                    sb.Append("</body></html>");

                    try
                    {
                        string smtp = ConfigurationManager.AppSettings["SmtpHost"].ToString();
                        string smtpUser = ConfigurationManager.AppSettings["SmtpUserName"].ToString();
                        string smtpPass = ConfigurationManager.AppSettings["SmtpPassword"].ToString();
                        string mailFrom = ConfigurationManager.AppSettings["SmtpFromEmail1"].ToString();
                        string mailTo = Email;
                        SendEmail email = new SendEmail(mailFrom, mailTo, null, smtp, smtpUser, smtpPass);
                        if (email.SendMessage(subject, sb.ToString(), null, true) == true)
                        {
                            result = "{\"status\":0}";
                        }
                    }
                    catch (Exception)
                    {
                        result = "{\"status\":-1}";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{\"status\":-2}";
            }
            return result;
        }

        [WebMethod]
        public string ValidateCode(string Code, long MemberAutoID, bool Activate)
        {
            //http://portal.ecomm.ascentis.com.sg/Forgot.aspx?t=1&c=6b8d79e15994fc2b04175e8418a009f9f18970a13a90b82dd1acd521f10b646f&i=104
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    DataEntity.WebUIEntity.MemberEntity isMemberExist = wcfClient.GetMemberProfileByAutoID(MemberAutoID);
                    if (isMemberExist != null)
                    {
                        string hash = HashPassword(isMemberExist.UserID.Trim() + MemberAutoID.ToString());
                        if (hash != Code)
                        {
                            return "{\"status\":1}";
                        }
                        else
                        {
                            if (Activate == true)
                            {
                                if (isMemberExist.IsActive == true)
                                {
                                    return "{\"status\":3}";
                                }
                                else
                                {
                                    if (wcfClient.ActivateMember(MemberAutoID))
                                    {
                                        return "{\"status\":0}";
                                    }
                                    else
                                    {
                                        return "{\"status\":-2}";
                                    }
                                }
                            }
                            else
                            {
                                return "{\"status\":0}";
                            }
                        }
                    }
                    else
                    {
                        return "{\"status\":2}";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{\"status\":-1}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string ResetPassword(string CurrentPassword, string NewPassword, long MemberAutoID)
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    long MemberID = String.IsNullOrEmpty(CurrentPassword) ? MemberAutoID : baseClass.CurrentMemberAutoID;
                    string MemberEmail = baseClass.CurrentMemberID;

                    DataEntity.WebUIEntity.MemberEntity memberFromToken = wcfClient.GetMemberProfileByAutoID(MemberID);
                    if (memberFromToken == null && MemberID == 0)
                    {
                        //reset password from email link
                        return "{\"status\":3}";
                    }

                    //change password in My Account
                    if (!String.IsNullOrEmpty(CurrentPassword))
                    {
                        DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberEntityProfile(MemberEmail);
                        if (member.Password != CurrentPassword)
                        {
                            int MaxLoginAttempt = int.Parse(ConfigurationManager.AppSettings["MaxLoginFailedAttempt"].ToString());
                            DataEntity.WebUIEntity.MemberEntity memberLockedInfo = wcfClient.UpdateMemberLoginAttempt(MemberEmail, false, MaxLoginAttempt);
                            if (memberLockedInfo != null)
                            {
                                if (memberLockedInfo.IsLocked == true)
                                {
                                    return "{\"status\":-5}"; //account locked
                                }
                                else
                                {
                                    return "{\"status\":-6}"; //invalid current password
                                }
                            }
                        }
                    }

                    //update sso
                    using (SSOWCFClient.SSOSvcClient ssoClient = new SSOWCFClient.SSOSvcClient())
                    {
                        SSOWCFClient.Member ssoMember = ssoClient.GetMemberProfile(ConfigurationManager.AppSettings["CRM_ClientCode"].ToString(), memberFromToken.UserID);
                        if (ssoMember != null)
                        {
                            ssoMember.Password = NewPassword;
                            if (ssoClient.UpdateMember(ConfigurationManager.AppSettings["CRM_ClientCode"].ToString(), ssoMember))
                            {
                                //update ecommerce
                                memberFromToken.Password = NewPassword;
                                memberFromToken.IsLocked = false;
                                memberFromToken.LockedDateTime = null;
                                memberFromToken.LoginFailedAttempt = 0;
                                memberFromToken.ModifiedBy = memberFromToken.UserID;
                                result = wcfClient.UpdateMemberProfile(memberFromToken) ? "{\"status\":0}" : "{\"status\":1}";
                            }
                            else { result = "{\"status\":-4}"; }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{\"status\":-1}";
            }
            return result;
        }

        [WebMethod]
        public string RetrieveEmail(string Email, string Passport, int SecurityQuestionId, string SecurityAnswer, string BirthDate)
        {
            string result = String.Empty;
            try
            {
                using (MemberWCFClient.UserServiceClient wcfClient = new MemberWCFClient.UserServiceClient())
                {
                    DataEntity.WebUIEntity.MemberEntity member = wcfClient.GetMemberEmailByPassportBirthDate(Passport, SecurityQuestionId, SecurityAnswer, Convert.ToDateTime(BirthDate));
                    if (member != null)
                    {
                        string subject = "Login Email ID";
                        string firstName = member.Name;
                        if (firstName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                        {
                            firstName = firstName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                        }

                        StringBuilder sb = new StringBuilder();
                        sb.Append("<html><body>");
                        sb.Append("<font face=\"Arial\">");
                        sb.Append("Dear " + firstName + ", <br /><br />");
                        sb.Append("Your iShopChangi login email ID is:<br /><br />");
                        sb.Append(member.UserID + "<br /><br />");
                        sb.Append("Sincerely, <br />");
                        sb.Append("iShopChangi Team");
                        sb.Append("</font>");
                        sb.Append("</body></html>");

                        try
                        {
                            string smtp = ConfigurationManager.AppSettings["SmtpHost"].ToString();
                            string smtpUser = ConfigurationManager.AppSettings["SmtpUserName"].ToString();
                            string smtpPass = ConfigurationManager.AppSettings["SmtpPassword"].ToString();
                            string mailFrom = ConfigurationManager.AppSettings["SmtpFromEmail1"].ToString();
                            string mailTo = Email;
                            SendEmail email = new SendEmail(mailFrom, mailTo, null, smtp, smtpUser, smtpPass);
                            if (email.SendMessage(subject, sb.ToString(), null, true) == true)
                            {
                                result = "{\"status\":0}";
                            }
                        }
                        catch (Exception)
                        {
                            result = "{\"status\":-1}";
                        }
                    }
                    else
                    {
                        return "{\"status\":2}";
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{\"status\":-2}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string LogoutMember()
        {
            string result = String.Empty;
            try
            {
                System.Web.Security.FormsAuthentication.SignOut();

                if (null != HttpContext.Current.Request.Cookies["memberID"])
                {
                    HttpCookie Cookie = new HttpCookie("memberID");
                    Cookie.Expires = DateTime.Now.AddDays(-5);
                    HttpContext.Current.Response.Cookies.Add(Cookie);
                }
                if (null != HttpContext.Current.Request.Cookies["wishlistData"])
                {
                    HttpCookie Cookie = new HttpCookie("wishlistData");
                    Cookie.Expires = DateTime.Now.AddDays(-5);
                    HttpContext.Current.Response.Cookies.Add(Cookie);
                }

                BaseClass.BasePage basePg = new BaseClass.BasePage();
                if (null != HttpContext.Current.Request.Cookies["Cart-" + basePg.CurrentMemberAutoID])
                {
                    HttpContext.Current.Request.Cookies["Cart-" + basePg.CurrentMemberAutoID].Value = "";
                    HttpContext.Current.Response.Cookies["Cart-" + basePg.CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-10);
                }
                if (null != HttpContext.Current.Request.Cookies["CartCount-" + basePg.CurrentMemberAutoID])
                {
                    HttpContext.Current.Request.Cookies["CartCount-" + basePg.CurrentMemberAutoID].Value = "";
                    HttpContext.Current.Response.Cookies["CartCount-" + basePg.CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-10);
                }

                HttpContext.Current.Session.Abandon();
                result = "{\"status\":0}";
            }
            catch (Exception ex)
            {
                result = "{\"status\":-1}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string RemoveWishlist(long groupID)
        {
            string result = String.Empty;
            using (WishlistWCFClient.WishlistServiceClient wcfClient = new WishlistWCFClient.WishlistServiceClient())
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                result = wcfClient.DeleteWishlistByGroupID(MemberAutoID, groupID).ToString();
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string RemoveWishlistIfExist(long groupID)
        {
            string result = String.Empty;
            using (WishlistWCFClient.WishlistServiceClient wcfClient = new WishlistWCFClient.WishlistServiceClient())
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                if (wcfClient.WishlistIsExist(MemberAutoID, groupID) == true)
                {
                    result = wcfClient.DeleteWishlistByGroupID(MemberAutoID, groupID).ToString();
                }
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string LinkCRMCardNo(string CardNo, string CRMAuthResponse)
        {
            string result = String.Empty;
            using (MemberWCFClient.UserServiceClient msc = new MemberWCFClient.UserServiceClient())
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                CRMMemberAuthenticationResponse1 crmMemberAuthResponse = null;
                string CRMMemberID = String.Empty;
                if (!String.IsNullOrEmpty(CRMAuthResponse))
                {
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    crmMemberAuthResponse = (CRMMemberAuthenticationResponse1)jss.Deserialize(CRMAuthResponse, typeof(CRMMemberAuthenticationResponse1));
                    CRMMemberID = crmMemberAuthResponse.MemberInfo.MemberID;
                }

                msc.UpdateMemberCRMCardNoMemberID(baseClass.CurrentMemberAutoID, String.Empty, CardNo, CRMMemberID);
                result = "{\"CRMMemberID\":\"" + CRMMemberID + "\",\"CardNo\":\"" + CardNo + "\"}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string HasFacebookID() { 
        }

        private string HashPassword(string password)
        {
            string hash = Sha256Hex(password);
            return hash;
        }

        private string Sha256Hex(string toHash)
        {
            SHA256Managed hash = new SHA256Managed();
            Byte[] utf8 = UTF8Encoding.UTF8.GetBytes(toHash);
            return BytesToHex(hash.ComputeHash(utf8));
        }

        private string BytesToHex(Byte[] toConvert)
        {
            StringBuilder s = new StringBuilder(toConvert.Length * 2);
            foreach (Byte b in toConvert)
            {
                s.Append(b.ToString("x2"));
            }
            return s.ToString();
        }

        private string CreateSoapBody(string Body)
        {
            string user = ConfigurationManager.AppSettings["CRMWebService_User"].ToString();
            string pword = ConfigurationManager.AppSettings["CRMWebService_Password"].ToString();
            user = Convert.ToBase64String(Encoding.ASCII.GetBytes(user));
            pword = Convert.ToBase64String(Encoding.ASCII.GetBytes(pword));

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("<?xml version='1.0' encoding='utf-8'?>");
            sb.AppendLine("<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>");
            sb.AppendLine("<soap:Header>");
            sb.AppendLine("<SOAPAuthHeader xmlns='http://MatrixAPIs/'>");
            sb.AppendLine("<strUserName>" + user + "</strUserName>");
            sb.AppendLine("<strPassword>" + pword + "</strPassword>");
            sb.AppendLine("</SOAPAuthHeader>");
            sb.AppendLine("</soap:Header>");
            sb.AppendLine("<soap:Body>");
            sb.AppendLine("<XMLCommand xmlns='http://MatrixAPIs/'>");
            sb.AppendLine("<requestXML>" + HttpUtility.HtmlEncode(Body) + "</requestXML>");
            sb.AppendLine("</XMLCommand>");
            sb.AppendLine("</soap:Body>");
            sb.AppendLine("</soap:Envelope>");

            return sb.ToString();
        }

        private string SendSoapRequest(string xmlBody)
        {
            string url = ConfigurationManager.AppSettings["CRMWebService_URL"].ToString();
            string reqBody = CreateSoapBody(xmlBody);

            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
            webRequest.Headers.Add("SOAPAction", "http://MatrixAPIs/XMLCommand");
            webRequest.ContentType = "text/xml;charset='utf-8'";
            webRequest.Accept = "text/xml";
            webRequest.Method = "POST";
            webRequest.ContentLength = reqBody.Length;

            StreamWriter srw = new StreamWriter(webRequest.GetRequestStream());
            srw.Write(reqBody);
            srw.Close();

            HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
            StreamReader srd = new StreamReader(webResponse.GetResponseStream());
            string response = srd.ReadToEnd();
            XmlDocument responseXML = new XmlDocument();
            responseXML.LoadXml(response);
            response = HttpUtility.HtmlDecode(responseXML.DocumentElement.ChildNodes[0].InnerText);
            srd.Close();
            webResponse.Close();

            return response;
        }

        private string GenerateXMLFromObj(Object obj)
        {
            string xmlBody = String.Empty;
            using (StringWriter sw = new StringWriter())
            {
                XmlSerializer objXML = new XmlSerializer(obj.GetType());
                objXML.Serialize(sw, obj);
                xmlBody = sw.ToString();
            }
            xmlBody = xmlBody.Replace("<?xml version=\"1.0\" encoding=\"utf-16\"?>", "");
            xmlBody = xmlBody.Replace("xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"", "");
            xmlBody = xmlBody.Replace("xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"", "");

            return xmlBody;
        }

        private T GenerateObjFromXML<T>(string xml)
        {
            T obj;
            using (StringReader sw = new StringReader(xml))
            {
                XmlSerializer objXML = new XmlSerializer(typeof(T));
                XmlTextReader xmlReader = new XmlTextReader(sw);
                obj = (T)objXML.Deserialize(xmlReader);
                xmlReader.Close();
            }
            return obj;
        }
    }

    #region CRM Soap Requests

    [Serializable]
    public class RequestParam
    {
        public string Command { get; set; }
        public string DB { get; set; }
        public string EnquiryCode { get; set; }
        public string OutletCode { get; set; }
        public string PosID { get; set; }
        public string CashierID { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MembershipRegistration2")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMMemberRegistrationRequest : RequestParam
    {
        public string MembershipTypeCode { get; set; }
        public string TierCode { get; set; }
        public string MembershipStatusCode { get; set; }
        public string CardNo { get; set; }
        public string Name { get; set; }
        public string Nric { get; set; }
        public string Passport { get; set; }
        public string Nationality { get; set; }
        public string Email { get; set; }
        public string MobileNo { get; set; }
        public string Password { get; set; }
        public DateTime? DOB { get; set; }
        public List<MailingLists> MailingLists { get; set; }

    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MembershipRegistration2")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMMemberRegistrationResponse : ResponseParam
    {

        public CRMCardResponseInfo CardInfo { get; set; }
        public List<CRMMemberResponseInfo> MemberInfo { get; set; }
    }

    [Serializable]
    public class ResponseParam
    {
        public int ReturnStatus { get; set; }
        public string ReturnMessage { get; set; }
        public string RequestTime { get; set; }
        public string ResponseTime { get; set; }
    }

    [XmlType(TypeName = "CardInfo")]
    public class CRMCardResponseInfo
    {
        public string CardNo { get; set; }
        public string MemberID { get; set; }
        public string MembershipTypeCode { get; set; }
        public string MembershipStatusCode { get; set; }
        public double PointsBAL { get; set; }
        public double TotalPointsBAL { get; set; }
    }

    [XmlType(TypeName = "Sender")]
    public class MailingLists
    {
        [XmlAttribute(AttributeName = "Name")]
        public string Name { get; set; }
    }

    [XmlType(TypeName = "MembershipCardInfo")]
    public class CRMMembershipCardResponseInfo
    {
        public string CardNo { get; set; }
        public string MemberID { get; set; }
        public string MembershipTypeCode { get; set; }
        public string MembershipStatusCode { get; set; }
    }

    [XmlType(TypeName = "MemberInfo")]
    public class CRMMemberResponseInfo
    {
        public string MemberID { get; set; }
        public string Name { get; set; }
        public string NRIC { get; set; }
        public string Passport { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string DOB { get; set; }
        public string Nationality { get; set; }
        public string Block { get; set; }
        public string Level { get; set; }
        public string Unit { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string ContactNo { get; set; }
        public string MobileNo { get; set; }
        public string FaxNo { get; set; }
        public string ReferrerCode { get; set; }
        public string FacebookID { get; set; }
        public string FacebookName { get; set; }
        public string FacebookPhotoLink { get; set; }
        public string FacebookToken { get; set; }
        public string FacebookTokenExpiry { get; set; }
        public string FullPhotoName { get; set; }
        public string Base64PhotoString { get; set; }
        public string PhotoLink { get; set; }
        public List<MailingLists> MailingLists { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MemberAuthentication")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMMemberAuthenticationRequest : RequestParam
    {
        public bool UserIDisCardNo { get; set; }
        public string UserID { get; set; }
        public string Password { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MemberAuthentication")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMMemberAuthenticationResponse
    {
        public int ReturnStatus { get; set; }
        public string ReturnMessage { get; set; }
        public string RequestTime { get; set; }
        public string ResponseTime { get; set; }
        public bool IsValid { get; set; }
        public CRMMemberResponseInfo MemberInfo { get; set; }
        public List<CRMMembershipCardResponseInfo> MembershipCardLists { get; set; }
    }

    public class CRMMemberAuthenticationResponse1
    {
        public int ReturnStatus { get; set; }
        public string ReturnMessage { get; set; }
        public string RequestTime { get; set; }
        public string ResponseTime { get; set; }
        public bool IsValid { get; set; }
        public CRMMemberResponseInfo MemberInfo { get; set; }
        public List<CRMMembershipCardResponseInfo> MembershipCardLists { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MemberEnquiry")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMMemberEnquiryRequest : RequestParam
    {
        public string NRIC { get; set; }
        public string MobileNo { get; set; }
        public string Email { get; set; }
        public string MemberID { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.MemberEnquiry")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMMemberEnquiryResponse : ResponseParam
    {
        public List<CRMCardResponseInfo> CardLists { get; set; }
        public List<CRMMemberResponseInfo> MemberLists { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.CardEnquiry")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMCardEnquiryRequest : RequestParam
    {
        public string CardNo { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.CardEnquiry")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMCardEnquiryResponse : ResponseParam
    {
        public CRMCardResponseInfo CardInfo { get; set; }
        public CRMMemberResponseInfo MemberInfo { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.UpdateProfile2")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMUpdateProfileRequest : RequestParam
    {
        public string FilterByMemberID { get; set; }
        public string Name { get; set; }
        public string NRIC { get; set; }
        public string Passport { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string DOB { get; set; }
        public string Nationality { get; set; }
        public string Block { get; set; }
        public string Level { get; set; }
        public string Unit { get; set; }
        public string Street { get; set; }
        public string Building { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string ContactNo { get; set; }
        public string MobileNo { get; set; }
        public string FaxNo { get; set; }
        public string Password { get; set; }
        public string FacebookID { get; set; }
        public string FacebookName { get; set; }
        public string FacebookPhotoLink { get; set; }
        public string FacebookToken { get; set; }
        public string FacebookTokenExpiry { get; set; }
        public List<MailingLists> MailingLists { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.UpdateProfile2")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMUpdateProfileResponse : ResponseParam
    {
        //public List<CRMCardResponseInfo> CardLists { get; set; }
        public List<CRMMemberResponseInfo> MemberLists { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.CardInsertion")]
    [XmlType(TypeName = "RequestXML")]
    public class CRMCardInsertionRequest : RequestParam
    {
        public string MemberID { get; set; }
        public string MembershipTypeCode { get; set; }
        public string TierCode { get; set; }
    }

    [Serializable]
    [XmlRoot(Namespace = "GenericVO.CardInsertion")]
    [XmlType(TypeName = "ResponseXML")]
    public class CRMCardInsertionResponse : ResponseParam
    {
        public CRMCardResponseInfo CardInfo { get; set; }

    }

    #endregion
}
