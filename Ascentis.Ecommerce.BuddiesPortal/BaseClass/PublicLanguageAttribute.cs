using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ascentis.Ecommerce.BuddiesPortal.BaseClass
{
    /// author:jack 20130109
    /// <summary>
    /// public language string
    /// </summary>
    public class PublicLanguageAttribute
    {

        //public
        public string Home = "Home";
        public string AddToCart = "Add To Cart";
        public string AddToWishlist = "Add To Wishlist";
        public string Retailers = "Retailers";
        public string Quantity = "Quantity";
        public string Brand = "brands";
        public string ViewAll = "View All";
        public string BestSellers = "Best Sellers";
        public string Best = "Best";
        public string Seller = "Seller";
        public string Promotions = "Promotions";
        public string Overview = "Overview";
        public string ProductDetails = "Product Description";
        public string CollectionReturnPolicy = "Collection & Return Policy";

        // default.aspx 
        public string SoldOut = "Sold Out";
        public string Editor = "Editor's";
        public string Pick = "Pick";
        public string View = "View";
        public string Share = "Share";

        //product.aspx
        public string PromoPrice = "Promo Price";
        public string AirportPrice = "Airport Price"; //glaissa updated to AirportPrice, apr 3 2013
        public string DowntownPrice = "Downtown Price";
        public string Savings = "Savings";
        public string RewardsPoints = "Rewards Points";

        /// author:jack 20130109
        /// <summary>
        /// set cn languge
        /// </summary>
        public void SetLanguageAttributeValue()
        {
                //public
                Home = "首页";
                AddToCart = "添加到购物车";
                AddToWishlist = "添加到收藏夹";
                Retailers = "卖家";
                Quantity = "数量";
                Brand = "品牌";
                ViewAll = "查看所有";
                BestSellers = "最畅销产品";
                Best = "最畅销";
                Seller = "产品";
                Promotions = "促销";
                Overview = "概述";
                ProductDetails = "产品详细信息";
                CollectionReturnPolicy = "收集及退货";

                // default.aspx 
                SoldOut = "售馨";
                Editor = "编辑";
                Pick = "推荐";
                View = "显示";
                Share = "分享";

                //product.aspx
                PromoPrice = "促销价";
                AirportPrice = "机场价格"; //glaissa updated to AirportPrice, apr 3 2013
                DowntownPrice = "市场价";
                Savings = "节省";
                RewardsPoints = "奖励积分";
        }
    }
}