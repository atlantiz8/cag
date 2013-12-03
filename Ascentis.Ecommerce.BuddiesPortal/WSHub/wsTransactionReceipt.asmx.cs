using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;
using Ascentis.Ecommerce.DataEntity.DataEntity;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Text;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for wsTransactionReceipt
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsTransactionReceipt : WsValidator
    {
        [WebMethod(EnableSession = true)]
        public string CancelOrder(string orderid, string sorderno)
        {
            // 1. to update OFS
            // 2. if OFS yes, operation in local db.
            // 3. to update SaleForce for Refund

            // 2.
            #region Validation
            int orderno = 0;
            int.TryParse(orderid, out orderno);
            if (orderno <= 0)
                throw new Exception("Invalid Order Number.");

            if (string.IsNullOrEmpty(sorderno))
                throw new Exception("Invalid sale order number.");

            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string member_name = baseClass.CurrentMemberName;
            int member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Logged Out!");
            #endregion

            bool isSuccess = false;
            string msg = string.Empty;
            string su_msg = "Order has been Cancelled!";
            string fi_msg = "Failed to cancel this order!";

            using (TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient t = new TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient())
            {
                try
                {
                    double cancelledAmount = 0;
                    isSuccess = t.CancelOrder(orderno, member_id, member_name, ref cancelledAmount);

                    // notify to OFS cancellation into
                    // emai sending
                    if (isSuccess)
                    {
                        using (OfsServiceWCFClient.OfsServiceClient ofs = new OfsServiceWCFClient.OfsServiceClient())
                        {
                            var ofs_result = ofs.CancelOrder(sorderno);
                        }

                        // edited on 5/4/2014. sending cancellation email will be done in ofs.CancelOrder(sorderno);
                        /*
                        try
                        {
                            
                            string smtp_host = System.Configuration.ConfigurationManager.AppSettings["SmtpHost"];
                            string email_from = System.Configuration.ConfigurationManager.AppSettings["SmtpFromEmail1"];
                            string email_subject = "Order cancellation confirmed";
                            string email_body = string.Format(@"Dear {0},<br/><br/>
                                            Your cancellation for order <b>{1}</b> has been sent for processing. Your cancellation reference number is {2}.<br/>

                                                To check cancellation details log on to http://www.ishopchangi.com <br/><br/>

                                            Sincerely,<br/>
                                            ishopchangi.com", baseClass.CurrentMemberName.Replace("#", " "), sorderno, sorderno);

                            Ascentis.Ecommerce.CommonLib.SendEmail se = new CommonLib.SendEmail(email_from, baseClass.CurrentMemberID, null, smtp_host, null, null);
                            se.SendMessage(email_subject, email_body, null, true);
                           
                            using (OfsServiceWCFClient.OfsServiceClient ofs=new OfsServiceWCFClient.OfsServiceClient())
                            {
                            } 
                            
                        }
                        catch (Exception)
                        {
                        }*/

                    }

                    msg = isSuccess ? su_msg : fi_msg;
                }
                catch (Exception x)
                {

                    msg = fi_msg;
                    throw new Exception(fi_msg);
                }
            }

            return msg;
        }

        [WebMethod(EnableSession = true)]
        public void OpenRefundCase(string orderid)
        {
            #region Validation

            int orderno = 0;
            int.TryParse(orderid, out orderno);
            if (orderno <= 0)
                throw new Exception("Invalid Order Number.");

            BaseClass.BasePage baseClass = new BaseClass.BasePage();

            int member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Logged Out!");

            #endregion

            using (SalesForceRefundServiceWCFClient.RefundServiceClient sf = new SalesForceRefundServiceWCFClient.RefundServiceClient())
            {
                try
                {
                    sf.OpenRefundCaseByOrderID(orderno);
                }
                catch (Exception x)
                {
                    throw x;
                }
            }

        }

        [WebMethod(EnableSession = true)]
        public string GetOrderShortInformation(string orderid)
        {
            #region Validation
            long orderno = 0;
            long.TryParse(orderid, out orderno);
            if (orderno <= 0)
                throw new Exception("Invalid Order Number");

            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string member_name = baseClass.CurrentMemberName;
            int member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Loggin Out!");

            #endregion

            OrderShortInfo o = new OrderShortInfo();
            using (TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient t = new TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient())
            {
                o = t.GetShortOrderInformation(orderno, member_id);
            }


            JavaScriptSerializer js = new JavaScriptSerializer();
            var result = js.Serialize(o);

            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetOrderDetails(string orderid, string language)
        {
            #region Validation
            int orderno = 0;
            int.TryParse(orderid, out orderno);
            if (orderno <= 0)
                throw new Exception("Invalid Order Number");

            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string member_name = baseClass.CurrentMemberName;
            int member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Loggin Out!");

            if (string.IsNullOrEmpty(language)) language = "en-US";
            #endregion
            return GetOrderDetails(orderno, member_id, language);

        }

        [WebMethod(EnableSession=true)]
        public string IsOrderWithAlcohol(string orderid, string language)
        {
            bool withAlcohol = false;
            List<OrderDetails> od = new List<OrderDetails>();
            using (TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient t = new TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient())
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                int member_id = baseClass.CurrentMemberAutoID;
                if (string.IsNullOrEmpty(language)) language = "en-US";
                long order_id = 0;
                long.TryParse(orderid, out order_id);
                od = t.GetOrderDetails(order_id, member_id, language).ToList<OrderDetails>();
                withAlcohol = od.Where(o => o.IsLAGItem == true).Count() > 0;
            }
            return withAlcohol.ToString();
        }

        private string GetOrderDetails(int orderid, int member_id, string language)
        {
            List<OrderDetails> od = new List<OrderDetails>();
            using (TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient t = new TransactionReceiptServiceWCFClient.TransactionReceiptServiceClient())
            {
                od = t.GetOrderDetails(orderid, member_id, language).ToList<OrderDetails>();
                return BuildHTML(od);
            }
        }

        private string BuildHTML(List<OrderDetails> od)
        {
            #region GroupBox
            string groupbox = "<div class='groupbox'>{0}</div>";
            #endregion

            #region Retailer Bar
            string retail_bar = @"<div class='groupbar'>
                                    <div class='groupheader'>Retailer:{0}</div>
                                       <!-- <ul class='groupvoucher'>
                                            <li>E-coupon:</li>
                                            <li>None </li>
                                        </ul> -->
                                        <div class='clear'></div>
                                    </div>";
            #endregion

            #region Product Row
            string product_row = @"<div class='item {0}'>
                            <!--alternative row = item brown-->
                            <div class='itemimg'>
                                <a href='{1}'><img height='59px' width='59px' src='{11}' class='img' /></a>
                            </div>
                            <div class='itemdes'>
                                <li>
                                    <h1 class='itemname'>
                                      <a href='{1}'>  {2} </a>
                                    </h1>
                                </li>
                                <li class='itemnum'>SKU:{3}</li>
                                    {4}
                                <!-- to be replaced alert here-->
                            </div>
                            
                            <div class='itemoption'>
                                <!--to be replaced Attribute Set -->
                                  {5}

                                <div class='clear'>
                                </div>
                            </div>
                            <ul style='text-align:center;' class='itemqty'>
                                <li>{6}</li>
                                {12}
                            </ul>
                            <ul class='itemunit'>
                                <li class='unitprice'>S${7}</li>
                                <li>{8}
                                    Savings: <span>S${9}</span></li>
                            </ul>
                            <div class='itemtotal'>
                                S${10}
                            </div>
                            <div class='clear'>
                            </div>
                        </div>";
            #endregion

            #region Endline
            string endline = "<div class='clear'></div>  <div class='endline'></div> <div class='clear'></div>";
            #endregion

            #region E-COUPON USED:
            string e_coupon_used = @"<div class='grid_6 alpha'>
                            <ul class='ecoupon'>
                                <li class='title'>E-coupon Used:</li>
                               <!-- <li>Coupon Selected</li> -->
                                <div class='clear'></div>
                                {0}
                            </ul>
                            
                        </div>";
            #endregion

            #region Place Holder {} Reference
            /*
              
             Product Line
            {0} = white (or) brown
            {1} = product url
            {2} = Item name
            {3} = SKU
            {4} = alert
            {5} = attribute set
            {6} = quantity
            {7} = unitprice
            {8} = downtown price
            {9} = gst saving
            {10} = total
            {11} = item image url
            {12} = quantity reduced

            Total
            {0} = total saving
            {1} = total points earned
            {2} = total ecoupon discount
            {3} = net total
              
              */
            #endregion

            //1) get unit retailer to make rows by Retailer
            //2) make a product rows by retailer
            //3) add endline
            //4) Total

           // var retailer = (from p in od group p by p.ConcessionaireCode into g select new { ConcessionaireCode = g.Key, ConcessionaireName = g });

            var retailer = (from p in od select new { ConcessionaireCode = p.ConcessionaireCode, ConcessionaireName = p.ConcessionareName }).Distinct();
            StringBuilder _groupbox = new StringBuilder();

            foreach (var item in retailer)
            {
                _groupbox.Append(string.Format(retail_bar, item.ConcessionaireName));


                var products = (from p in od where p.ConcessionaireCode == item.ConcessionaireCode select p);


                string row_color = "white";
                //Downtown Price: <span>${8}</span>
                foreach (var p in products)
                {
                    _groupbox.Append(string.Format(product_row,
                        string.Format("{0} {1}", row_color, p.IsFullCancellation ? string.Empty : p.Quantity <= 0 ? "cancel_item" : string.Empty), // put css :line-through if item is partial cancelled.
                                                            string.Format(@"/Product/Product.aspx?groupID={0}&retailerID={1}", p.ProductGroupAutoID, p.RetailerID),
                                                            p.ProductName,
                                                            p.SKUName,
                                                            p.IsLAGItem == true ? GetProductAlert() : string.Empty,
                                                            GetProductAttribute(p.AttributeSet, p.ProductGroup_Code),
                                                            p.IsFullCancellation ? p.OriginalQuantity : p.Quantity <= 0 ? p.OriginalQuantity : p.Quantity,
                                                           string.Format("{0:#,###.00}", p.UnitPrice),
                                                            p.DowntownPrice < 1 ? string.Empty : string.Format("List Price: <span>S${0:#,###.00}</span><br/>", p.DowntownPrice),
                                                            string.Format("{0:#,###.00}", p.GSTSaving),
                                                            string.Format("{0:#,###.00}", p.IsFullCancellation ? p.OriginalLineTotal : p.Quantity <= 0 ? p.OriginalLineTotal : p.LineTotal),
                                                            !string.IsNullOrEmpty(p.ImgURL) ? p.ImgURL.Replace("_std.jpg", "_190x190.jpg"): string.Empty,
                                                            p.OriginalQuantity != p.Quantity && p.Quantity > 0 ? string.Format("<li style='font-size:11px;color:#AA3131;' >*&nbsp;Reduced from {0}</li>", p.OriginalQuantity) : string.Empty
                                  ));

                    row_color = row_color == "white" ? "brown" : "white";

                }

            }

            StringBuilder _html = new StringBuilder();
            _html.Append(string.Format(groupbox, _groupbox.ToString()));
            _html.Append(endline); // add endline

            //glaissa added apr 07 2013, display promotion code
            string promocode = (from p in od select p.OrderPromotionCode).FirstOrDefault();
            string promocode_place_holder = @"<li class='title'>Promotion Code Used:</li>
                                              <li>{0}</li>
                                              <div class='clear'></div>";
            string promocode_html = String.Empty;
            if (!String.IsNullOrEmpty(promocode))
            {
                promocode_html = String.Format(promocode_place_holder, promocode);             
            }
            e_coupon_used = String.Format(e_coupon_used, promocode_html);

            _html.Append(e_coupon_used); // add coupone selected
            _html.Append(GetOrderTotal(od)); // added total

            return _html.ToString();

        }

        // get alert html
        private string GetProductAlert()
        {
            #region Product Row Alert

            string product_alert = @" <li class='alert'><a href='#'>
                                    <img width='17' height='13' class='icon' src='img/icon/alert.png'>Click for more
                                    info.</a>
                                    <div class='clear'>
                                    </div>
                                    *This item is a LAG, the chosen country of destination requires product to be collected
                                    at Collection Centre. </li>";
            #endregion
            return "";
        }

        // get attribute html
        private string GetProductAttribute(string attr, string groupCode)
        {
            #region Product Attribute

            string product_attribute = @" <ul class='name'>
                                    <li>Color:</li>
                                    <li>Size:</li>
                                </ul>
                                <ul class='selection'>
                                    <li>Green</li>
                                    <li>EU40</li>
                                </ul>";
            #endregion

            string str_attri = " <ul class='name'> {0}</ul><ul class='selection'>{1}</ul>";
            string _li_name = "<li>{0}</li>";
            string _li_value = "<li>{0}</li>";

            StringBuilder sb_name = new StringBuilder();
            StringBuilder sb_value = new StringBuilder();

            string[] rowSplitter = new string[] { "$$" };
            string[] valueSplitter = new string[] { "@#" };//Modified by ChenChi on May 08 2013, the value splitter is @# rather than space
            string[] row_data = new string[] { };
            row_data = attr.Split(rowSplitter, StringSplitOptions.RemoveEmptyEntries);
            string[] column_data = new string[] { };

            if (row_data.Length <= 0)// if there was no attributes, keep html alignment correct.
            {
                sb_name.Append(string.Format(_li_name, "&nbsp;"));
                sb_value.Append(string.Format(_li_value, "&nbsp;"));
            }
            else
            {

                for (int i = 0; i < row_data.Length; i++)
                {

                    column_data = row_data[i].Split(valueSplitter, StringSplitOptions.RemoveEmptyEntries);
                    sb_name.Append(string.Format(_li_name, column_data[1] + ":"));
                    if (!String.IsNullOrEmpty(groupCode) && column_data[3].IndexOf("/") > 0 && column_data[1].Trim().ToLower() == "shade")
                    {
                        string value = column_data[3];
                        if (column_data[3].IndexOf("(") == 0)
                        {
                            value = value.Substring(value.IndexOf(")") + 1).Trim();
                        }
                        sb_value.Append(string.Format(_li_value, value.Substring(0, value.IndexOf("/") - 1)));
                    }
                    else
                    {
                        sb_value.Append(string.Format(_li_value, column_data[3]));
                    }
                }
            }

            return string.Format(str_attri, sb_name.ToString(), sb_value.ToString());
        }

        //get total
        private string GetOrderTotal(List<OrderDetails> od)
        {
            #region Total
            string total = @"<div style='margin-left:27px;' class='grid_8 alpha push_1'><div class='total'>
                                <ul class='titles'>
                                    <li>Total Savings</li>
                                   <!-- <li>Total Points Earned</li>
                                    <li>
                                        <div class='text'>Total E-Coupon Discount(s)</div>
                                        <a class='icon' href='#'></a>
                                    </li> -->
                                </ul>
                                
                                <ul class='prices'>
                                    <li>S${0}</li>
                                   <!-- <li>{1}</li>
                                    <li>{2}</li> -->
                                </ul>
                                {4}
                                <div class='clear'></div>
                                <div class='divider'></div>
                                <ul>
                                    <li class='titles'>Total</li>
                                    <li class='prices'>S${3}</li>
                                </ul>
                                
                                <div class='clear'></div>
                                
                                <div class='divider'></div>
                                
                            </div></div>";

            string discount_place_holder = @"<div class='clear'></div>                               
                                <ul>
                                    <li class='titles'>Total Promotion Discount</li>
                                    <li class='prices'>S${0:0.00}</li>
                                </ul>";
            #endregion
            double gst_total, net_total;


            //p.Quantity==0 means  items was partially cancelled

            var gst = from p in od select p.IsFullCancellation ? p.GSTSaving : p.Quantity <= 0 ? 0.00 : p.GSTSaving;
            gst_total = gst.Sum();

            double discount_amount = (from p in od select p.OrderDiscountAmount).FirstOrDefault();

            string discount_amount_html = string.Empty;
            if (discount_amount > 0)
               discount_amount_html= string.Format(discount_place_holder, discount_amount);

            var net = from p in od select p.IsFullCancellation ? p.OriginalLineTotal : p.Quantity <= 0 ? 0.00 : p.LineTotal;
            net_total = net.Sum();

            return string.Format(string.Format("{0:#,###.00}", total), string.Format("{0:#,###.00}", gst_total), 0, 0, string.Format("{0:#,###.00}", net_total - discount_amount), discount_amount_html);
        }


    }
}
