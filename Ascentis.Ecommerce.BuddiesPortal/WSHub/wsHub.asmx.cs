using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.Script.Services;

using Ascentis.Ecommerce.DataEntity.DataEntity;
using Ascentis.Ecommerce.EcommPortal.CommonFunction;
using System.Data;
using Ascentis.Ecommerce.DataEntity.WebUIEntity;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for wsHub
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    //[ScriptService]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class wsHub : WsValidator
    {
        [WebMethod]
        public string GetAllCategory(string langType, string isAllCategory)
        {
            try
            {
                using (CategoryWCFClient.CategoryServiceClient wcfCateClient = new CategoryWCFClient.CategoryServiceClient())
                {
                    return wcfCateClient.GetCategoryListAllWithJson(langType, Convert.ToInt32(isAllCategory));
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [WebMethod]
        public string GetBrand(string langType, string count)
        {
            try
            {
                using (BrandWCFClient.BrandServiceClient wcfClient = new BrandWCFClient.BrandServiceClient())
                {
                    return wcfClient.GetBrandLangWithJson(langType, 20);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        [WebMethod]
        public string GetBrandByCategores(string categoryID, string langType)
        {
            try
            {
                using (BrandWCFClient.BrandServiceClient wcfClient = new BrandWCFClient.BrandServiceClient())
                {
                    string brandList = wcfClient.GetBrandByCategoryWithJson(int.Parse(categoryID), langType, 100);
                    return "{\"a\":" + brandList + ",\"categoryID\":\"" + categoryID + "\"}";
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }

        [WebMethod]
        public string GetConcessionaire(string groupID)
        {
            try
            {
                using (ConcessionaireWCFClient.ConcessionaireServiceClient wcfClient = new ConcessionaireWCFClient.ConcessionaireServiceClient())
                {
                    int count = 6;
                    return wcfClient.GetConcessionaireListByGroupIDWithJson(long.Parse(groupID), count);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// Build by Sandy 7/3/2013
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [WebMethod]
        public string GetLanguageMaster()
        {
            try
            {
                using (LanguageMasterWCFClient.LanguageMasterServiceClient wcfClient = new LanguageMasterWCFClient.LanguageMasterServiceClient())
                {
                    return wcfClient.GetLanguageMasterWithJson();
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// Build by Sandy 8/3/2013
        /// <summary>
        /// 
        /// </summary>
        /// <param name="categorytype"></param>
        /// <param name="lang"></param>
        /// <returns></returns>
        [WebMethod]
        public string GetCategoryByType(string categorytype, string lang)
        {
            try
            {
                using (CategoryWCFClient.CategoryServiceClient wcfClient = new CategoryWCFClient.CategoryServiceClient())
                {
                    return wcfClient.GetCategoryLangByCategoryTypeWithJson(categorytype, lang);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [WebMethod]
        public string GetSubCategory(string categoryIDs, string language)
        {
            try
            {
                string result = String.Empty;
                using (CategoryWCFClient.CategoryServiceClient wcfClient = new CategoryWCFClient.CategoryServiceClient())
                {
                    result = wcfClient.GetCategoriesByParentIDsWithJson(categoryIDs, language);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private class JsonCategoryLang
        {
            public int AutoID;
            public int CategoryAutoID;
            public string LanguageCultureCode;
            public string Description;
            public JsonCategoryLang(int _autoID, int _category_AutoID, string _languageCultureCode, string _description)
            {
                this.AutoID = _autoID;
                this.CategoryAutoID = _category_AutoID;
                this.LanguageCultureCode = _languageCultureCode;
                this.Description = _description;
            }
        }

        private class JsonCategory
        {
            public int AutoID;
            public string Code;
            public string Description;
            public int? ParentAutoID;

            public JsonCategory(int _autoID, string _code, string _description, int? _parentAutoID = 0)
            {
                this.AutoID = _autoID;
                this.Code = _code;
                this.Description = _description;
                this.ParentAutoID = _parentAutoID;
            }
        }
    }
}
