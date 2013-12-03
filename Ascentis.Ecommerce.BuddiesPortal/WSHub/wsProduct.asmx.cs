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
using Ascentis.Ecommerce.DataEntity.DTO;
using System.Configuration;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// wsProduct 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    [System.Web.Script.Services.ScriptService]
    public class wsProduct : WsValidator
    {
        private int cacheDuration = int.Parse(ConfigurationManager.AppSettings["Cache_Duration"]);

        [WebMethod]
        public string GetProductGroupEntityInfo(string groupID, string langType, string concessionaireAutoID)
        {
            try
            {
                langType = "en-US";
                string cacheName = "wsPd_GetProductGroupEntityInfo_" + groupID + "_" + langType + "_" + concessionaireAutoID;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        int count = 10;
                        result = wcfClient.GetProductGroupWithJson(long.Parse(groupID), langType, int.Parse(concessionaireAutoID), count);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }

                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupInfo(string groupID, string concessionaireAutoID)
        {
            try
            {
                string cacheName = "wsPd_GetProductGroupInfo_" + groupID + "_" + concessionaireAutoID;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();
                        result = wcfClient.GetProductGroupWithJson(long.Parse(groupID), "en-US", int.Parse(concessionaireAutoID), 10);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupListByCategoryID(string categoryAutoID, string languageType)
        {
            try
            {
                string cacheName = "GetProductGroupListByCategoryID_" + categoryAutoID + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();
                        result = wcfClient.Brands_SearchProductGroupListByCategoryID(int.Parse(categoryAutoID), languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetSingleAttributeProductGroupListByCategoryID(string categoryAutoID, string languageType)
        {
            try
            {
                string cacheName = "GetSingleAttributeProductGroupListByCategoryID_" + categoryAutoID + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();
                        result = wcfClient.Brands_SearchProductGroupListWithAttributeSetAndPriceByCategoryID(int.Parse(categoryAutoID), languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetRecommendedProductGroupListByProductGroupAutoID(long productGroupAutoID, string languageType)
        {
            try
            {
                string cacheName = "GetRecommendedProductGroupListByProductGroupAutoID" + productGroupAutoID.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();
                        result = wcfClient.Brands_GetRecommendProductGroups(productGroupAutoID, languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupListFor3Step(int brandID, string languageType)
        {
            try
            {
                string cacheName = "GetProductGroupListFor3Step" + brandID.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();
                        result = wcfClient.Brands_GetProductGroupsFor3Steps(brandID, languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupInfo2(long groupID, string languageType)
        {
            try
            {
                string cacheName = "wsPd_GetProductGroupInfo2_" + groupID.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {

                        BaseClass.BasePage baseFun = new BaseClass.BasePage();
                        string langType = baseFun.GetCurrentLanguage();

                        Ascentis.Ecommerce.DataEntity.DTO.ProductGroupInfoForUI entity = wcfClient.GetProductGroupInfo(groupID, languageType);

                        JavaScriptSerializer jss = new JavaScriptSerializer();
                        result = jss.Serialize(entity);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
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
                throw ex;
            }
        }
        
        [WebMethod]
        public string GetProductGroupByFilter(string categories, string minPrice, string maxPrice, string filterBy, string filterPageSize, string currentPageindex, string langType, string sortBy)
        {
            try
            {
                string result = String.Empty;                
                double _minPrice = 0.0;
                double _maxPrice = 0.0;
                double.TryParse(minPrice, out _minPrice);
                double.TryParse(maxPrice, out _maxPrice);

                using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                {                    
                    //int[] category = Array.ConvertAll<string, int>(categories.Split('.'), c => int.Parse(c));
                    result = wcfClient.GetProductGroupListByFilterWithJson(categories, _minPrice, _maxPrice, filterBy, int.Parse(filterPageSize), int.Parse(currentPageindex), langType, sortBy);                    
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupPageByBrand(string brandID, string categoryID, string currentPageIndex, string bestPageSize, string pageSize, string langType, string sortBy)
        {
            try
            {
                string cacheName = "wsPd_GetProductGroupPageByBrand_" + brandID + "_" + categoryID + "_" + currentPageIndex + "_" + bestPageSize + "_" + pageSize + "_" + langType + "_" + sortBy;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetProductGroupListByBrandWithJson(int.Parse(brandID), int.Parse(categoryID), int.Parse(currentPageIndex), int.Parse(pageSize), langType, sortBy);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string SearchProductGroupDescription(string search, string langType, int count)
        {
            var searchString = search;
            var result = String.Empty;
            try
            {
                string cacheName = "wsPd_SearchProductGroupDescription_" + search;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetProductGroupDescriptionFromSearchWithJson(searchString, langType, count);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
               throw ex;
            }
        }

        [WebMethod]
        public string GetProductAttribute(string groupID, string concessionaireID, string langType)
        {
            try
            {
                using (AttributeWCFClient.AttributeServiceClient wcfClient = new AttributeWCFClient.AttributeServiceClient())
                {
                    return wcfClient.GetProductGroupAttributeValuesWithJson(int.Parse(groupID), int.Parse(concessionaireID), langType);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetNWBestLoverProductGroup(int brandID, int topN, string languageType)
        {
            try
            {
                string cacheName = "GetNWBestLoverProductGroup" + brandID.ToString() + "_" + topN.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.Brands_GetTop10ProductGroup(brandID, languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetGreatGiftProductGroup(int brandID, int topN, string languageType)
        {
            try
            {
                string cacheName = "GetGreatGiftProductGroup" + brandID.ToString() + "_" + topN.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.Brands_GetGreatGiftProductGroup(brandID, languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetBrandBanners(int brandID, int bannerType, string languageType)
        {
            try
            {
                string cacheName = "GetBrandBanners_" + brandID.ToString() + "_" + bannerType.ToString() + "_" + languageType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.Brands_GetBrandBanners(brandID, bannerType, languageType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetLoadMoreProductGroup(string pageSizeProduct, string pageSizeBanner, string currentPageIndex, string langType, string gids)
        {
            try
            {
                long[] _gids = new long[] { };
                if (!string.IsNullOrEmpty(gids))
                {
                    string[] _gidsStr = gids.Split('|');
                    _gids = Array.ConvertAll<string, long>(_gidsStr, s => long.Parse(s));
                }

                using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                {
                    return wcfClient.GetProductGroupPageWithJson(int.Parse(pageSizeProduct), int.Parse(pageSizeBanner), int.Parse(currentPageIndex), langType, _gids);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string UpdateProductAttributeInfo(string group, string langType, string retailer, List<OptionJson> options)
        {
            try
            {
                using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                {
                    int groupid = int.Parse(group);

                    string[] values = null;
                    if (0 != options.Count)
                    {
                        string attribute = ConvertAttributeListToString(options);
                        attribute = attribute.Remove(attribute.Length - 1, 1);
                        values = attribute.Split(',');
                    }
                    return wcfClient.UpdateProductAttributeWithJson(groupid, langType, retailer, values);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [Serializable]
        public class OptionJson
        {
            public long id { get; set; }
            public string value { get; set; }
        }

        public static string ConvertAttributeListToString(List<OptionJson> options)
        {
            StringBuilder sb = new StringBuilder();
            foreach (OptionJson item in options)
            {
                sb.Append(item.value + ",");
            }

            return sb.ToString();
        }


        [WebMethod]
        public string GetProductGroupByCategory(string categoryID, string level, string pageSize, string bestPageSize, string currentPageindex, string langType, string isBest, string sortBy)
        {
            try
            {
                string cacheName = "wsPd_GetProductGroupByCategory_" + categoryID + "_" + level + "_" + pageSize + "_" + bestPageSize + "_" + currentPageindex + "_" + langType + "_" + isBest + "_" + sortBy;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetProductGroupListByCategoryWithJson(int.Parse(categoryID), int.Parse(pageSize), int.Parse(currentPageindex), langType, sortBy);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetPromotionProductGroup(string currentPageIndex, string pageSize, string sortBy, string langType)
        {
            try
            {
                string cacheName = "wsPd_GetPromotionProductGroup_" + currentPageIndex + "_" + pageSize + "_" + sortBy + "_" + langType;
                string result = String.Empty;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetPromotionProductGroupListWithJson(int.Parse(currentPageIndex), int.Parse(pageSize), sortBy, langType);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string GetWishlistGroupByMember(string memberID, string langType, string count)
        {
            try
            {
                string result = String.Empty;

                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long sMemberAutoID = baseClass.CurrentMemberAutoID;
                long cMemberAutoID = long.Parse(memberID);
                if (sMemberAutoID == cMemberAutoID)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetWishlistGroupByMemberIDWithJson(long.Parse(memberID), langType, int.Parse(count));
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string GetProductGroupByMemberIDWithJson(string memberID, string langType, string psize, string pindex, bool reload)
        {
            try
            {
                string result = String.Empty;
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long sMemberAutoID = baseClass.CurrentMemberAutoID;
                long cMemberAutoID = long.Parse(memberID);

                if (sMemberAutoID == cMemberAutoID)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetWishlistProductGroupSet(long.Parse(memberID), langType, int.Parse(psize), int.Parse(pindex), reload);
                    }
                }

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod(BufferResponse = false, EnableSession = true)]
        public string GetWishlistProductGroupSet(string memberID, string langType, string psize, string pindex, bool reload)
        {
            try
            {
                string result = String.Empty;
                BaseClass.BasePage baseClass = new BaseClass.BasePage();
                long sMemberAutoID = baseClass.CurrentMemberAutoID;
                long cMemberAutoID = long.Parse(memberID);

                if (sMemberAutoID == cMemberAutoID)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetWishlistProductGroupSet(sMemberAutoID, langType, int.Parse(psize), int.Parse(pindex), reload);
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        [WebMethod]
        public string GetRecommendProductGroupListWithJson(string langType, string departmentID,string groupID, string count)
        {
            try
            {
                string result = String.Empty;
                using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                {
                    result = wcfClient.GetRecommendProductGroupListWithJson(langType, int.Parse(departmentID), long.Parse(groupID), int.Parse(count));
                }
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [WebMethod]
        public string GetProductGroupBySearchString(string searchString, string langType, int currentPageIndex, int pageSize, string sortBy)
        {
            string result = String.Empty;
            try
            {
                string cacheName = "wsPd_GetProductGroupBySearchString_" + searchString + "_" + langType + "_" + currentPageIndex + "_" + pageSize + "_" + sortBy;
                if (HttpContext.Current.Cache[cacheName] == null)
                {
                    using (ProductGroupWCFClient.ProductGroupServiceClient wcfClient = new ProductGroupWCFClient.ProductGroupServiceClient())
                    {
                        result = wcfClient.GetProductGroupListFromSearchWithJson(searchString, langType, currentPageIndex,pageSize, 0, sortBy);
                        HttpContext.Current.Cache.Insert(cacheName, result, null, System.Web.Caching.Cache.NoAbsoluteExpiration, new TimeSpan(0, 0, cacheDuration));
                    }
                }
                else
                {
                    result = HttpContext.Current.Cache[cacheName].ToString();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
        }
    }
}
