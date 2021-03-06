﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.WishlistWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="WishlistWCFClient.IWishlistService")]
    public interface IWishlistService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IWishlistService/AddToWishlist", ReplyAction="http://tempuri.org/IWishlistService/AddToWishlistResponse")]
        int AddToWishlist(long memberID, long productGroupID, int index);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IWishlistService/WishlistIsExist", ReplyAction="http://tempuri.org/IWishlistService/WishlistIsExistResponse")]
        bool WishlistIsExist(long memberID, long productGroupID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IWishlistService/DeleteWishlistByMemberIDAndIndex", ReplyAction="http://tempuri.org/IWishlistService/DeleteWishlistByMemberIDAndIndexResponse")]
        bool DeleteWishlistByMemberIDAndIndex(long memberID, int index);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IWishlistService/DeleteWishlistByGroupID", ReplyAction="http://tempuri.org/IWishlistService/DeleteWishlistByGroupIDResponse")]
        bool DeleteWishlistByGroupID(long memberID, long groupID);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IWishlistService/GetWishesUrlByMemberID", ReplyAction="http://tempuri.org/IWishlistService/GetWishesUrlByMemberIDResponse")]
        string[] GetWishesUrlByMemberID(long memberID, int recordCount);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IWishlistServiceChannel : Ascentis.Ecommerce.BuddiesPortal.WishlistWCFClient.IWishlistService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class WishlistServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.WishlistWCFClient.IWishlistService>, Ascentis.Ecommerce.BuddiesPortal.WishlistWCFClient.IWishlistService {
        
        public WishlistServiceClient() {
        }
        
        public WishlistServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public WishlistServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WishlistServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public WishlistServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public int AddToWishlist(long memberID, long productGroupID, int index) {
            return base.Channel.AddToWishlist(memberID, productGroupID, index);
        }
        
        public bool WishlistIsExist(long memberID, long productGroupID) {
            return base.Channel.WishlistIsExist(memberID, productGroupID);
        }
        
        public bool DeleteWishlistByMemberIDAndIndex(long memberID, int index) {
            return base.Channel.DeleteWishlistByMemberIDAndIndex(memberID, index);
        }
        
        public bool DeleteWishlistByGroupID(long memberID, long groupID) {
            return base.Channel.DeleteWishlistByGroupID(memberID, groupID);
        }
        
        public string[] GetWishesUrlByMemberID(long memberID, int recordCount) {
            return base.Channel.GetWishesUrlByMemberID(memberID, recordCount);
        }
    }
}
