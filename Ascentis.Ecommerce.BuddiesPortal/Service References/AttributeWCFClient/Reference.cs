﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.AttributeWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="AttributeWCFClient.IAttributeService")]
    public interface IAttributeService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAttributeService/GetProductGroupAttributeValuesWithJson", ReplyAction="http://tempuri.org/IAttributeService/GetProductGroupAttributeValuesWithJsonRespon" +
            "se")]
        string GetProductGroupAttributeValuesWithJson(long groupID, int concessionaireID, string langType);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAttributeService/GetProductConcessionaireAttributeOptionsWith" +
            "Json", ReplyAction="http://tempuri.org/IAttributeService/GetProductConcessionaireAttributeOptionsWith" +
            "JsonResponse")]
        string GetProductConcessionaireAttributeOptionsWithJson(long groupID, int concessionaireID, long[] attributes, string langType, int count);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAttributeService/GetProductAttributeValues", ReplyAction="http://tempuri.org/IAttributeService/GetProductAttributeValuesResponse")]
        Ascentis.Ecommerce.DataEntity.AdminEntity.Attribute_Values[] GetProductAttributeValues(long productID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAttributeService/GetAttributeAndValueListByGroupID", ReplyAction="http://tempuri.org/IAttributeService/GetAttributeAndValueListByGroupIDResponse")]
        Ascentis.Ecommerce.DataEntity.AdminEntity.AttributeAndValueEntity[] GetAttributeAndValueListByGroupID(long groupID, string langType);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IAttributeService/GetValueListByGroupIDAndConcessionaireID", ReplyAction="http://tempuri.org/IAttributeService/GetValueListByGroupIDAndConcessionaireIDResp" +
            "onse")]
        Ascentis.Ecommerce.DataEntity.AdminEntity.Attribute_Values[] GetValueListByGroupIDAndConcessionaireID(long groupID, int concessionaireAutoID, string langType);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IAttributeServiceChannel : Ascentis.Ecommerce.BuddiesPortal.AttributeWCFClient.IAttributeService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class AttributeServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.AttributeWCFClient.IAttributeService>, Ascentis.Ecommerce.BuddiesPortal.AttributeWCFClient.IAttributeService {
        
        public AttributeServiceClient() {
        }
        
        public AttributeServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public AttributeServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AttributeServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public AttributeServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string GetProductGroupAttributeValuesWithJson(long groupID, int concessionaireID, string langType) {
            return base.Channel.GetProductGroupAttributeValuesWithJson(groupID, concessionaireID, langType);
        }
        
        public string GetProductConcessionaireAttributeOptionsWithJson(long groupID, int concessionaireID, long[] attributes, string langType, int count) {
            return base.Channel.GetProductConcessionaireAttributeOptionsWithJson(groupID, concessionaireID, attributes, langType, count);
        }
        
        public Ascentis.Ecommerce.DataEntity.AdminEntity.Attribute_Values[] GetProductAttributeValues(long productID) {
            return base.Channel.GetProductAttributeValues(productID);
        }
        
        public Ascentis.Ecommerce.DataEntity.AdminEntity.AttributeAndValueEntity[] GetAttributeAndValueListByGroupID(long groupID, string langType) {
            return base.Channel.GetAttributeAndValueListByGroupID(groupID, langType);
        }
        
        public Ascentis.Ecommerce.DataEntity.AdminEntity.Attribute_Values[] GetValueListByGroupIDAndConcessionaireID(long groupID, int concessionaireAutoID, string langType) {
            return base.Channel.GetValueListByGroupIDAndConcessionaireID(groupID, concessionaireAutoID, langType);
        }
    }
}
