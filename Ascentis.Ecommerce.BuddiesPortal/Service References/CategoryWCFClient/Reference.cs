﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.CategoryWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="CategoryWCFClient.ICategoryService")]
    public interface ICategoryService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoryListAll", ReplyAction="http://tempuri.org/ICategoryService/GetCategoryListAllResponse")]
        Ascentis.Ecommerce.DataEntity.WebUIEntity.CategoryLangEntity[] GetCategoryListAll(string langType, int isAll);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoryListAllWithJson", ReplyAction="http://tempuri.org/ICategoryService/GetCategoryListAllWithJsonResponse")]
        string GetCategoryListAllWithJson(string langType, int isAll);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoryLangByCategoryTypeWithJson", ReplyAction="http://tempuri.org/ICategoryService/GetCategoryLangByCategoryTypeWithJsonResponse" +
            "")]
        string GetCategoryLangByCategoryTypeWithJson(string categorytype, string lang);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoryMenuSetByBrand", ReplyAction="http://tempuri.org/ICategoryService/GetCategoryMenuSetByBrandResponse")]
        Ascentis.Ecommerce.DataEntity.DataEntity.GetBrandNavigationSet_Result[] GetCategoryMenuSetByBrand(int brandAutoID, string langType);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoriesByParentIDsWithJson", ReplyAction="http://tempuri.org/ICategoryService/GetCategoriesByParentIDsWithJsonResponse")]
        string GetCategoriesByParentIDsWithJson(string categoryIDs, string lang);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ICategoryService/GetCategoryByID", ReplyAction="http://tempuri.org/ICategoryService/GetCategoryByIDResponse")]
        string GetCategoryByID(int CAutoID);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface ICategoryServiceChannel : Ascentis.Ecommerce.BuddiesPortal.CategoryWCFClient.ICategoryService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class CategoryServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.CategoryWCFClient.ICategoryService>, Ascentis.Ecommerce.BuddiesPortal.CategoryWCFClient.ICategoryService {
        
        public CategoryServiceClient() {
        }
        
        public CategoryServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public CategoryServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public CategoryServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public CategoryServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Ascentis.Ecommerce.DataEntity.WebUIEntity.CategoryLangEntity[] GetCategoryListAll(string langType, int isAll) {
            return base.Channel.GetCategoryListAll(langType, isAll);
        }
        
        public string GetCategoryListAllWithJson(string langType, int isAll) {
            return base.Channel.GetCategoryListAllWithJson(langType, isAll);
        }
        
        public string GetCategoryLangByCategoryTypeWithJson(string categorytype, string lang) {
            return base.Channel.GetCategoryLangByCategoryTypeWithJson(categorytype, lang);
        }
        
        public Ascentis.Ecommerce.DataEntity.DataEntity.GetBrandNavigationSet_Result[] GetCategoryMenuSetByBrand(int brandAutoID, string langType) {
            return base.Channel.GetCategoryMenuSetByBrand(brandAutoID, langType);
        }
        
        public string GetCategoriesByParentIDsWithJson(string categoryIDs, string lang) {
            return base.Channel.GetCategoriesByParentIDsWithJson(categoryIDs, lang);
        }
        
        public string GetCategoryByID(int CAutoID) {
            return base.Channel.GetCategoryByID(CAutoID);
        }
    }
}
