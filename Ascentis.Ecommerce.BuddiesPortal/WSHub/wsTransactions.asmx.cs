using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;
using System.Web.Script.Serialization;
using Ascentis.Ecommerce.CommonLib;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for wsTransactions
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsTransactions : WsValidator
    {
        private const String TransactCollection = "TransCollection";
        private const String RecordCount = "RecordCount";
        private const String LastIndex = "StartIndex";
        private const String EndIndex = "EndIndex";
        private const String NoData = "NoData";
        [WebMethod(EnableSession = true)]
        public string GetTransactions()
        {
            Uri uri = HttpContext.Current.Request.UrlReferrer;
          string json = "{\"hasItems\":<res>,\"records\":";;
            try
            {
          
                HttpContext.Current.Session[NoData] = "false";
                List<TransactionEntity> firstBatch = new List<TransactionEntity>();
                BaseClass.BasePage basePage = new BaseClass.BasePage();
                if (string.IsNullOrEmpty(basePage.CurrentMemberName))
                {
                    Logger.WriteLog(ELogLevel.ERROR, LogCategory.Gen, "Member Name is blank");
                    return "";
                }

                using (TransactionServiceWCFClient.TransactionServiceClient wcfClient = new TransactionServiceWCFClient.TransactionServiceClient())
                {
                    //TransactionEntity[] transactions = wcfClient.GetAllTransactions(basePage.CurrentMemberAutoID);
                    string logInfo = String.Format("Wcf Transaction Call :basePage.CurrentMemberAutoID {0},basePage.CurrentMemberName {1}", basePage.CurrentMemberAutoID, basePage.CurrentMemberName);
                    Logger.WriteLog(ELogLevel.ERROR, LogCategory.Gen, logInfo);
                    TransactionEntity[] transactions = wcfClient.GetAllTransactions(basePage.CurrentMemberAutoID, basePage.CurrentMemberName);
                    if (transactions != null && transactions.Count() > 0)
                    {
                        firstBatch = transactions.Skip(0).Take(5).ToList();
                        HttpContext.Current.Session[TransactCollection] = transactions;
                        json += GetStatusFromOfs(firstBatch, json);
                        int count = transactions.Count();
                        int takeNumber = 5;
                        if (transactions.Skip(5).Take(takeNumber).ToList().Count <= 0)
                        {
                            json = json.Replace("<res>", "0");
                        }
                        else
                        {
                            json = json.Replace("<res>", "1");
                        }
                    }
                    else
                    {
                        json = json.Replace("<res>", "0");
                        json += "\"\"";
                        Logger.WriteLog(ELogLevel.ERROR, LogCategory.Gen, "Empty transactions returned from TransactionWCF");
                    }

                }
            }
            catch (Exception ex)
            {
                Logger.WriteLog(ELogLevel.ERROR, LogCategory.Gen, "GetTransactions WSHub :"+ex.ToString());
            }
            json += "}";
            return json;
        }

       
      
        private string getJsonString(List<TransactionEntity> transactions)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            return serializer.Serialize(transactions);
        
        }
       
        [WebMethod(EnableSession = true)]
        public string ReOrder(string salesOrderNo)
        {
            string json = "{\"result\":\"fail\" }";
            if (HttpContext.Current.Session[TransactCollection] != null)
            {
                var transactions =(TransactionEntity[]) HttpContext.Current.Session[TransactCollection];
                TransactionEntity transEntity = transactions.Where(x => x.SalesOrderNo == salesOrderNo).FirstOrDefault();
                if (transEntity != null)
                {
                    using (TransactionServiceWCFClient.TransactionServiceClient client = new TransactionServiceWCFClient.TransactionServiceClient())
                    {
                        string result = client.ReOrder(transEntity);
                        if( String.IsNullOrEmpty(result))
                        {
                            json = "{\"result\":\"success\" }";
                        }
                    }
                }
            
            }
            return json;
        
        }



        [WebMethod(EnableSession = true)]
        public string ViewMoreRecords(int skip)
        {
            List<TransactionEntity> transBatch = new List<TransactionEntity>();
            string json = "{\"hasItems\":<res>,\"records\":"; ;
            if (HttpContext.Current.Session[TransactCollection] != null)
            {
                TransactionEntity[] transactions = (TransactionEntity[])HttpContext.Current.Session[TransactCollection];
              transBatch=  transactions.Skip(skip).Take(5).ToList();
              int count = transactions.Count();
               
              int nextSkip = skip + 5;
             
              if (transactions.Skip(nextSkip).Take(5).ToList().Count <= 0)
              {
                  json = json.Replace("<res>", "0");
              }
              else
              {
                  json = json.Replace("<res>", "1");
              }
               json += GetStatusFromOfs(transBatch, json);
               json += "}";
              

            }

            return json;
        
        }

        private string GetStatusFromOfs(List<TransactionEntity> transBatch, string json)
        {
            using (TransactionServiceWCFClient.TransactionServiceClient wcfClient = new TransactionServiceWCFClient.TransactionServiceClient())
            {
                TransactionEntity[] transactionsBatch = wcfClient.UpdateOrderStatusFromOfs(transBatch.ToArray());
                
                transBatch = (transactionsBatch != null && transactionsBatch.Count() > 0) ? transactionsBatch.ToList() : transBatch;
                json = getJsonString(transBatch);
            }
            return json;
        }

     

        
      
    }
}
