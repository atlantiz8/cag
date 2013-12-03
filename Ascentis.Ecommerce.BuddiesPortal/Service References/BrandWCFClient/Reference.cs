﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.BrandWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="BrandWCFClient.IBrandService")]
    public interface IBrandService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBrandService/GetBrand", ReplyAction="http://tempuri.org/IBrandService/GetBrandResponse")]
        Ascentis.Ecommerce.DataEntity.DataEntity.Brand[] GetBrand(int count);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBrandService/GetBrandLang", ReplyAction="http://tempuri.org/IBrandService/GetBrandLangResponse")]
        Ascentis.Ecommerce.DataEntity.WebUIEntity.BrandLangEntity[] GetBrandLang(string langType, int count);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBrandService/GetBrandLangWithJson", ReplyAction="http://tempuri.org/IBrandService/GetBrandLangWithJsonResponse")]
        string GetBrandLangWithJson(string langType, int count);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBrandService/GetBrandByCategory", ReplyAction="http://tempuri.org/IBrandService/GetBrandByCategoryResponse")]
        Ascentis.Ecommerce.DataEntity.WebUIEntity.BrandLangEntity[] GetBrandByCategory(int categoryID, string langType, int count);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBrandService/GetBrandByCategoryWithJson", ReplyAction="http://tempuri.org/IBrandService/GetBrandByCategoryWithJsonResponse")]
        string GetBrandByCategoryWithJson(int categoryID, string langType, int count);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IBrandServiceChannel : Ascentis.Ecommerce.BuddiesPortal.BrandWCFClient.IBrandService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class BrandServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.BrandWCFClient.IBrandService>, Ascentis.Ecommerce.BuddiesPortal.BrandWCFClient.IBrandService {
        
        public BrandServiceClient() {
        }
        
        public BrandServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public BrandServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public BrandServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public BrandServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Ascentis.Ecommerce.DataEntity.DataEntity.Brand[] GetBrand(int count) {
            return base.Channel.GetBrand(count);
        }
        
        public Ascentis.Ecommerce.DataEntity.WebUIEntity.BrandLangEntity[] GetBrandLang(string langType, int count) {
            return base.Channel.GetBrandLang(langType, count);
        }
        
        public string GetBrandLangWithJson(string langType, int count) {
            return base.Channel.GetBrandLangWithJson(langType, count);
        }
        
        public Ascentis.Ecommerce.DataEntity.WebUIEntity.BrandLangEntity[] GetBrandByCategory(int categoryID, string langType, int count) {
            return base.Channel.GetBrandByCategory(categoryID, langType, count);
        }
        
        public string GetBrandByCategoryWithJson(int categoryID, string langType, int count) {
            return base.Channel.GetBrandByCategoryWithJson(categoryID, langType, count);
        }
    }
}
