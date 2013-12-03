function ShoppingCartItemParam() {
    
    var sci_MemberID = 0;
    var sci_ProductGroupID = 0;
    var sci_ProductGroupTitle = '';
    var sci_ProductGroupImage = '';
    var sci_RetailerID = 0;
    var sci_ChosenAttributeSet = [];

    var sci_FlightInfoParam = null;
    var sci_ProductParam = null;
    var sci_Quantity = 0;

    var sci_CurrentItemQuantity = 0;
    var sci_TotalAlcoholVolumeInCart = 0;
    var sci_AlcoholVolumeForCurrentItem = 0;
    var sci_MemberAge = 0;
    var sci_BrandDetailUrl = '';
    var sci_TotalLAGItemsInCart = 0;
    var sci_MemberDOB = '';  

    this.MemberAutoID = sci_MemberID;
    this.ProductGroupAutoID = sci_ProductGroupID;
    this.ProductGroupTitle = sci_ProductGroupTitle;
    this.RetailerAutoID = sci_RetailerID;
    this.ChosenAttributeSet = sci_ChosenAttributeSet; //Array of AttributeOptionParam
    this.FlightInfoParam = sci_FlightInfoParam; //FlightInfoParam Obj
    this.Quantity = sci_Quantity;

    this.CurrentItemQuantity = sci_CurrentItemQuantity;
    this.TotalAlcoholVolumeInCart = sci_TotalAlcoholVolumeInCart;
    this.AlcoholVolumeForCurrentItem = sci_AlcoholVolumeForCurrentItem;
    this.MemberAge = sci_MemberAge;
    this.MemberDOB = sci_MemberDOB;
    this.BrandDetailUrl = sci_BrandDetailUrl;
    this.ProductGroupImage = sci_ProductGroupImage;
    this.TotalLAGItemsInCart = sci_TotalLAGItemsInCart;

    this.ProductParam = sci_ProductParam; //ProductParam Obj

}

function AttributeOptionParam() {
    var ao_AttributeID = 0;
    var ao_OptionID = 0;

    this.AttributeAutoID = ao_AttributeID;
    this.AttributeOptionAutoID = ao_OptionID;
}

function FlightInfoParam() {

    var fi_FlightAutoID = 0;
    var fi_FlightNumber = '';

    var fi_DepartureTerminalNumber = ''; //T1, T2, T3
    var fi_DepartureDatetime = null;

    var fi_DestinationAirportCode = '';
    var fi_DestinationCountryCode = '';

    this.FlightAutoID = fi_FlightAutoID;
    this.FlightNumber = fi_FlightNumber;
    this.DestinationAirportCode = fi_DestinationAirportCode;
    this.DestinationCountryCode = fi_DestinationCountryCode;
    this.DepartureDatetime = fi_DepartureDatetime;
}

function ProductParam() {
    var p_ProductID = 0;
    var p_IsLAG = null;
    var p_IsAlcohol = null;
    var p_LimitedQty = null;
    var p_AgeLimit = null;
    var p_LAGVolume = null;
    var p_BrandID = 0;

    this.ProductAutoID = p_ProductID;
    this.IsLAG = p_IsLAG;
    this.IsAlcohol = p_IsAlcohol;
    this.LimitedQty = p_LimitedQty;
    this.AgeLimit = p_AgeLimit;
    this.LAGVolume = p_LAGVolume;
    this.BrandAutoID = p_BrandID;
}


function WishlistParam() {
    var sci_MemberID = 0;
    var sci_ProductGroupID = 0;
    var sci_WishlistIndex = 0;
    var sci_RetailerID = 0;
    var sci_ProductGroupTitle = '';
    var sci_ProductGroupImage = '';
    var sci_BrandDetailUrl = '';  
    var sci_BrandAutoID = 0;

    this.MemberAutoID = sci_MemberID;
    this.ProductGroupAutoID = sci_ProductGroupID;
    this.WishlistIndex = sci_WishlistIndex;
    this.RetailerAutoID = sci_RetailerID;
    this.ProductGroupTitle = sci_ProductGroupTitle;
    this.ProductGroupImage = sci_ProductGroupImage;
    this.BrandDetailUrl = sci_BrandDetailUrl;
    this.BrandAutoID = sci_BrandAutoID;
}