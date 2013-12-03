using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using System.Text;
using System.Net;
using System.IO;
using System.Security.Cryptography;
using System.Globalization;
using System.Web.Script.Serialization;
using Ascentis.Ecommerce.Services.EcommService.OfsService;
using Ascentis.Ecommerce.CommonLib;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;
//using Ascentis.Ecommerce.DataEntity.DataEntity;

namespace Ascentis.Ecommerce.BuddiesPortal.Checkout
{
    public partial class CitibankGateway : System.Web.UI.Page
    {
        bool WithPay = false;
        protected string JsEvalString = string.Empty;
        protected void Page_Load(object sender, EventArgs e)
        {
            string TransactionType = Request.QueryString["Type"];

            if (TransactionType != null)
            {
                switch (TransactionType.ToLower())
                {
                    case "pay": { InitiatePayment(); break; }
                    case "querydr": { WithPay = false; InitiateQueryDR(); break; }
                    case "querydrwithpay": { WithPay = true; InitiateQueryDR(); break; }
                }
                return;
            }

            //Payment Result Transaction
            if (Request.QueryString["vpc_TxnResponseCode"] != null)
            {
                PaymentResult();
                return;
            }

        }

        private void InitiatePayment()
        {
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = baseClass.CurrentMemberAutoID;

                string paymentGatewayURL = ConfigurationManager.AppSettings["VPC_PaymentGatewayURL"].ToString();
                string returnURL = ConfigurationManager.AppSettings["VPC_PaymentReturnURL"].ToString();
                string secureSecret = ConfigurationManager.AppSettings["VPC_SecureSecret"].ToString();

                string orderNo = String.Empty;
                double amount = 0;
                if (String.IsNullOrEmpty(Request.QueryString["OrderNo"]))
                {
                    Response.Write("<div class=content2>Please try again later. Should this problem persists, <br />please contact us at enquiry@changiairport.com.</div>");
                    JsEvalString = GenerateJSString();
                    return;
                }
                else
                {
                    orderNo = Request.QueryString["OrderNo"].ToString();
                }

                amount = Request.QueryString["Amount"] == null ? 0 : double.Parse(Request.QueryString["Amount"]);
                //Added by ChenChi for test purpose on Mar 19 2013, 
                //TODO: remove this line when deploy
                //amount = 100;

                //glaissa updated amount to * 100 for test purpose on mar 21 2013
                string testModuleSwitch = ConfigurationManager.AppSettings["VPC_TestModelSwitch"];
                if (testModuleSwitch.Equals("1"))
                {
                    amount = amount * 100;
                }

                //Build transaction request
                TransactionRequest paymentRequest = new TransactionRequest
                {
                    vpc_Version = ConfigurationManager.AppSettings["VPC_Version"].ToString(),
                    vpc_Command = "pay",
                    vpc_AccessCode = ConfigurationManager.AppSettings["VPC_AccessCode"].ToString(),
                    vpc_MerchTxnRef = orderNo,
                    vpc_Merchant = ConfigurationManager.AppSettings["VPC_MerchantID"].ToString(),
                    vpc_OrderInfo = orderNo,
                    vpc_Amount = amount,
                    vpc_Currency = ConfigurationManager.AppSettings["VPC_Currency"].ToString(),
                    vpc_Locale = "en",
                    vpc_ReturnUrl = returnURL,
                    vpc_ReturnAuthResponseData = "Y",
                    vpc_RiskBypass = "Y"
                };

                var transactionData = paymentRequest.GetPaymentParameters().OrderBy(t => t.Key, new VPCStringComparer()).ToList();
                paymentGatewayURL = paymentGatewayURL + "?" + String.Join("&", transactionData.Select(item => HttpUtility.UrlEncode(item.Key) + "=" + HttpUtility.UrlEncode(item.Value)));

                //Generate secure hash
                if (!String.IsNullOrEmpty(secureSecret))
                {
                    paymentGatewayURL += "&vpc_SecureHash=" + CreateMD5(secureSecret + String.Join("", transactionData.Select(item => item.Value)));
                }
                
                string logMsg = String.Format("Payment Start: [MemberID]: {0}| [OrderNo]: {1}| [Amount]: {2}| [TransactionRequest]: {3}", MemberAutoID, orderNo, amount, paymentGatewayURL);
                Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, logMsg);

