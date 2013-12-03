function API () {
	
	// Actual Online API URLs ( leave blank to use mock ones if not available yet)
    var API_ADD_CART = "";
	var API_UPDATE_OPTIONS = "";
	var API_LOADMORE = "";
	var API_SEARCH = "";
	var API_SUBSCRIBE = "../CommonFunction/SubscribeEmailHandler.ashx";
	var API_FLIGHT_DETAIL_CONFIRM = "";
	var API_DESTINATION_MATCH = "";
	//var API_SUBSCRIBE = "";
	var API_PROMO_SLIDESHOW = "";
	var API_LOADMORE = "";
	var API_REWARDS_LOGIN = "";
	var API_LOGIN = "";
	var API_UPDATE_CART = "";
	var API_UPDATE_WISHLIST = "";
	var API_GET_CART_OPTIONS;//Merged with Kilo 20130227 version by ChenChi on Mar 01 2013
	
	this.ADD = ""; // ignore this (depciated)
	
	var TESTING = false;  // Set to false (ie. turn off mock-offline mode) to be able to run any available online APIs above.

	//assign api URIs 
	//mock static respond hardcoded into txt file
	this.ADD_CART_NO_OPTIONS_PASS = TESTING || API_ADD_CART==="" ? "apis/addcartdirect.txt" : API_ADD_CART;   	
	this.ADD_CART_NO_OPTIONS_NOFLIGHT = TESTING || API_ADD_CART==="" ? "apis/addcartdirect_noflight.txt" : API_ADD_CART
	this.ADD_CART_OPTIONS = TESTING || API_ADD_CART==="" ? "apis/addcartdirect_options.txt" : API_ADD_CART;
	this.GET_CART_OPTIONS = TESTING || API_GET_CART_OPTIONS=== "" ? "apis/getcartoptions.txt" : API_GET_CART_OPTIONS;//Merged with Kilo 20130227 version by ChenChi on Mar 01 2013
	
	this.UPDATE_OPTIONS_DETAILS_PG = TESTING || API_UPDATE_OPTIONS==="" ? "apis/update_options2.txt" : API_UPDATE_OPTIONS;
	
	this.UPDATE_OPTIONS = TESTING || API_UPDATE_OPTIONS==="" ? "apis/update_options.txt": API_UPDATE_OPTIONS;
	this.UPDATE_CART = TESTING || API_UPDATE_CART==="" ? "apis/update_cart.txt": API_UPDATE_CART;
	this.UPDATE_WISHLIST = TESTING || API_UPDATE_WISHLIST==="" ? "apis/update_wishlist.txt": API_UPDATE_WISHLIST;
	
	this.LOGIN_ERROR = TESTING || API_LOGIN==="" ? "apis/login_error.txt" : API_LOGIN;
	
	this.REWARDS_LOGIN = TESTING || API_REWARDS_LOGIN==="" ? "apis/rewards_login_ok.txt" : API_REWARDS_LOGIN;
	//rewards_login_ok.txt  - json file for successful login
	//rewards_login_fail.txt - json file for error login
	
	this.LOADMORE = TESTING || API_LOADMORE==="" ? "apis/loadmore.txt" : API_LOADMORE;
	//items.txt - for preformated html data
	
	this.PROMO_SLIDESHOW = TESTING || API_PROMO_SLIDESHOW==="" ? "apis/slideshow.txt" : API_PROMO_SLIDESHOW;
	
	this.SEARCH = TESTING || API_SEARCH==="" ? "apis/search.txt" : API_SEARCH;
	this.SUBSCRIBE = TESTING || API_SUBSCRIBE==="" ? "apis/subscribe.txt" : API_SUBSCRIBE;
	this.DESTINATION_MATCH = TESTING || API_DESTINATION_MATCH==="" ? "apis/destmatch.txt" : API_DESTINATION_MATCH;
	this.FLIGHT_DETAIL_CONFIRM = TESTING || API_FLIGHT_DETAIL_CONFIRM==="" ? "apis/flightdetailconfirm.txt" : API_FLIGHT_DETAIL_CONFIRM;
	
}
$API = new API();