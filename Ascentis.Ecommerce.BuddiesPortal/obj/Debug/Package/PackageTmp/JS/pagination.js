function initiateBottomPagination() {

    this.setViewIndex = setViewIndex;
    this.getViewIndex = getViewIndex;
    this.updateArrowVis = updateArrowVis;
    this.goRight = goRight;

	// This might change for specific page cases...
	var pagination = $("#pagination");
	var paginationHolder = pagination.find(".holder");
	var LIMIT_PER_VIEW = 5;
	var ITEM_WIDTH = 47;
	var LIMIT_WIDTH = ITEM_WIDTH * LIMIT_PER_VIEW;
	
	var viewIndex = 0;
	// we assume left and right arrow has the same width as the rest of the items.
	
    function setViewIndex(par){
        if($.isNumeric(par)){
            viewIndex = par;
        }
    }
    function getViewIndex(){
        return viewIndex;
    }

	var paginationList = paginationHolder.children("ul");
	var itemLen = paginationList.children("li").length;
	
	// Centerise container if required
	if (itemLen < LIMIT_PER_VIEW) {
		paginationHolder.width(itemLen * ITEM_WIDTH + 2*ITEM_WIDTH);
	}
	
	var totalViews = Math.ceil(itemLen / LIMIT_PER_VIEW);
	
	
	var arrows = paginationHolder.find(".arrows a");
	var leftArrow = arrows.length ? $(arrows[0]) : $("<div></div>");
	var rightArrow = arrows.length > 1 ? $(arrows[1]) :  $('<div class="right"></div>');
	

	function goLeft() {
		viewIndex--;
		if (viewIndex < 0) viewIndex = 0;
		paginationList.stop().animate({left:-viewIndex*LIMIT_WIDTH}, 500);
		updateArrowVis();
	}

	function goRight() {  
		if (viewIndex >= totalViews -1) return;
		viewIndex++;
		var tarLeft = viewIndex * LIMIT_WIDTH;
//		tarLeft -=  (viewIndex + 1) * LIMIT_PER_VIEW > itemLen ? ((	viewIndex + 1) * LIMIT_PER_VIEW  - itemLen) * ITEM_WIDTH : 0;
        paginationList.stop().animate({left: -tarLeft}, 500);
		updateArrowVis();
	}
	
	function updateArrowVis() {
		rightArrow.css("visibility", (viewIndex < totalViews - 1) ? "visible" : "hidden" );
		leftArrow.css("visibility", (viewIndex > 0) ?  "visible" : "hidden" );
	}
	
	
	
	arrows.click( function(e) {
		var me = $(this);
		e.preventDefault();
		if (me.hasClass("right") ) {
			goRight();
		}
		else {
			goLeft();
		}
		
		return false;
	});
	
//	updateArrowVis();	
	
}