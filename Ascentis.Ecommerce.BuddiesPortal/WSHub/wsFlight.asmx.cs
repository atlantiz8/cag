using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using System.Text;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;
using Ascentis.Ecommerce.Services.EcommService.OfsService;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{

    /// <summary>
    /// Summary description for wsFlight
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsFlight :WsValidator
    {

        [WebMethod(EnableSession = true)]
        public string GetMemberFlightDetails(string dateFormat)
        {
            string result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    using(FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
                    {
                        string status = String.Empty;
                        FlightDetailEntity fids = fc.GetFlightInfoByMemberID(MemberAutoID);
                        status = ((fids == null) || (fids.FlightNo == null || fids.FlightNo == String.Empty)) ? "2" : "0";
                        if (fids != null)
                        {
                            JavaScriptSerializer jss = new JavaScriptSerializer();
                            result = jss.Serialize(fids);

                            StringBuilder sb = new StringBuilder();
                            sb.Append("{\"status\":" + status + ", ");
                            sb.Append("\"Member_AutoID\":" + fids.Member_AutoID + ", ");
                            sb.Append("\"Passport\":\"" + fids.Passport + "\", ");
                            sb.Append("\"FlightNo\":\"" + fids.FlightNo + "\", ");
                            sb.Append("\"FlightDestination\":\"" + fids.FlightDestination + "\", ");
                            sb.Append("\"FlightTerminal\":\"" + fids.FlightTerminal + "\", ");

                            if (fids.FlightDateTime != null)
                            {
                                DateTime fDate = fids.FlightDateTime.Value.Date;
                                sb.Append("\"FlightDateTime\":\"" + fDate.ToString(dateFormat) + "\", ");
                                //Added by ChenChi on May 08 2013 to double verify the 1-14-day window rule
                                TimeSpan diff = fDate.Subtract(DateTime.Now);
                                sb.Append("\"FlightDT114Flag\":\"" + ((diff.TotalHours >= 24 && diff.TotalHours <= 336) ? "1" : "0") + "\", ");
                            }
                            else
                            {
                                sb.Append("\"FlightDateTime\":\"\", ");
                                sb.Append("\"FlightDT114Flag\":\"0\", ");
                            }

                            sb.Append("\"FlightAirportCode\":\"" + fids.FlightAirportCode + "\", ");
                            sb.Append("\"FlightDepartureTime\":\"" + fids.FlightDepartureTime + "\"} ");

                            result = sb.ToString();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = "{\"status\": 1 }";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string GetFlightInfoByOrderId(string orderid)
        {
            #region Validation
           
            int orderno = 0;
            int.TryParse(orderid, out orderno);
            if (orderno <= 0)
                throw new Exception("Invalid Order Number");

            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string member_name = baseClass.CurrentMemberName;
            long member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Logged Out!");

            #endregion

            string result = String.Empty;

            try
            {
                using (FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
                {
                    FlightDetailEntity fids = fc.GetFlightInfoByOrderId(orderno,member_id);
                    if (fids == null)
                    {
                        result = "{\"status\":2 }";
                    }
                    else if (fids.FlightNo == null || fids.FlightNo == String.Empty)
                    {
                        result = "{\"status\":2 }";
                    }
                    else
                    {
                        JavaScriptSerializer jss = new JavaScriptSerializer();
                        result = jss.Serialize(fids);

                        StringBuilder sb = new StringBuilder();
                        sb.Append("{\"status\":0, ");
                        sb.Append("\"Member_AutoID\":" + fids.Member_AutoID + ", ");

                        sb.Append("\"FlightInfo_AutoID\":" + fids.AutoID + ", ");

                        sb.Append("\"Passport\":\"" + fids.Passport + "\", ");
                        sb.Append("\"FlightNo\":\"" + fids.FlightNo + "\", ");
                        sb.Append("\"FlightDestination\":\"" + fids.FlightDestination + "\", ");
                        sb.Append("\"FlightTerminal\":\"" + fids.FlightTerminal + "\", ");

                        DateTime fDate = fids.FlightDateTime.Value.Date;
                        sb.Append("\"FlightDateTime\":\"" + fDate.ToString("dd MMM yyyy") + "\", ");
                        sb.Append("\"FlightDepartureTime\":\"" + fids.FlightDepartureTime + "\"} ");
                        result = sb.ToString();
                    }
                }

            }
            catch (Exception x)
            {
                throw x;
                result = "{\"status\": 1 }";
            }

            return result;

        }

        [WebMethod]
        public string GetFlightDestination(string FlightNo, DateTime FlightDateTime)
        {
            String result = String.Empty;
            try
            {
                using (FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
                {                   
                        FlightDetailEntity fids = fc.GetFlightInfoByFlightNo(FlightNo, FlightDateTime);
                        StringBuilder sb = new StringBuilder();
                        if (fids != null)
                        {
                            Tuple<DateTime, DateTime, bool> opResult = fc.IsOperationHourValid(0, fids.FlightDateTime, fids);
                            bool isValid = opResult.Item3;

                            //bool isValid = fc.IsOperationHourValid(0,fids.FlightDateTime,fids);
                            if (isValid)
                            {
                                DateTime currentDate = DateTime.Now;
                                DateTime flightDate = (DateTime)fids.FlightDateTime;
                                TimeSpan diff = flightDate.Subtract(currentDate);
                                if (diff.TotalHours >= 24 && diff.TotalHours <= 336)
                                {
                                    sb.Append("{\"status\":0 ,");
                                    sb.Append("\"params\": {");
                                    sb.Append("\"match\":\"" + fids.FlightDestination + "\", \"id\":" + fids.AutoID + ", \"airportcode\":\"" + fids.FlightAirportCode + "\"");
                                    sb.Append("}}");
                                    result = sb.ToString();
                                }
                                else
                                {
                                    result = "{\"status\":1}";
                                }
                            }
                            else
                            {
                                TimeSpan opEnd = opResult.Item1.TimeOfDay;
                                TimeSpan opStart = opResult.Item2.TimeOfDay;
                                DateTime dtEnd = new DateTime();
                                DateTime dtStart = new DateTime();

                                dtEnd = dtEnd.Add(opEnd).Add(TimeSpan.FromMinutes(-30));
                                dtStart = dtStart.Add(opStart).Add(TimeSpan.FromHours(-1)).Add(TimeSpan.FromMinutes(-30));

                                result = "{\"status\":3, \"opstart\":\"" + dtStart.ToString("h:mm tt") + "\", \"opend\":\"" + dtEnd.ToString("h:mm tt") + "\"}";
                            }
                        }
                        else
                        {
                            result = "{\"status\":2}";
                        }
                   
                }
            }
            catch (Exception ex)
            {
                return "{\"status\":-1}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string UpdateFlightDetailsByMemberID(string Flight_AutoID, string FlightDate)
        {
            String result = String.Empty;
            try
            {
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long MemberAutoID = 0;
                if (baseClass.CurrentMemberAutoID != 0)
                {
                    MemberAutoID = baseClass.CurrentMemberAutoID;
                    using (FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
                    {
                      
                        IFormatProvider culture = System.Threading.Thread.CurrentThread.CurrentCulture;
                        DateTime? dtFlight = null;
                        int? fID = null;
                        if (FlightDate != null && FlightDate != String.Empty)
                        {
                            dtFlight = DateTime.ParseExact(FlightDate, "dd MMM yyyy", null, System.Globalization.DateTimeStyles.None);
                        }
                        if (Flight_AutoID != null && Flight_AutoID != "0")
                        {
                            fID = int.Parse(Flight_AutoID);
                        }
                        
                        int rs = fc.UpdateFlightDetailsByMemberID(MemberAutoID, fID, dtFlight);
                        result = "{\"status\":" + rs + "}";
                    }
                }
            }
            catch (Exception ex)
            {
                return "{\"status\":-1}";
            }
            return result;
        }

        [WebMethod(EnableSession = true)]
        public string UpdateFlightInfoByOrderId(string Flight_AutoID, string FlightDate, string FlightInfo_AutoID, string orderid, string sorderno)
        {
            #region Validation

            int orderno = 0;
            int flightinfo_id = 0;
            int fids_id = 0;
            int.TryParse(orderid, out orderno);
            int.TryParse(FlightInfo_AutoID,out flightinfo_id);
            int.TryParse(Flight_AutoID, out fids_id);

            DateTime dtFlight;

            if (orderno <= 0)
                throw new Exception("Invalid Order Number");

            if (flightinfo_id <= 0)
                throw new Exception("Invalid Flight Info ID");

            if (fids_id <= 0)
                throw new Exception("Invalid FIDS ID");

            //if(!DateTime.TryParse(FlightDate.Replace('/','-'),out dtFlight))
            //    throw new Exception("Invalid FlightDate");

            if (!DateTime.TryParseExact(FlightDate, "MM/dd/yyyy", null, System.Globalization.DateTimeStyles.None, out dtFlight))
                DateTime.TryParseExact(FlightDate, "dd MMM yyyy", null, System.Globalization.DateTimeStyles.None, out dtFlight);

            //dtFlight = Convert.ToDateTime(FlightDate);

            BaseClass.BasePage baseClass = new BaseClass.BasePage();
            string member_name = baseClass.CurrentMemberName;
            long member_id = baseClass.CurrentMemberAutoID;
            if (member_id < 1) throw new Exception("Member Logged Out!");

            #endregion

            string result = String.Empty;

            try
            {
                    using (FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
                    {
                        //IFormatProvider culture = System.Threading.Thread.CurrentThread.CurrentCulture;
                        //DateTime? dtFlight = null;

                        //if (FlightDate != null && FlightDate != String.Empty)
                        //{
                        //    dtFlight = DateTime.Parse(FlightDate, culture, System.Globalization.DateTimeStyles.AssumeLocal);
                        //}
                       
                            bool rs = fc.UpdateFlightInfoByOrderId(flightinfo_id, orderno, member_id, member_name, fids_id, dtFlight);
                            result = "{\"status\":2}";
                        
                    }

                    using (OfsServiceWCFClient.OfsServiceClient ofs=new OfsServiceWCFClient.OfsServiceClient())
                    {
                        OfsResult r= ofs.UpdateCustInfo(sorderno, member_id);
                    }
            }
            catch (Exception x)
            {
                throw x;
                //return "{\"status\":-1}";
            }
            return result;

        }

        [WebMethod]
        public string GetFlightDestinationCountries()
        {
            string result = String.Empty;
            using (FlightWCFClient.FlightServiceClient fc = new FlightWCFClient.FlightServiceClient())
            {                
                List<string> ctrList = fc.GetFlightDestinationCountries().ToList();
                JavaScriptSerializer jss = new JavaScriptSerializer();
                result = jss.Serialize(ctrList);
            }
            return result;
        }
    }
}
