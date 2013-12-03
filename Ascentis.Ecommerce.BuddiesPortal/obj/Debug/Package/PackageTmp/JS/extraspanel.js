function ExtrasPanel () {
	var target = $("#tabRowHolder");
	var currentList = 0;
	var currentItem = 0;
	var maxScroll = 0;
	var vSpace = -220;
	var hSpace = -945;
	
	this.init = function init () {
		
		target.find("ul.nav li").click(onListClick);
		target.find("div.arrows a.right").click(onRightClick);
		target.find("div.arrows a.left").click(onLeftClick);
		
		var holder = target.find("div.holder > div.panel");
		var newlist = $(target.find("div.holder > div.panel > ul")[0]);
		var newListCount = newlist.find( "> li").length;
		maxScroll = Math.ceil( newListCount/ 5) ;
		currentItem = 0;
		if (newListCount < 6) {
			TweenMax.to( target.find("div.arrows"), 1, {css:{autoAlpha:0} } );
		} else {
			TweenMax.to( target.find("div.arrows"), 1, {css:{autoAlpha:1}} );
			TweenMax.to( target.find("div.arrows a.left"), 1, {css:{autoAlpha:0}} );
		}
		
	}
	
	function onListClick (e) {
		e.preventDefault();
		var myID = target.find("ul.nav li").index(this);
	//	console.log("[ExtrasPanel] - onListClick - myID:", myID); 
		
		if (currentList == myID) {
			return false;
		}
		target.find("ul.nav li").removeClass("active");
		$(this).addClass("active");
		
		currentList = myID;
		
		var holder = target.find("div.holder > div.panel");
		var goV = vSpace * currentList;
		TweenLite.to(holder, 1, {css:{marginTop:goV }, easing:Expo.easeOut});
		
		var newlist = $(target.find("div.holder > div.panel > ul")[myID]);
		var newListCount = newlist.find( "> li").length;
		maxScroll = Math.ceil( newListCount / 5) ;
		currentItem = 0;
		
		newlist.css({marginLeft:0});
		
		if (newListCount < 6) {
			TweenMax.to( target.find("div.arrows"), 1, {css:{autoAlpha:0} } );
		} else {
			TweenMax.to( target.find("div.arrows"), 1, {css:{autoAlpha:1}} );
			TweenMax.to( target.find("div.arrows a.left"), 1, {css:{autoAlpha:0}} );
			TweenMax.to( target.find("div.arrows a.right"), 1, {css:{autoAlpha:1}} );
		}
	}
	
	function onRightClick(e) {
		e.preventDefault();
		if (currentItem +1 >= maxScroll){
			return false;
		}
		currentItem += 1;
		var tList = $(target.find("div.holder > div.panel > ul")[currentList]);
		//console.log("onRightClick", tList);
		var goH = hSpace * currentItem;
		TweenMax.to( tList, 1.3, {css:{marginLeft:goH}, easing:Expo.easeOut} );
		TweenMax.to( target.find("div.arrows a.left"), 1, {css:{autoAlpha:1}} );
		if (currentItem == maxScroll -1 ) {
			TweenMax.to( target.find("div.arrows a.right"), 1, {css:{autoAlpha:0}} );
        }
	}
	function onLeftClick(e) {
		e.preventDefault();
		if (currentItem -1 <0){
			return false;
		}
		currentItem -= 1;
		var tList = $(target.find("div.holder > div.panel > ul")[currentList]);
		//console.log("onRightClick", tList);
		var goH = hSpace * currentItem;
		TweenMax.to( tList, 1.3, {css:{marginLeft:goH}, easing:Expo.easeOut} );
		
		TweenMax.to( target.find("div.arrows a.right"), 1, {css:{autoAlpha:1}} );
		if (currentItem == 0) {
			TweenMax.to( target.find("div.arrows a.left"), 1, {css:{autoAlpha:0}} );
		}
	}
}
$(document).ready(function (){
	$extrasPanel = new ExtrasPanel ();
	$extrasPanel.init();
});