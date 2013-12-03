var language;
if(new RegExp(/zh-cn/gi).test($.trim($.cookie("Language")))){
    language = {
        "PromoPrice": "促销价",
        "AirportPrice": "机场价格",
        "DowntownPrice": "市场价",
        "Savings": "节省",
        "RewardsPoints": "奖励积分",
        "Retailers": "卖家",
        "Quantity": "数量",
        "Overview": "概述",
        "ProductDetails": "产品详细信息",
        "CollectionReturnPolicy": "收集及退货",
        "AddToCart": "添加到购物车",
        "AddToWishlist": "添加到收藏夹",
        "RemoveFromWishlist":"",
        "Brand": "品牌",
        "SoldOut": "售馨",
        "View": "显示",
        "Share":"分享",
        "Editor": "编辑",
        "Pick": "推荐",
        "Best": "最畅销",
        "Seller": "产品",
        "ItemsPerPage": "每页显示数量:",
        "InStock":"库存",
        "ViewAll": "查看全部",
        "NotAvailable": "不可用"
    };
} else {
    language = {
        "PromoPrice": "Promo Price",
        "AirportPrice": "Airport Price",
        "DowntownPrice": "List Price",
        "Savings": "Savings",
        "RewardsPoints": "Rewards Points",
        "Retailers": "Retailers",
        "Quantity": "Quantity",
        "Overview": "Overview",
        "ProductDetails": "Product Description",
        "CollectionReturnPolicy": "Collection & Return Policy",
        "AddToCart": "Add To Cart",
        "AddToWishlist": "Add To Wishlist",
        "RemoveFromWishlist": "Remove From Wishlist",
        "Brand": "Brand",
        "SoldOut": "Sold Out",
        "View": "View",
        "Share": "Share",
        "Editor": "EDITOR'S",
        "Pick": "PICK",
        "Best":"BEST",
        "Seller": "SELLER",
        "ItemsPerPage": "Items per page:",
        "InStock": "In stock",
        "ViewAll": "View All",
        "NotAvailable": "Not Available"
    };
}

var pricesTranslate = [
   language.PromoPrice,
   language.AirportPrice,
   language.DowntownPrice,
   language.Savings,
   language.RewardsPoints
];

//added by wlh on Aug 21 2013
/* for thousand seperator format i.e. 1,000.00*/
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}