using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;
using Ascentis.Ecommerce.DataEntity.DataEntity;
using Ascentis.Ecommerce.Services.EcommService.CategoryService;

namespace Ascentis.Ecommerce.BuddiesPortal.WSHub
{
    /// <summary>
    /// Summary description for nwCategory
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class nwCategory : WsValidator
    {

        [WebMethod]
        public string GetNWCategories(int brandID, string languageType)
        {
            string result = string.Empty;

            using (CategoryWCFClient.CategoryServiceClient csc = new CategoryWCFClient.CategoryServiceClient())
            {
                List<GetBrandNavigationSet_Result> list = csc.GetCategoryMenuSetByBrand(brandID, languageType).ToList<GetBrandNavigationSet_Result>();
                if (list != null && list.Count > 0)
                {
                    List<NWCategoryItem> root = new List<NWCategoryItem>();

                    GetBrandNavigationSet_Result item;
                    for (int i = 0; i < list.Count; i++)
                    {
                        item = list[i];

                        if (item.ParentCategoryAutoID == 0)
                        {
                            LoopBrandNavigationSet(item, list, root);
                        }
                        else
                        {
                            break;
                        }
                    }                   

                    JavaScriptSerializer jss = new JavaScriptSerializer();
                    result = jss.Serialize(root);
                }
            }
            
            return result;
        }

        private void LoopBrandNavigationSet(GetBrandNavigationSet_Result firstLevelItem, List<GetBrandNavigationSet_Result> set, List<NWCategoryItem> jsonSet)
        {
            if (firstLevelItem != null && set != null && set.Count > 0 && jsonSet != null)
            {
                int currentCategoryAutoID = firstLevelItem.CategoryAutoID;

                NWCategoryItem nwCategory = new NWCategoryItem();
                nwCategory.categoryID = currentCategoryAutoID;
                nwCategory.categoryDisplayName = firstLevelItem.CategoryName;
                if (!string.IsNullOrEmpty(firstLevelItem.Filter))
                {
                    nwCategory.filter = firstLevelItem.Filter;
                }
               
                nwCategory.mastHeadName = firstLevelItem.MastheadName;
                
                if (!string.IsNullOrEmpty(firstLevelItem.NavigationURL))
                {
                    nwCategory.URL = firstLevelItem.NavigationURL;
                }
                if (firstLevelItem.Clickable.HasValue)
                {
                    nwCategory.IsClickable = firstLevelItem.Clickable.Value;
                }

                nwCategory.childs = new List<NWCategoryItem>();


                List<GetBrandNavigationSet_Result> subSet = set.FindAll(t => t.ParentCategoryAutoID == currentCategoryAutoID);
                if (subSet != null && subSet.Count > 0)
                {
                    GetBrandNavigationSet_Result tmpItem;
                    for (int index = 0; index < subSet.Count; index++)
                    {
                        tmpItem = subSet[index];

                        LoopBrandNavigationSet(tmpItem, set, nwCategory.childs);
                    }                    
                }
                
                jsonSet.Add(nwCategory);                               
            }
        }

        private class NWCategoryItem
        {
           public int categoryID;
           public string categoryDisplayName;
           public string categoryCode;
           public string filter;
           public string mastHeadName;
           public string URL;
           public bool IsClickable = true;
           public List<NWCategoryItem> childs;
        }
    }
}
