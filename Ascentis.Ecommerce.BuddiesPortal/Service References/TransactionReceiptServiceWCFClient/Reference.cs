﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.TransactionReceiptServiceWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="TransactionReceiptServiceWCFClient.ITransactionReceiptService")]
    public interface ITransactionReceiptService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ITransactionReceiptService/CancelOrder", ReplyAction="http://tempuri.org/ITransactionReceiptService/CancelOrderResponse")]
        bool CancelOrder(int orderid, int member_id, string member_name, ref double cancelledAmount);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ITransactionReceiptService/GetShortOrderInformation", ReplyAction="http://tempuri.org/ITransactionReceiptService/GetShortOrderInformationResponse")]
        Ascentis.Ecommerce.DataEntity.WebUIEntity.OrderShortInfo GetShortOrderInformation(long orderid, long member_id);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/ITransactionReceiptService/GetOrderDetails", ReplyAction="http://tempuri.org/ITransactionReceiptService/GetOrderDetailsResponse")]
        Ascentis.Ecommerce.DataEntity.DataEntity.OrderDetails[] GetOrderDetails(long orderid, long member_id, string language);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface ITransactionReceiptServiceChannel : Ascentis.Ecommerce.BuddiesPortal.TransactionReceiptServiceWCFClient.ITransactionReceiptService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class TransactionReceiptServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.TransactionReceiptServiceWCFClient.ITransactionReceiptService>, Ascentis.Ecommerce.BuddiesPortal.TransactionReceiptServiceWCFClient.ITransactionReceiptService {
        
        public TransactionReceiptServiceClient() {
        }
        
        public TransactionReceiptServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public TransactionReceiptServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public TransactionReceiptServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public TransactionReceiptServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public bool CancelOrder(int orderid, int member_id, string member_name, ref double cancelledAmount) {
            return base.Channel.CancelOrder(orderid, member_id, member_name, ref cancelledAmount);
        }
        
        public Ascentis.Ecommerce.DataEntity.WebUIEntity.OrderShortInfo GetShortOrderInformation(long orderid, long member_id) {
            return base.Channel.GetShortOrderInformation(orderid, member_id);
        }
        
        public Ascentis.Ecommerce.DataEntity.DataEntity.OrderDetails[] GetOrderDetails(long orderid, long member_id, string language) {
            return base.Channel.GetOrderDetails(orderid, member_id, language);
        }
    }
}