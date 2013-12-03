//function Transactions () {
//	var bt = $("a.viewmore.button");
//	var template = $("div.transactionTemplate div.transbox");
//	var list = $("div.content div.transactionlist");
//	
//	this.init = init;
//	function init () {
//		bt.click(viewMoreClick);
//	}
//	
//	function viewMoreClick (e) {
//		e.preventDefault ();
//		loadData()
//		//addItems();
//	}
//	function loadData () {
//		var sData = {service:"get", type:"transactions"};
//		$.ajax({
//			data: JSON.stringify(sData),
//			url: $API.GET_TRANSACTIONS,
//			dataType:"json"
//			
//		}).done(doneLoad) ;
//	}
//	function doneLoad (e) {
//		//console.log ("doneLoad", e);
//		addItems (e.params.transactions);
//	}
//	
//	function addItems (data) {
//		//console.log (data);
//		
//		for ( i=0; i< data.length; i++) {
//			var tLength =  (list.find("> div").length);
//			
//			var temp = template.clone();
//			if (tLength%2 == 0){
//				temp.removeClass("transbox");
//				temp.addClass("transbox_grey");
//			}
//			var tempData = data[i];
//			
//			temp.find("li.itemdate").html(tempData.date);
//			temp.find("li.itemsales a").html(tempData.salesNo);
//			temp.find("li.itemsales a").attr("href", tempData.detailslink);
//			temp.find("li.itempayment div").html(tempData.payment);
//			
//			var terminalMaplink = "";
//			switch (tempData.terminal) {
//				case "T1":
//					terminalMaplink = "t1.html";
//				break;
//				case "T2":
//					terminalMaplink = "t2.html";
//				break;
//				case "T3":
//					terminalMaplink = "t3.html";
//				break;
//			}
//			temp.find("li.iteminfo a").html(tempData.terminal);
//			temp.find("li.iteminfo a").attr("href", terminalMaplink);
//			
//			temp.find("li.itemstatus div").html(tempData.statustext);
//			temp.find("li.itemstatus div").addClass( (tempData.status==1)?"ready":"cancelled" );
//			
//			temp.find("li.reorder a").attr("href", tempData.orderlink);
//			
//			list.append(temp);
//		}
//		//{"date":"01 Dec 2012", "salesNo":"1234456", "payment":"PAID", "terminal":"T2", "statustext":"READY FOR COLLECTION", "status":1, "detailslink":"xxxxx.html", "orderlink":"xxxxx.html"}
//		/*
//		<div class="transbox">  
//            <ul class="transitem">
//                <li class="itemdate"> 03 Dec 2012 </li> 
//                <li class="itemsales"><a class="sales">1404649405</a></li>   
//                <li class="itempayment"><div class="transtext">Paid</div></li>    
//                <li class="iteminfo"><a class="terminalno">T2</a></li>                                
//                <li class="itemstatus">
//				    <div class="cancelled">
//					   <div class="transtext">Cancelled</div>
//					</div>
//			    </li>  
//                <li class="reorder">
//					<div class="buttons">
//						<a href="#" class="button brown">
//						    
//							<div class="text"><img class="icon_reorder" src="img/icon/reorder.png" />Reorder</div>
//							<div class="loader"></div>
//						</a>
//						
//						<div class="clear"></div>
//					</div>								
//				</li> 								
//            </ul>
//            <div class="clear"></div>                      
//        </div>
//                        */
//		
//		//
//	}
//}
//$(document).ready(function (){
//	$transactions = new Transactions ();
//	$transactions.init();
//});