                //Send data to Payment Gateway
                Response.Redirect(paymentGatewayURL);
            }
            catch (Exception ex)
            {
            }
        }

        private void PaymentResult()
        {
            try
            {
                string responseCode = Request.QueryString["vpc_TxnResponseCode"];
                string secureHash = Request.QueryString["vpc_SecureHash"];
                string secureSecret = ConfigurationManager.AppSettings["VPC_SecureSecret"].ToString();
                bool isValidHash = true;

                //Validate secure hash from response
                if (!string.IsNullOrEmpty(secureHash))
                {
                    if (!string.IsNullOrEmpty(secureSecret))
                    {
                        var rawHashData = secureSecret + String.Join("", Request.QueryString.AllKeys.Where(k => k != "vpc_SecureHash").Select(k => Request.QueryString[k]));
                        var signature = CreateMD5(rawHashData);
                        if (signature != secureHash)
                        {
                            isValidHash = false;
                        }
                    }
                }

                if (!isValidHash)
                {
                    Response.Write("<div class=content2>Please try again later. Should this problem persists, <br />please contact us at enquiry@changiairport.com.</div>");
                    JsEvalString = GenerateJSString();
                }
                else
                {
                    TransactionResponse paymentResponse = new TransactionResponse(Request);
                    using (Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient sco = new Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient())
                    {
                        BaseClass.BasePage baseClass = new BaseClass.BasePage();
                        long MemberAutoID = 0;
                        MemberAutoID = baseClass.CurrentMemberAutoID;

                        long orderAutoID = 0;

                        StringBuilder log = new StringBuilder();
                        log.Append("Payment Response Received:");
                        log.Append("MemberID:" + MemberAutoID);                        
                        log.Append("| [OrderNo]:" + paymentResponse.vpc_OrderInfo);
                        log.Append("| [Amount]:" + paymentResponse.vpc_Amount);
                        log.Append("| [TransactionNo]:" + paymentResponse.vpc_TransactionNo);
                        log.Append("| [TxnResponseCode]:" + paymentResponse.vpc_TxnResponseCode);
                        log.Append("| [Message]:" + paymentResponse.vpc_Message);
                        log.Append("| [TxnResponseDesc]:" + paymentResponse.vpc_TxnResponseDesc);
                        Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, log.ToString());

                        PromoDetails promo = null;
                        double discAmount = 0;
                        string promocode = String.Empty;
                        try
                        {
                            if (Request.Cookies["PromoDtls"] != null)
                            {
                                string promoDtls = HttpUtility.UrlDecode(Request.Cookies["PromoDtls"].Value);
                                JavaScriptSerializer jss = new JavaScriptSerializer();
                                promo = (PromoDetails)jss.Deserialize(promoDtls, typeof(PromoDetails));
                                if (promo != null)
                                {
                                    discAmount = (promo.type == "DOLLAR" ? promo.discount : 0);
                                    promocode = promo.code;
                                }
                            }
                        }
                        catch (Exception)
                        {
                        }

                        if (paymentResponse.vpc_TxnResponseCode == "0")
                        {                            
                            orderAutoID = sco.UpdatePaymentResult(MemberAutoID, paymentResponse.vpc_OrderInfo, "Paid", paymentResponse.vpc_Card, paymentResponse.vpc_CardNum, paymentResponse.vpc_TransactionNo, discAmount, promocode);
                            ClearShoppingCartCookie();

                            using (Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient ofs = new Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient())
                            {
                                OfsResult ofsResult = ofs.CreateNewOrder(paymentResponse.vpc_OrderInfo, MemberAutoID);
                            }

                            //send sales transaction to CRM for points calculation
                            try
                            {
                                using (Ascentis.Ecommerce.EcommPortal.MemberWCFClient.UserServiceClient msc = new Ascentis.Ecommerce.EcommPortal.MemberWCFClient.UserServiceClient())
                                {
                                    double amt = 0;
                                    double.TryParse(paymentResponse.vpc_Amount, out amt);

                                    string testModuleSwitch = ConfigurationManager.AppSettings["VPC_TestModelSwitch"];
                                    //gateway sends back the amount with the decimal point.
                                    //ex: sales amount = 443.00, gateway sends back as 44300.
                                    //amount to be sent to crm should be 443 only.
                                    amt = (testModuleSwitch.Equals("1") ? (amt/ 10000) : (amt / 100));
                                    
                                    msc.SendMemberSalesTxnToCRM(MemberAutoID, paymentResponse.vpc_OrderInfo, amt);
                                }
                            }
                            catch (Exception ex)
                            {
                            }

                            //if with promocode, reduce promotion countdown, log to file
                            try
                            {
                                if (promo != null)
                                {
                                    sco.ReducePromotionCodeCountdown(promo.id, 1);
                                    string promoLog = String.Format("Promotion Redeemed: [MemberID]: {0}| [PromoCode]: {1}|[Type]: {2}| [Discount]: {3}| [OrderNo]: {4}", MemberAutoID, promo.code, promo.type, promo.discount, paymentResponse.vpc_OrderInfo);
                                    Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, promoLog);
                                        
                                    Request.Cookies["PromoDtls"].Value = "";
                                    Response.Cookies["PromoDtls"].Expires = DateTime.Now.AddDays(-10);
                                }
                            }
                            catch (Exception)
                            {
                            }

                            string script = "parent.location.href = '../Transactions/Transaction_Receipts.aspx?order=" + orderAutoID + "&n=1'";
                            JsEvalString = script;

                            try
                            {
                                int member_id = baseClass.CurrentMemberAutoID;
                                EmailNewOrder(orderAutoID, member_id, promocode);
                                EmailStockNotification(orderAutoID);
                            }
                            catch (Exception)
                            {                               
                            }

                        }
                        else
                        {
                            orderAutoID = sco.UpdatePaymentResult(MemberAutoID, paymentResponse.vpc_OrderInfo, "PayFailure", paymentResponse.vpc_Card, paymentResponse.vpc_CardNum, paymentResponse.vpc_TransactionNo, discAmount, promocode);
                            string failedMsg = paymentResponse.vpc_TxnResponseDesc + "<br />Gateway response:" + paymentResponse.vpc_Message;

                            StringBuilder sb = new StringBuilder();
                            sb.Append("<div class=content1>");
                            sb.Append("Payment failed due to: " + paymentResponse.vpc_TxnResponseDesc + "<br />");
                            sb.Append("Gateway response: " + paymentResponse.vpc_Message + "</div>");
                            Response.Write(sb.ToString());

                            sb = new StringBuilder();
                            sb.Append("$('#hdOrderNo', window.parent.document).val('" + paymentResponse.vpc_OrderInfo + "');");
                            sb.Append("$('#overlay-container2 div.default', window.parent.document).height(150);");
                            sb.Append("$('#overlay-container2 div.default', window.parent.document).width(520);");
                            sb.Append("centerBox($('#overlay-container2 div.default', window.parent.document));");
                            sb.Append("$('#overlay-container2 div.default div.header a.close.closing', window.parent.document).css({ display:'block'});");
                            JsEvalString = sb.ToString();
                        }

                    }
                }
            }
            catch (Exception ex)
            {

            }
        }

        private void EmailNewOrder(long orderid, long memberid, string promoCode)
        {
            DataEntity.DataEntity.NewOrderDetail new_order;
            using (Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient ofs = new Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient())
            {

                new_order = ofs.GetNewOrderDetailByOrderID(orderid, memberid);

            }

            /*
            string theOrderDetails = String.Empty;
            using (TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient t = new TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient())
            {
                List<OrderDetails> od = new List<OrderDetails>();

                BaseClass.BasePage baseFun = new BaseClass.BasePage();
                string language = baseFun.GetCurrentLanguage();
                od = t.GetOrderDetails(orderid, memberid, language).ToList<OrderDetails>();

                foreach (OrderDetails o in od)
                {
                    theOrderDetails += o.ConcessionareName + " " + o.ProductName + " " + o.UnitPrice.ToString("#,##0.00") + " " + o.Quantity + " " + o.LineTotal.ToString("#,##0.00") + "<br/>";
                }
            }             
            */

            string email_content = @"Dear {0},<br/><br/>
                                    Your order {1} has been confirmed. <br/>
                                    Transact Date: {2}<br/>
                                    Transact Time: {3}<br/>
                                    Payment method: {4} ({5})<br/>
                                    Sales Order No: {6}<br/>
                                    Sales Amount: ${7} SGD<br/>
                                    Flight No: {8}<br/>
                                    Collection Centre: Changi Airport  {9}<br/><br/>
                                    {10}

                                    {11}

                                    Please be at the Collection Centre 60 minutes before your departure and present this Collection Slip, <br/>
                                    your passport, and boarding pass to the Customer Service Officer to collect your order.<br/><br/>

                                    Click <a href={12}>here</a> to locate the Collection Centre<br /><br />
      
                                    Sincerely,<br/>
                                    iShopChangi Team
                                    ";
            email_content = "<font face=\"Arial\">" + email_content + "</font>";
            string email_subject = string.Empty;
            string email_body = string.Empty;
            string member_email = string.Empty;
            if (new_order != null)
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                string memberName = new_order.MemberName;
                if (memberName.Split(new string[] { "#" }, StringSplitOptions.None).Count() > 0)
                {
                    memberName = memberName.Split(new string[] { "#" }, StringSplitOptions.None)[0];
                }

                string ecommURL = ConfigurationManager.AppSettings["EcommHost"].ToString().Trim();
                ecommURL = (ecommURL.ToLower().StartsWith("http") ? ecommURL : "http://" + ecommURL);

                HttpCookie isGuestCookie = HttpContext.Current.Request.Cookies["IsGuest"];

                email_body = string.Format(email_content, (!String.IsNullOrEmpty(memberName) ? memberName : "Guest")
                        , new_order.SalesOrderNumber
                        , new_order.OrderCreateDateTime.ToString("dd MMM yyyy")
                        , new_order.OrderCreateDateTime.ToString("HH:ss tt")
                        , new_order.CreditCardType
                        , new_order.CreditCard
                        , new_order.SalesOrderNumber
                        , string.Format("{0:0.00}", new_order.SalesAmount)
                        , new_order.FlightNumber
                        , new_order.TerminalNumber
                        , String.IsNullOrEmpty(promoCode) ? "" : "Promotion Code used: <b>" + promoCode + "</b><br/><br/>"
                        , (isGuestCookie != null && isGuestCookie.Value == "true") ? "" : "Log onto 'My Account' at " + ecommURL + " to view your order details.<br/><br/>"
                        , ecommURL + "/CustomerService/Collection.aspx");
 
                email_subject = "Collection slip for Order Number: " + new_order.SalesOrderNumber;

                member_email = new_order.MemberEmail;

                string mailFrom = string.Empty;
                string smtp_host = string.Empty;
                string smtpUser = string.Empty;
                string smtpPass = string.Empty;

                try
                {
                    mailFrom = ConfigurationManager.AppSettings["SmtpFromEmail1"];
                    smtp_host = ConfigurationManager.AppSettings["SmtpHost"];
                    smtpUser = ConfigurationManager.AppSettings["SmtpUserName"];
                    smtpPass = ConfigurationManager.AppSettings["SmtpPassword"];
                }
                catch (Exception)
                {
                }

                Ascentis.Ecommerce.CommonLib.SendEmail sm = new SendEmail(mailFrom, member_email, null, smtp_host, smtpUser, smtpPass);
                bool wasSent = sm.SendMessage(email_subject, email_body, null, true);


            }

        }

        private void EmailStockNotification(long orderAutoID)
        {
            string content = @"Dear Tenant,
                            <p>{0} (SKU {1}) has reached the restock limit. Please restock the inventory and update the stock quantity at http://admin.ishopchangi.com.</p>
                            Sincerely, <br/>
                            iShopChangi Team";
            content = "<font face=\"Arial\">" + content + "</font>";

            List<Ascentis.Ecommerce.DataEntity.DataEntity.CheckOut_GetStockInformation> stock_list = null;

            Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient c = new Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient();
            stock_list = c.GetStockInformation(orderAutoID).ToList<Ascentis.Ecommerce.DataEntity.DataEntity.CheckOut_GetStockInformation>();

            foreach (var item in stock_list)
            {
                if (!string.IsNullOrEmpty(item.Email))
                {
                    string mailFrom = string.Empty;
                    string smtp_host = string.Empty;
                    string smtpUser = string.Empty;
                    string smtpPass = string.Empty;

                    try
                    {
                        mailFrom = ConfigurationManager.AppSettings["MailFrom"];
                        smtp_host = ConfigurationManager.AppSettings["SmtpHost"];
                        smtpUser = ConfigurationManager.AppSettings["SmtpUserName"];
                        smtpPass = ConfigurationManager.AppSettings["SmtpPassword"];
                    }
                    catch (Exception)
                    {                        
                    }

                    Ascentis.Ecommerce.CommonLib.SendEmail sm = new SendEmail(mailFrom, item.Email, null, smtp_host, smtpUser, smtpPass);
                    bool wasSent = sm.SendMessage("[iShopChangi] Product restock required", string.Format(content, item.ProductName, item.SKU), null, true);

                    //using (System.Net.Mail.MailMessage m = new System.Net.Mail.MailMessage())
                    //{


                    //    m.IsBodyHtml = true;
                    //    m.Body = string.Format(content, item.ProductName, item.SKU);
                    //    m.Subject = "Product restock required";
                    //    m.To.Add(new System.Net.Mail.MailAddress(item.Email));
                    //    m.From = new System.Net.Mail.MailAddress("notification@ishopchangi.com.sg");
                    //    m.Priority = System.Net.Mail.MailPriority.High;

                    //    try
                    //    {

                    //        System.Net.Mail.SmtpClient sc = new System.Net.Mail.SmtpClient("119.73.200.204");
                    //        sc.Send(m);
                    //    }
                    //    catch (Exception)
                    //    {
                    //    }
                    //}
                }
            }

        }

        private void InitiateQueryDR()
        {
            try
            {
                string queryGatewayURL = ConfigurationManager.AppSettings["VPC_QueryDRGatewayURL"].ToString();
                string secureSecret = ConfigurationManager.AppSettings["VPC_SecureSecret"].ToString();

                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = baseClass.CurrentMemberAutoID;

                //Build transaction request
                TransactionRequest queryRequest = new TransactionRequest
                {
                    vpc_Version = ConfigurationManager.AppSettings["VPC_Version"].ToString(),
                    vpc_Command = "queryDR",
                    vpc_AccessCode = ConfigurationManager.AppSettings["VPC_AccessCode"].ToString(),
                    vpc_MerchTxnRef = Request.QueryString["OrderNo"],
                    vpc_Merchant = ConfigurationManager.AppSettings["VPC_MerchantID"].ToString(),
                    vpc_User = ConfigurationManager.AppSettings["VPC_UserID"].ToString(),
                    vpc_Password = ConfigurationManager.AppSettings["VPC_Password"].ToString()
                };

                var transactionData = queryRequest.GetQueryDRParameters().OrderBy(t => t.Key, new VPCStringComparer()).ToList();
                var postData = String.Join("&", transactionData.Select(item => HttpUtility.UrlEncode(item.Key) + "=" + HttpUtility.UrlEncode(item.Value)));

                string logMsg = String.Format("QueryDR Start: [MemberID]: {0}| [OrderNo]: {1}| [QueryDRRequest]: {2}", MemberAutoID, Request.QueryString["OrderNo"], queryGatewayURL + "?" + postData);
                Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, logMsg);

                string queryResponse = PostData(queryGatewayURL, postData);
                QueryDRResult(queryResponse);
            }
            catch (Exception ex)
            {
            }
        }

        private void QueryDRResult(string queryResponse)
        {
            try
            {
                if (queryResponse != null || queryResponse != "")
                {
                    BaseClass.BasePage baseClass = new BaseClass.BasePage();
                    long MemberAutoID = 0;
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    TransactionResponse queryDRResponse = new TransactionResponse(queryResponse);

                    StringBuilder log = new StringBuilder();
                    log.Append("QueryDR Response Received:");
                    log.Append("| [MemberID]:" + MemberAutoID);
                    log.Append("| [OrderNo]:" + queryDRResponse.vpc_OrderInfo);
                    log.Append("| [Amount]:" + queryDRResponse.vpc_Amount);
                    log.Append("| [TransactionNo]:" + queryDRResponse.vpc_TransactionNo);
                    log.Append("| [TxnResponseCode]:" + queryDRResponse.vpc_TxnResponseCode);
                    log.Append("| [Message]:" + queryDRResponse.vpc_Message);
                    log.Append("| [DRExists]:" + queryDRResponse.vpc_DRExists);
                    Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, log.ToString());

                    if (queryDRResponse.vpc_DRExists == "Y")
                    {
                        if (WithPay)
                        {
                            if (queryDRResponse.vpc_TxnResponseCode != "0")
                            {
                                InitiatePayment();
                            }
                            else
                            {
                                using (Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient sco = new Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient())
                                {
                                    PromoDetails promo = null;
                                    double discAmount = 0;
                                    string promocode = String.Empty;
                                    try
                                    {
                                        if (Request.Cookies["PromoDtls"] != null)
                                        {
                                            string promoDtls = HttpUtility.UrlDecode(Request.Cookies["PromoDtls"].Value);
                                            JavaScriptSerializer jss = new JavaScriptSerializer();
                                            promo = (PromoDetails)jss.Deserialize(promoDtls, typeof(PromoDetails));
                                            if (promo != null)
                                            {
                                                discAmount = (promo.type == "DOLLAR" ? promo.discount : 0);
                                                promocode = promo.code;
                                            }
                                        }
                                    }
                                    catch (Exception)
                                    {
                                    }

                                    long orderAutoID = sco.UpdatePaymentResult(MemberAutoID, queryDRResponse.vpc_OrderInfo, "Paid", queryDRResponse.vpc_Card, queryDRResponse.vpc_CardNum, queryDRResponse.vpc_TransactionNo, discAmount, promocode);
                                    ClearShoppingCartCookie();

                                    using (Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient ofs = new Ascentis.Ecommerce.EcommPortal.OfsServiceWCFClient.OfsServiceClient())
                                    {
                                        OfsResult ofsResult = ofs.CreateNewOrder(queryDRResponse.vpc_OrderInfo, MemberAutoID);
                                    }

                                    //if with promocode, reduce promotion countdown, log to file
                                    try
                                    {
                                        if (promo != null)
                                        {
                                            sco.ReducePromotionCodeCountdown(promo.id, 1);
                                            string promoLog = String.Format("Promotion Redeemed: [MemberID]: {0}| [PromoCode]: {1}|[Type]: {2}| [Discount]: {3}| [OrderNo]: {4}", MemberAutoID, promo.code, promo.type, promo.discount, queryDRResponse.vpc_OrderInfo);
                                            Logger.WriteLog(ELogLevel.INFO, LogCategory.Gen, promoLog);

                                            Request.Cookies["PromoDtls"].Value = "";
                                            Response.Cookies["PromoDtls"].Expires = DateTime.Now.AddDays(-10);
                                        }
                                    }
                                    catch (Exception)
                                    {
                                    }

                                    string script = "parent.location.href = '../Transactions/Transaction_Receipts.aspx?order=" + orderAutoID + "'";
                                    JsEvalString = script;

                                    try
                                    {
                                        int member_id = baseClass.CurrentMemberAutoID;
                                        EmailNewOrder(orderAutoID, member_id, promocode);
                                        EmailStockNotification(orderAutoID);
                                    }
                                    catch (Exception)
                                    {
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (WithPay)
                        {
                            using (Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient sc = new Ascentis.Ecommerce.EcommPortal.ShoppingCartWCFClient.ShoppingCartServiceClient())
                            {
                                BaseClass.BasePage baseFun = new BaseClass.BasePage();
                                string langType = baseFun.GetCurrentLanguage();
                                sc.ReserveProduct(MemberAutoID, langType);
                                InitiatePayment();
                            }
                        }
                    }
                }
                else
                {

                }
            }
            catch (Exception ex)
            {
            }
        }

        private void ClearShoppingCartCookie()
        {
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            long MemberAutoID = 0;
            MemberAutoID = baseClass.CurrentMemberAutoID;
            if (null != Request.Cookies["Cart-" + baseClass.CurrentMemberAutoID])
            {
                Request.Cookies["Cart-" + baseClass.CurrentMemberAutoID].Value = "";
                Response.Cookies["Cart-" + baseClass.CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-10);
            }
            if (null != Request.Cookies["CartCount-" + baseClass.CurrentMemberAutoID])
            {
                Request.Cookies["CartCount-" + baseClass.CurrentMemberAutoID].Value = "";
                Response.Cookies["CartCount-" + baseClass.CurrentMemberAutoID].Expires = DateTime.Now.AddDays(-10);
            }
        }

        private string CreateMD5(string RawData)
        {
            var hasher = MD5CryptoServiceProvider.Create();
            var HashValue = hasher.ComputeHash(Encoding.ASCII.GetBytes(RawData));
            return string.Join("", HashValue.Select(b => b.ToString("x2"))).ToUpper();
        }

        private string PostData(string url, string data)
        {
            string svrResponse = string.Empty;
            try
            {
                HttpWebRequest rq = (HttpWebRequest)WebRequest.Create(url);
                rq.Method = "POST";

                Byte[] byteArray = Encoding.UTF8.GetBytes(data);
                rq.ContentType = "application/x-www-form-urlencoded";
                rq.ContentLength = byteArray.Length;

                Stream streamData = rq.GetRequestStream();
                streamData.Write(byteArray, 0, byteArray.Length);
                streamData.Close();

                HttpWebResponse rs = (HttpWebResponse)rq.GetResponse();
                streamData = rs.GetResponseStream();

                StreamReader reader = new StreamReader(streamData);
                svrResponse = reader.ReadToEnd();
                reader.Close();
                streamData.Close();
                rs.Close();
            }
            catch
            {

            }
            return svrResponse;
        }

        private string GenerateJSString()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("$('#overlay-container2 div.default', window.parent.document).height(110); ");
            sb.Append("$('#overlay-container2 div.default', window.parent.document).width(440); ");
            sb.Append("centerBox($('#overlay-container2 div.default', window.parent.document));");
            sb.Append("$('#overlay-container2 div.default div.header a.close.closing', window.parent.document).css({ display:'block'});");
            return sb.ToString();
        }
    }

    public class TransactionRequest
    {
        public string vpc_Version { get; set; }
        public string vpc_Command { get; set; }
        public string vpc_AccessCode { get; set; }
        public string vpc_MerchTxnRef { get; set; }
        public string vpc_Merchant { get; set; }
        public string vpc_OrderInfo { get; set; }
        public double vpc_Amount
        {
            get { return _vpc_Amount; }
            set { _vpc_Amount = value; }
        }
        public string vpc_Currency { get; set; }
        public string vpc_Locale { get; set; }
        public string vpc_ReturnUrl { get; set; }
        public string vpc_ReturnAuthResponseData { get; set; }

        public string vpc_RiskBypass { get; set; }

        //Additional fields for Query DR
        public string vpc_User { get; set; }
        public string vpc_Password { get; set; }

        //Include Risk Management Fields here

        private double _vpc_Amount = 0;

        public TransactionRequest()
        {

        }

        public Dictionary<string, string> GetPaymentParameters()
        {
            var parameters = new Dictionary<string, string> {
                { "vpc_Version" ,vpc_Version},
                { "vpc_Command",vpc_Command},
                { "vpc_AccessCode" ,vpc_AccessCode},
                { "vpc_MerchTxnRef" ,vpc_MerchTxnRef},
                { "vpc_Merchant" ,vpc_Merchant},
                { "vpc_OrderInfo",vpc_OrderInfo},
                { "vpc_Amount" , _vpc_Amount.ToString("0.00", CultureInfo.InvariantCulture).Replace(".","") },
                {"vpc_Currency", vpc_Currency},                
                { "vpc_Locale",vpc_Locale},
                { "vpc_ReturnURL", vpc_ReturnUrl},
                { "vpc_ReturnAuthResponseData", vpc_ReturnAuthResponseData},
                { "vpc_RiskBypass", vpc_RiskBypass}
            };
            return parameters;
        }

        public Dictionary<string, string> GetQueryDRParameters()
        {
            var parameters = new Dictionary<string, string> {
                { "vpc_Version" ,vpc_Version},
                { "vpc_Command",vpc_Command},
                { "vpc_AccessCode" ,vpc_AccessCode},
                { "vpc_MerchTxnRef" ,vpc_MerchTxnRef},
                { "vpc_Merchant" ,vpc_Merchant},
                { "vpc_User", vpc_User},
                { "vpc_Password", vpc_Password}
            };
            return parameters;
        }
    }

    public class TransactionResponse
    {
        public string vpc_Command { get; set; } //*
        public string vpc_Merchant { get; set; } //*
        public string vpc_OrderInfo { get; set; } //*
        public string vpc_Amount { get; set; } //*
        public string vpc_Currency { get; set; } //*
        public string vpc_Message { get; set; } //*
        public string vpc_TxnResponseCode { get; set; } //*
        public string vpc_TxnResponseDesc { get; set; }

        public string vpc_MerchTxnRef { get; set; } //*
        public string vpc_ReceiptNo { get; set; } //*
        public string vpc_AcqResponseCode { get; set; } //*
        public string vpc_TransactionNo { get; set; } //*
        public string vpc_BatchNo { get; set; } //*
        public string vpc_AuthorizeId { get; set; } //*
        public string vpc_Card { get; set; } //*VC or MC

        //Returned only if System-Captured Masked Card in Digital Receipt privilege is enabled for the merchant
        public string vpc_CardNum { get; set; }

        //QueryDR fields
        public string vpc_DRExists { get; set; }
        public string vpc_FoundMultipleDRs { get; set; }

        public TransactionResponse(HttpRequest request)
        {
            Func<string, string> GetQueryStringValue = key =>
            {
                if (request.QueryString.AllKeys.Contains(key))
                {
                    return request.QueryString[key];
                }
                return String.Empty;
            };

            this.vpc_Command = GetQueryStringValue("vpc_Command");
            this.vpc_Merchant = GetQueryStringValue("vpc_Merchant");
            this.vpc_OrderInfo = GetQueryStringValue("vpc_OrderInfo");
            this.vpc_Amount = GetQueryStringValue("vpc_Amount");
            this.vpc_Currency = GetQueryStringValue("vpc_Currency");
            this.vpc_Message = GetQueryStringValue("vpc_Message");
            this.vpc_TxnResponseCode = GetQueryStringValue("vpc_TxnResponseCode");
            this.vpc_TxnResponseDesc = GetResponseDescription(this.vpc_TxnResponseCode);

            this.vpc_MerchTxnRef = GetQueryStringValue("vpc_MerchTxnRef");
            this.vpc_ReceiptNo = GetQueryStringValue("vpc_ReceiptNo");
            this.vpc_AcqResponseCode = GetQueryStringValue("vpc_AcqResponseCode");
            this.vpc_TransactionNo = GetQueryStringValue("vpc_TransactionNo");
            this.vpc_BatchNo = GetQueryStringValue("vpc_BatchNo");
            this.vpc_AuthorizeId = GetQueryStringValue("vpc_AuthorizeId");
            this.vpc_Card = GetQueryStringValue("vpc_Card");

            this.vpc_CardNum = GetQueryStringValue("vpc_CardNum");
        }

        public TransactionResponse(string responseData)
        {
            Dictionary<string, string> values = new Dictionary<string, string>();
            string[] data = responseData.Split('&');
            foreach (var item in data)
            {
                if (item != null || item != "")
                {
                    string key = item.Substring(0, item.IndexOf("="));
                    string value = item.Substring(item.IndexOf("=") + 1);
                    values.Add(key, value);
                }
            }

            Func<string, string> GetResponseValue = key =>
            {
                if (values.ContainsKey(key))
                {
                    return values[key];
                }
                return String.Empty;
            };


            this.vpc_Command = GetResponseValue("vpc_Command");
            this.vpc_Merchant = GetResponseValue("vpc_Merchant");
            this.vpc_OrderInfo = GetResponseValue("vpc_OrderInfo");
            this.vpc_Amount = GetResponseValue("vpc_Amount");
            this.vpc_Currency = GetResponseValue("vpc_Currency");
            this.vpc_Message = GetResponseValue("vpc_Message");
            this.vpc_TxnResponseCode = GetResponseValue("vpc_TxnResponseCode");
            this.vpc_TxnResponseDesc = GetResponseDescription(this.vpc_TxnResponseCode);

            this.vpc_MerchTxnRef = GetResponseValue("vpc_MerchTxnRef");
            this.vpc_ReceiptNo = GetResponseValue("vpc_ReceiptNo");
            this.vpc_AcqResponseCode = GetResponseValue("vpc_AcqResponseCode");
            this.vpc_TransactionNo = GetResponseValue("vpc_TransactionNo");
            this.vpc_BatchNo = GetResponseValue("vpc_BatchNo");
            this.vpc_AuthorizeId = GetResponseValue("vpc_AuthorizeId");
            this.vpc_Card = GetResponseValue("vpc_Card");

            this.vpc_CardNum = GetResponseValue("vpc_CardNum");

            this.vpc_DRExists = GetResponseValue("vpc_DRExists");
            this.vpc_FoundMultipleDRs = GetResponseValue("vpc_FoundMultipleDRs");
        }

        private string GetResponseDescription(string responseCode)
        {
            string responseDescription = "Unknown";
            switch (responseCode)
            {
                case "0": { responseDescription = "Transaction Successful"; break; }
                case "1": { responseDescription = "Transaction could not be processed"; break; }
                case "2": { responseDescription = "Transaction Declined - Contact Issuing Bank"; break; }
                case "3": { responseDescription = "Transaction Declined- No reply from Bank"; break; }
                case "4": { responseDescription = "Transaction Declined - Expired Card"; break; }
                case "5": { responseDescription = "Transaction Declined - Insufficient credit"; break; }
                case "6": { responseDescription = "Transaction Declined - Bank system error"; break; }
                case "7": { responseDescription = "Payment Server Processing Error"; break; }
                case "8": { responseDescription = "Transaction Declined - Transaction Type Not Supported"; break; }
                case "9": { responseDescription = "Bank Declined Transaction (Do not contact Bank)"; break; }
                case "A": { responseDescription = "Transaction Aborted"; break; }
                case "B": { responseDescription = "Transaction Blocked"; break; }
                case "C": { responseDescription = "Transaction Cancelled"; break; }
                case "D": { responseDescription = "Transaction Deferred"; break; }
                case "E": { responseDescription = "Transaction Declined"; break; }
                case "F": { responseDescription = "3D Secure Authentication Failed"; break; }
                case "I": { responseDescription = "Card Security Code Verification Failed"; break; }
                case "L": { responseDescription = "Shopping Transaction Locked"; break; }
                case "N": { responseDescription = "Cardholder is not enrolled in 3D Secure Authentication Scheme"; break; }
                case "P": { responseDescription = "Transaction is still being processed"; break; }
                case "R": { responseDescription = "Transaction not processed - Reached limit of retry attempts allowed"; break; }
                case "S": { responseDescription = "Duplicate SessionID (OrderInfo)"; break; }
                case "T": { responseDescription = "Address Verification Failed"; break; }
                case "U": { responseDescription = "Card Security Code Failed"; break; }
                case "V": { responseDescription = "Address Verification and Card Security Code Failed"; break; }
                case "?": { responseDescription = "Transaction status is unknown"; break; }
                default: { responseDescription = "Unable to determine"; break; }
            };
            return responseDescription;
        }

    }

    public class VPCStringComparer : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            var myComparer = CompareInfo.GetCompareInfo("en-US");
            return myComparer.Compare(x, y, System.Globalization.CompareOptions.Ordinal);
        }
    }

    public class PromoDetails
    {
        //promoDtls = { id: objResult.id, code: objResult.code, type: objResult.type, discount: objResult.discount }
        public int id { get; set; }
        public string code { get; set; }
        public string type { get; set; }
        public double discount { get; set; }
    }
}
