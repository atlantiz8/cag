function Collection () {
	var tOverlay = $overlay;
	
	this.init = init;
	function init() {
		$("div.map li > div.buttons > a.button").click (mapViewClick) ;
		$("ul.SelectTerminal > li > a").click (mapSelect);
	}
	
	function mapViewClick (e) {
		e.preventDefault();
		//console.log($(this).parent().parent().attr('class'));
		tOverlay.showMapPanel($(this).parent().parent().attr('class'));
	}
	function mapSelect (e){
		e.preventDefault();
		$("ul.SelectTerminal > li").removeClass("active");
		var tIndex = $("ul.SelectTerminal > li > a").index(this);
		var targ = $("ul.SelectTerminal > li")[  tIndex ];
		//console.log (tIndex );
		$(targ).addClass("active");
		
		
		TweenMax.to ($("div.content > div.map > ul.holder"), 1.3, {css:{marginTop: 0- 350* tIndex }, easing:Cubic.easeOut});
		
		TweenMax.to ($("div.content > div.legend > ul.holder"), 1.3, {css:{marginTop: 0- 240* tIndex }, easing:Cubic.easeOut});
		//ul
	}
}
//var $overlay;
$(document).ready(function (){
	var collection = new Collection ();
	collection.init();
});