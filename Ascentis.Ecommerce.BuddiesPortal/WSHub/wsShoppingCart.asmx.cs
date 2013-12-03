using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Text;

using Ascentis.Ecommerce.DataEntity.WebUIEntity;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for wsShoppingCart
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsShoppingCart : WsValidator
    {
        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string GetShoppingCartByMemberID(long MemberAutoID, string LanguageCode, bool needAttributeSet)
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long sMemberAutoID = baseClass.CurrentMemberAutoID;

                if (sMemberAutoID == MemberAutoID)
                {
                    using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                    {
                        List<ShoppingCartEntity> lstItems = sc.GetShoppingCartByMemberID(MemberAutoID, LanguageCode, needAttributeSet).ToList();
                        JavaScriptSerializer jss = new JavaScriptSerializer();
                        result = jss.Serialize(lstItems);
                    }
                }
            }
            catch (Exception)
            { }

            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetShoppingCart(string LanguageCode, bool needAttributeSet)
        {
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            long MemberAutoID = 0;
            string result = String.Empty;
            if (baseClass.CurrentMemberAutoID != 0)
            {
                MemberAutoID = baseClass.CurrentMemberAutoID;
            }
            using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
            {
                List<ShoppingCartEntity> lstItems = sc.GetShoppingCartByMemberID(MemberAutoID, LanguageCode, needAttributeSet).ToList();
                JavaScriptSerializer jss = new JavaScriptSerializer();
                result = jss.Serialize(lstItems);   
            }

            return result;
        }
   
        [WebMethod]
        public string GetShoppingCartItemByCartAutoID(long ShoppingCartAutoID, string LanguageCode, bool needAttributeSet)
        {
            string result = string.Empty;
            using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
            {
                ShoppingCartEntity cartEntity = sc.GetShoppingCartItemByCartAutoID(ShoppingCartAutoID, LanguageCode, needAttributeSet);
                GetShoppingCartItemByCartAutoIDJSON objTest = new GetShoppingCartItemByCartAutoIDJSON();
                objTest.id = cartEntity.ShoppingCartItem_AutoID;
                objTest.status = "4";
                
                JavaScriptSerializer jss = new JavaScriptSerializer();
                result = jss.Serialize(objTest);               
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public long GetCurrentMemberAutoID()
        {
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            long MemberAutoID = 0;
            if (baseClass.CurrentMemberAutoID != 0)
            {
                MemberAutoID = baseClass.CurrentMemberAutoID;
            }
            return MemberAutoID;
        }

        [WebMethod(EnableSession = true)]
        public string GetCurrentMemberDetails()
        {
            string result = String.Empty;
            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string MemberID = String.Empty;
            long MemberAutoID = 0;
            if (baseClass.CurrentMemberAutoID != 0)
            {
                MemberAutoID = baseClass.CurrentMemberAutoID;
                MemberID = baseClass.CurrentMemberID;
                using (MemberWCFClient.UserServiceClient msc = new MemberWCFClient.UserServiceClient())
                {
                    DataEntity.WebUIEntity.MemberEntity member = msc.GetMemberProfileByAutoID(MemberAutoID);
                    if (member != null)
                    {
                        StringBuilder sb = new StringBuilder();
                        sb.Append("{\"MemberAutoID\":\"" + MemberAutoID + "\", ");
                        int age = 0;
                        if (member.DateofBirth != null)
                        {
                            age = DateTime.Now.Year - member.DateofBirth.Value.Year;
                            age = age - (member.DateofBirth.Value.Month > DateTime.Now.Month ? 1 : (member.DateofBirth.Value.Month < DateTime.Now.Month ? 0 : (member.DateofBirth.Value.Day > DateTime.Now.Day ? 1 : 0)));
                        }                                                
                        sb.Append("\"MemberAge\":" + age.ToString() + "}");
                        result = sb.ToString();
                    }
                }                
            }
            return result;
        } 

        [WebMethod(EnableSession = true)]
        public string CreateShoppingCartItem2(long group, string langType, long retailer, List<CB_AddToCartJSON.option> options, string type, int qty, string flightAutoID, string flightDate, string flightDest)
        {
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                string MemberName = String.Empty;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    MemberName = baseClass.CurrentMemberName.Substring(0, (baseClass.CurrentMemberName.Length > 50 ? 50 : baseClass.CurrentMemberName.Length));
                }
 
                long newShoppingCartItemAutoID = -1;
                if (group > 0 && retailer > 0 && qty > 0)
                {
                    using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                    {
                        //options.Sort(CompareAttributeValue); glaissa removed july 3 2013
                        string attributeSet = ConvertAttributeListToString(options);

                        IFormatProvider culture = System.Threading.Thread.CurrentThread.CurrentCulture;
                        DateTime? dtFlight = null;
                        int? fID = null;
                        if (flightDate != null && flightDate != String.Empty)
                        {
                            dtFlight = DateTime.ParseExact(flightDate, "dd MMM yyyy", null, System.Globalization.DateTimeStyles.None);
                        }
                        if (flightAutoID != null && flightAutoID != "0")
                        {
                            fID = int.Parse(flightAutoID);
                        }
                        newShoppingCartItemAutoID = sc.CreateShoppingCartItem3(group, langType, retailer, attributeSet, qty, MemberAutoID, MemberName, fID, dtFlight, flightDest);
                    }
                }

                if (newShoppingCartItemAutoID > 0)
                {
                    return "{\"status\":0, \"member\":" + MemberAutoID + ", \"cartID\":" + newShoppingCartItemAutoID + "}";
                }

            }
            catch (Exception ex)
            {
                return "{\"status\": 1 }";
            }
            return "{\"status\": 1 }";
        }

        [WebMethod(EnableSession = true)]
        public string UpdateShoppingCartItemQuantity(long ShoppingCartAutoID, int NewQuantity)
        {
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                string ModifiedBy = String.Empty;
                long MemberAutoID = 0;
                
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    ModifiedBy = baseClass.CurrentMemberName.Substring(0, (baseClass.CurrentMemberName.Length > 50 ? 50 : baseClass.CurrentMemberName.Length));
                }
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    int rs = sc.UpdateShoppingCartItemQuantity(ShoppingCartAutoID, NewQuantity, ModifiedBy);
                    StringBuilder sb = new StringBuilder();
                    sb.Append("{\"status\":" + rs + ", \"member\":" + MemberAutoID + "}");
                    return sb.ToString();
                }
            }
            catch (Exception)
            {
                return "{\"status\": -1 }";
            }
        }

        [WebMethod(EnableSession = true)]
        public string DeleteShoppingCartItemByMember(long ShoppingCartAutoID)
        {            
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                }
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    int rs = sc.DeleteShoppingCartItem(ShoppingCartAutoID);
                    StringBuilder sb = new StringBuilder();
                    sb.Append("{\"status\":" + rs + ", \"member\":" + MemberAutoID + "}");
                    return sb.ToString();
                }
            }
            catch (Exception)
            {
                return  "{\"status\": -1 }";
            }
        }

        //[WebMethod(EnableSession = true)]
        //public string GenerateOrderNumber()
        //{
        //    try
        //    {
        //        using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
        //        {
        //            return sc.GenerateOrderNumber();
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        return string.Empty;
        //    }
        //}

        [WebMethod(EnableSession = true)]
        public string CheckoutUnpaidOrder(string LanguageCode, double DiscountAmt, string PromotionCode, string IsGuest)
        {
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                //string MemberName = 0;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    //MemberName = baseClass.CurrentMemberName;
                }

                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    string result = sc.CheckoutUnpaidOrder(MemberAutoID, LanguageCode, DiscountAmt,PromotionCode, (IsGuest =="true" ? true : false));
                    return jss.Serialize(result);
                }
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        [WebMethod(EnableSession = true)]
        public string GetShoppingCartProductAvailableStock()
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                }
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    List<ShoppingCartEntity> lstItems = sc.GetShoppingCartProductAvailableStock(MemberAutoID).ToList();
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(lstItems);  
                    return result;
                }
            }
            catch (Exception)
            {
                return result;
            }
        }

        [WebMethod(EnableSession = true)]
        public string GetShoppingCartValidationCheck()
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    List<ShoppingCartEntity> lstItems = sc.GetShoppingCartValidationCheck(MemberAutoID).ToList();
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(lstItems);
                    return result;
                }
            }
            catch (Exception)
            {
                return result;
            }
        }

        [WebMethod(EnableSession = true)]
        public string UpdatePaymentResult(string OrderNumber, string PaymentStatus, string CardType, string CardNo, string TransactionNo, double DiscAmt, string PromotionCode)
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    long orderAutoID = sc.UpdatePaymentResult(MemberAutoID, OrderNumber, "PayFailure", CardType, CardNo, TransactionNo, DiscAmt, PromotionCode);
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(orderAutoID);
                }
            }
            catch (Exception)
            {

            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string ReserveProduct(string LanguageCode)
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    string resultflag = sc.ReserveProduct(MemberAutoID, LanguageCode);
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(resultflag);
                }
            }
            catch (Exception)
            {

            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetProductInfo(long GroupAutoID, string LangType, long RetailerAutoID, List<CB_AddToCartJSON.option> options, int Quantity)
        {
            string result = string.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                if (MemberAutoID > 0)
                {
                    using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                    {
                        string attributeSet = ConvertAttributeListToString(options);
                        result = sc.GetProductJSONInfo(GroupAutoID, LangType, RetailerAutoID, attributeSet,Quantity,MemberAutoID);
                    }
                }
            }
            catch (Exception ex)
            {

            }
            return result;
        }

        [WebMethod]
        public string GetLAGLiquorMsgByAirportCode(string Destination)
        {
            string result = String.Empty;
            try
            {
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    result = sc.GetLAGLiquorMsgByAirportCode(Destination);
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(result);
                }
            }
            catch (Exception)
            {              
            }
            return result;
        }

        [WebMethod]
        public string GetLAGLiquorMsgByCountry(string Destination)
        {
            string result = String.Empty;
            try
            {
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    result = sc.GetLAGLiquorMsgByCountry(Destination);
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(result);
                }
            }
            catch (Exception)
            {
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetPromotionCode(string PromoCode, double OrderAmt)
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                int MemberAutoID = 0;
                MemberAutoID = baseClass.CurrentMemberAutoID;
                StringBuilder sb = new StringBuilder();
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    PromotionCodeEntity pc = sc.GetPromotionCodeByMember(PromoCode, MemberAutoID);
                    if (pc != null)
                    {
                        sb.Append("{\"status\":0, ");
                        sb.Append("\"id\":\"" + pc.AutoID + "\", ");
                        sb.Append("\"code\":\"" + pc.PromotionCode + "\", ");
                        sb.Append("\"type\":\"" + pc.PromotionCodeType.Trim().ToUpper() + "\", ");
                        sb.Append("\"discount\":\"" + pc.Discount + "\", ");
                        sb.Append("\"desc\":\"" + ((pc.Description == null) ? String.Empty : pc.Description) + "\", ");

                        string message = String.Empty;
                        if (pc.CountDown == 0)
                        {
                            message = "Promotion code has been fully redeemed.";
                        }
                        else if (!(DateTime.Now >= pc.StartDateTime && DateTime.Now <= pc.EndDateTime))
                        {
                            message = "Promotion code has already expired.";
                        }
                        else if (pc.IsRedeemed == true)
                        {
                            message = "Promotion code is already redeemed.";
                        }
                        else if (OrderAmt < pc.SpendAmtToRedeem)
                        {
                            message = "Promotion code is only valid for orders $" + pc.SpendAmtToRedeem.ToString() + " or above.";
                        }                        

                        sb.Append("\"message\":\"" + message + "\" }");
                    }
                    else
                    {
                        sb.Append("{\"status\":1, ");
                        sb.Append("\"message\":\"Promotion code is invalid.\" }");
                    }
                    result = sb.ToString();
                }
            }
            catch (Exception)
            {
            }
            return result;
        }


        [WebMethod]
        public string IsProductExceedsLimitedQty(long group, string langType, long retailer, List<CB_AddToCartJSON.option> options, int qty, long memberID)
        {
            string result = String.Empty;
            try
            {
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    options.Sort(CompareAttributeValue);
                    string attributeSet = ConvertAttributeListToString(options);

                    ShoppingCartEntity entity = sc.IsProductExceedsLimitedQty(group, langType, retailer, attributeSet, qty, memberID);
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(entity);
                }
            }
            catch (Exception)
            {
            }
            return result;
        }

        [WebMethod]
        public string ReplaceShoppingCartWishlist(long FromGuestAutoID, long ToMemberAutoID)
        {
            string result = String.Empty;
            try
            {
                using (ShoppingCartWCFClient.ShoppingCartServiceClient sc = new ShoppingCartWCFClient.ShoppingCartServiceClient())
                {
                    result = sc.ReplaceShoppingCartWishlist(FromGuestAutoID, ToMemberAutoID).ToString();
                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(result);
                }
            }
            catch (Exception)
            { }
            return result;
        }


        private static int CompareAttributeValue(CB_AddToCartJSON.option x, CB_AddToCartJSON.option y)
        {
            if (x == null || string.IsNullOrEmpty(x.value))
            {
                if (y == null || string.IsNullOrEmpty(y.value))
                {
                    return 0;
                }
                else
                {
                    return -1;
                }
            }
            else
            {
                if (y == null || string.IsNullOrEmpty(y.value))
                {
                    return 1;
                }
                else
                {
                    long x1 = 0;
                    long y1 = 0;
                    long.TryParse(x.value, out x1);
                    long.TryParse(y.value, out y1);

                    if (x1 < y1)
                    {
                        return -1;
                    }
                    else if (x1 > y1)
                    {
                        return 1;
                    }
                    else
                    {
                        return 0;
                    }
                }

            }
        }

        [Serializable]
        public class GetShoppingCartItemByCartAutoIDJSON
        {
            public string status { get; set; }
            public long id { get; set; }

            List<option> options = new List<option>();
            
            public class option
            {
                long id;
                bool selected;
                bool available;
                string value;
            }
        }

        public class CB_AddToCartJSON
        {
            public long group { get; set; }
            public string langType { get; set; }
            public long retailer { get; set; }
            public List<option> options = new List<option>();
            public string service { get; set; }
            public string type { get; set; }
            public int qty { get; set; }

            [Serializable]
            public class option
            {
                public long id { get; set; }
                public string value { get; set; }
            }
        }

        public class FlightInfo
        {
            public int flightID { get; set; }
            public DateTime flightDate { get; set; }
        }

        public static string ConvertAttributeListToString(List<CB_AddToCartJSON.option> options)
        {
            StringBuilder sb = new StringBuilder();
            string elementSplit = "";
            string dataFieldSplit = "@#";
            foreach (CB_AddToCartJSON.option item in options)
            {
                //sb.Append(item.value + "||");
                //27%@#40$$30%@#56$$64%@#163
                sb.Append(elementSplit + item.id + "%");
                sb.Append(dataFieldSplit + item.value);
                elementSplit = "$$";
            }

            return sb.ToString();
        }

        [Serializable]
        public class UnpaidCheckoutJSON
        {

        }

    }
}
