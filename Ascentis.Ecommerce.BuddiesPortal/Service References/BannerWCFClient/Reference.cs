﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.1008
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Ascentis.Ecommerce.BuddiesPortal.BannerWCFClient {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(ConfigurationName="BannerWCFClient.IBannerService")]
    public interface IBannerService {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://tempuri.org/IBannerService/GetSplashBannerInfo", ReplyAction="http://tempuri.org/IBannerService/GetSplashBannerInfoResponse")]
        Ascentis.Ecommerce.DataEntity.DTO.VBannerInfoDTO[] GetSplashBannerInfo(string LanguageCode);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IBannerServiceChannel : Ascentis.Ecommerce.BuddiesPortal.BannerWCFClient.IBannerService, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class BannerServiceClient : System.ServiceModel.ClientBase<Ascentis.Ecommerce.BuddiesPortal.BannerWCFClient.IBannerService>, Ascentis.Ecommerce.BuddiesPortal.BannerWCFClient.IBannerService {
        
        public BannerServiceClient() {
        }
        
        public BannerServiceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public BannerServiceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public BannerServiceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public BannerServiceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public Ascentis.Ecommerce.DataEntity.DTO.VBannerInfoDTO[] GetSplashBannerInfo(string LanguageCode) {
            return base.Channel.GetSplashBannerInfo(LanguageCode);
        }
    }
}