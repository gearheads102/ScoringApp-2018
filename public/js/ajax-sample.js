var card;
$(function(){
	
	$("#submit").on("click", function(){
		//console.log(this);
		createNotificationCard( "hello", "good");

	});
	
});

function createNotificationCard( text, type ){
	
	var color;
	
	switch( type ){
		case "alert": 
			color = "gear-red";
			break;
		case "warn":
			color = "w3-amber";
			break;
		case "good":
			color = "gear-blue";
			break;
		case "102":
			color = "gear-orange";
			break;
		default:
			color = "gear-white";
			 break;
	}
	
	if(!text){
		return null;
	}
	
	var card = document.createElement("div");
	
	card.innerText = "i am a card";
	card.classList.add("w3-card");
	card.classList.add("w3-padding");
	card.classList.add("w3-border");
	card.classList.add("w3-half");
	card.classList.add("w3-center");
	card.classList.add( color );
	card.style = "position:absolute; left:25%;top:50px; transition:opacity 2.5s; opacity:1; z-index:2;";
	card.id = "notification-card";
	
	document.body.appendChild(card);
	
	
	setTimeout( function(){
		var cards = document.querySelectorAll("#notification-card");
		
		if(cards.length >= 0)
			for( var i = 0; i < cards.length; i++ ){
				cards[i].style.opacity = 0;
			}
	}, 800);
	
	setTimeout( function(){
		$("#notification-card").remove();
	}, 5000);
	
}





