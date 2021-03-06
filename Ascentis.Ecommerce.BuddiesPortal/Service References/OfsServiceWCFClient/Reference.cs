﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.OfsServiceWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="OfsServiceWCFClient.IOfsService")]
    public interface IOfsService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/CreateNewOrder", ReplyAction="http://tempuri.org/IOfsService/CreateNewOrderResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CreateNewOrder(string salesOrderNo, long memberAutoId);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/Refunded", ReplyAction="http://tempuri.org/IOfsService/RefundedResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult Refunded(string salesOrderNo, long cancelDetailAutoId);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/CheckOrderStatus", ReplyAction="http://tempuri.org/IOfsService/CheckOrderStatusResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CheckOrderStatus(string salesOrderNo, long memberAutoId);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/UpdateCustInfo", ReplyAction="http://tempuri.org/IOfsService/UpdateCustInfoResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult UpdateCustInfo(string salesOrderNo, long memberAutoId);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/CancelOrder", ReplyAction="http://tempuri.org/IOfsService/CancelOrderResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CancelOrder(string salesOrderNo);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/SkuPluMaster", ReplyAction="http://tempuri.org/IOfsService/SkuPluMasterResponse")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult SkuPluMaster(string path);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/NotifyCancelOrder", ReplyAction="http://tempuri.org/IOfsService/NotifyCancelOrderResponse")]
        [System.ServiceModel.FaultContractAttribute(typeof(Ascentis.Ecommerce.Services.ServiceFaultContract), Action="http://tempuri.org/IOfsService/NotifyCancelOrderServiceFaultContractFault", Name="ServiceFaultContract", Namespace="http://schemas.datacontract.org/2004/07/Ascentis.Ecommerce.Services")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.EcommResult NotifyCancelOrder(string transactId, string salesOrderNumber, bool isFullCancellation, Ascentis.Ecommerce.Services.EcommService.OfsService.OrderLineInfo[] lineInfo, string addedBy);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/NotifyFulfillOrder", ReplyAction="http://tempuri.org/IOfsService/NotifyFulfillOrderResponse")]
        [System.ServiceModel.FaultContractAttribute(typeof(Ascentis.Ecommerce.Services.ServiceFaultContract), Action="http://tempuri.org/IOfsService/NotifyFulfillOrderServiceFaultContractFault", Name="ServiceFaultContract", Namespace="http://schemas.datacontract.org/2004/07/Ascentis.Ecommerce.Services")]
        Ascentis.Ecommerce.Services.EcommService.OfsService.EcommResult NotifyFulfillOrder(string transactId, string salesOrderNumber, Ascentis.Ecommerce.Services.EcommService.OfsService.OrderLineInfo[] orderLines);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IOfsService/GetNewOrderDetailByOrderID", ReplyAction="http://tempuri.org/IOfsService/GetNewOrderDetailByOrderIDResponse")]
        Ascentis.Ecommerce.DataEntity.DataEntity.NewOrderDetail GetNewOrderDetailByOrderID(long orderid, long memberid);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IOfsServiceChannel : Ascentis.Ecommerce.BuddiesPortal.OfsServiceWCFClient.IOfsService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class OfsServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.OfsServiceWCFClient.IOfsService>, Ascentis.Ecommerce.BuddiesPortal.OfsServiceWCFClient.IOfsService {
        
        public OfsServiceClient() {
        }
        
        public OfsServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public OfsServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public OfsServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public OfsServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CreateNewOrder(string salesOrderNo, long memberAutoId) {
            return base.Channel.CreateNewOrder(salesOrderNo, memberAutoId);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult Refunded(string salesOrderNo, long cancelDetailAutoId) {
            return base.Channel.Refunded(salesOrderNo, cancelDetailAutoId);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CheckOrderStatus(string salesOrderNo, long memberAutoId) {
            return base.Channel.CheckOrderStatus(salesOrderNo, memberAutoId);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult UpdateCustInfo(string salesOrderNo, long memberAutoId) {
            return base.Channel.UpdateCustInfo(salesOrderNo, memberAutoId);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult CancelOrder(string salesOrderNo) {
            return base.Channel.CancelOrder(salesOrderNo);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.OfsResult SkuPluMaster(string path) {
            return base.Channel.SkuPluMaster(path);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.EcommResult NotifyCancelOrder(string transactId, string salesOrderNumber, bool isFullCancellation, Ascentis.Ecommerce.Services.EcommService.OfsService.OrderLineInfo[] lineInfo, string addedBy) {
            return base.Channel.NotifyCancelOrder(transactId, salesOrderNumber, isFullCancellation, lineInfo, addedBy);
        }
        
        public Ascentis.Ecommerce.Services.EcommService.OfsService.EcommResult NotifyFulfillOrder(string transactId, string salesOrderNumber, Ascentis.Ecommerce.Services.EcommService.OfsService.OrderLineInfo[] orderLines) {
            return base.Channel.NotifyFulfillOrder(transactId, salesOrderNumber, orderLines);
        }
        
        public Ascentis.Ecommerce.DataEntity.DataEntity.NewOrderDetail GetNewOrderDetailByOrderID(long orderid, long memberid) {
            return base.Channel.GetNewOrderDetailByOrderID(orderid, memberid);
        }
    }
}
