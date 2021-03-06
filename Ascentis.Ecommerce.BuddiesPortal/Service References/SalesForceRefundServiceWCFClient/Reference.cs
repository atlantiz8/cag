﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.SalesForceRefundServiceWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="SalesForceRefundServiceWCFClient.IRefundService")]
    public interface IRefundService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IRefundService/OpenRefundCase", ReplyAction="http://tempuri.org/IRefundService/OpenRefundCaseResponse")]
        void OpenRefundCase(long[] id);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IRefundService/OpenRefundCaseByOrderID", ReplyAction="http://tempuri.org/IRefundService/OpenRefundCaseByOrderIDResponse")]
        void OpenRefundCaseByOrderID(long orderid);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IRefundService/GetRefundDetail", ReplyAction="http://tempuri.org/IRefundService/GetRefundDetailResponse")]
        Ascentis.Ecommerce.DataEntity.WebUIEntity.RefundStatus GetRefundDetail(string case_number);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IRefundService/CloseRefundCase", ReplyAction="http://tempuri.org/IRefundService/CloseRefundCaseResponse")]
        string CloseRefundCase(string case_number);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IRefundService/UpdateRefundCaseByScheldueJob", ReplyAction="http://tempuri.org/IRefundService/UpdateRefundCaseByScheldueJobResponse")]
        void UpdateRefundCaseByScheldueJob(long orderId);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IRefundServiceChannel : Ascentis.Ecommerce.BuddiesPortal.SalesForceRefundServiceWCFClient.IRefundService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class RefundServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.SalesForceRefundServiceWCFClient.IRefundService>, Ascentis.Ecommerce.BuddiesPortal.SalesForceRefundServiceWCFClient.IRefundService {
        
        public RefundServiceClient() {
        }
        
        public RefundServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public RefundServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public RefundServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public RefundServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public void OpenRefundCase(long[] id) {
            base.Channel.OpenRefundCase(id);
        }
        
        public void OpenRefundCaseByOrderID(long orderid) {
            base.Channel.OpenRefundCaseByOrderID(orderid);
        }
        
        public Ascentis.Ecommerce.DataEntity.WebUIEntity.RefundStatus GetRefundDetail(string case_number) {
            return base.Channel.GetRefundDetail(case_number);
        }
        
        public string CloseRefundCase(string case_number) {
            return base.Channel.CloseRefundCase(case_number);
        }
        
        public void UpdateRefundCaseByScheldueJob(long orderId) {
            base.Channel.UpdateRefundCaseByScheldueJob(orderId);
        }
    }
}
