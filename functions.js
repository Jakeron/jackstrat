$( document ).ready(function() {

    console.log( "ready!" );

    //4 cards have value 10
    var cardValues = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];

    var playerHand = null;
    var dealerHand = null;
    var play = null;
    var streak = 0;

    var cardImagePath = "img/cards/";

    //buttons
    $("#btn_deal").click(function(){

    	$(this).hide();
    	deal();

    });

    $("#btn_hit").click(function(){
    	if(play == "hit"){
    		$("#checkmark").fadeIn( "slow", function() {
			    console.log("fadein complete");
			});
    		streak++;
    		$("#streak").html(streak);
    	}
    	else{
			streak = 0;
    		$("#streak").html(streak);
    	}
    	deal();
    });

    $("#btn_stand").click(function(){
    	if(play == "stand"){
    		streak++;
    		$("#streak").html(streak);
    	}
    	else{
    		streak = 0;
    		$("#streak").html(streak);
    	}
    	deal();
    });

    $("#btn_double").click(function(){
    	if(play == "double"){
    		streak++;
    		$("#streak").html(streak);
    	}
    	else{
    		streak = 0;
    		$("#streak").html(streak);
    	}
    	deal();
    });

    $("#btn_split").click(function(){
    	if(play == "split"){
    		streak++;
    		$("#streak").html(streak);
    	}
    	else{
    		streak = 0;
    		$("#streak").html(streak);
    	}
    	deal();
    });

    function deal(){

    	//see what hands player wants
    	var options = [];
    	$("#checkboxes input:checkbox").each(function(){
			if($(this).prop("checked")){
				options.push($(this).prop("name"));
			}
		});

		console.log("the options are: " + options);

    	//get a random type of hand from options
    	var handType = options[Math.floor(Math.random() * options.length)];
    	console.log("the random handtype is: " + handType);

    	switch(handType){
    		case "hards":
    			playerHand = getRandomHard();
    			break;
    		case "softs":
    			playerHand = getRandomSoft();
    			break;
    		case "pairs":
    			playerHand = getRandomPair();
    			break;
    	}


    	//give the dealer a hand too
    	dealerHand = getRandomHand();

    	$("#bottom .box .left img").attr("src", playerHand.card1.path);
    	$("#bottom .box .right img").attr("src", playerHand.card2.path);

    	$("#top .box .left img").attr("src", dealerHand.card1.path);
    	$("#top .box .right img").attr("src", cardImagePath + "cardback.png");

    	play = evaluate(playerHand, dealerHand.card1);

    	console.log("Player has " + playerHand.type + " " + playerHand.handValue);
    	console.log("Dealer is showing: " + dealerHand.card1.value);
    	console.log("Player should: " + play);

    }

    //give the player a pair
    function getRandomPair(){
    	var hand = null;
    	var handValue = null; 

    	var card1 = getRandomCard();
    	var type = "pair";

		handValue = card1.value;

    	hand = {
    		handValue: handValue,
    		card1: card1,
    		card2: card1,
    		type: type
    	};

    	return hand;
    }

    //give the player a soft hand
    function getRandomSoft(){

    	var hand = null;
    	var type = "soft";

    	var card1 = getRandomCard();

    	//don't give AA
    	while(card1.value == 11){
    		card1 = getRandomCard();
    	}

    	var card2 = {
    		value: 11,
    		name: "ace",
    		suit: "spades",
    		path: cardImagePath + "ace_of_spades.png"
    	};

    	hand = {
    		handValue: card1.value + card2.value,
    		card1: card1,
    		card2: card2,
    		type: type
    	};

    	return hand;
    }

    //give the player a hard hand
    function getRandomHard(){
    	var hand = null;
    	var type = "hard";

    	var card1 = getRandomCard();
    	var card2 = getRandomCard();

    	//don't give A
    	while(card1.value == 11){
    		card1 = getRandomCard();
    	}

    	//don't give A or pair
    	while(card2.value == card1.value || card2.value == 11){
    		card2 = getRandomCard();
    	}

    	hand = {
    		handValue: card1.value + card2.value,
    		card1: card1,
    		card2: card2,
    		type: type
    	};

    	return hand;
    }

    //give the player two cards, return hand object {soft, totalValue}
    function getRandomHand(){
    	
    	var hand = null;
    	var handValue = null; 

    	var card1 = getRandomCard();
    	var card2 = getRandomCard();
    	var type = null;

    	if(card1.value == card2.value){
    		type = "pair";
    	}
    	else{
    		if(card1.value == 11 || card2.value == 11){
    			type = "soft";
    		}
    		else{
    			type = "hard";
    		}
    	}

    	if(type == "pair"){
    		handValue = card1.value;
    	}
    	else{
    		handValue = card1.value + card2.value;
    	}

    	hand = {
    		handValue: handValue,
    		card1: card1,
    		card2: card2,
    		type: type
    	};

    	return hand;
    }


    //gets a random card, returns Card object
    function getRandomCard(){

 		var card = null;
 		var suit = null;
 		var cardName = null;
 		var cardValue = null;
 		var path = null;
 		
 		//0 = spade, 1 = diamond, 2 = club, 3 = heart
    	var suitValue = Math.floor(Math.random() * 4);

    	switch(suitValue){
    		case 0: 
    			suit = "spades";
    			break;
    		case 1:
    			suit = "diamonds";
    			break;
    		case 2:
    			suit = "clubs";
    			break;
    		case 3:
    			suit = "hearts";
    			break;
    	}

    	//get a random cardName value from 1-10 (1 being ace)
    	cardValue = cardValues[Math.floor(Math.random() * cardValues.length)]

    	//handle aces, facecards. Default use the cardValue numeric.
    	switch(cardValue){

    		case 10:
	    		{
	    			//0 = T, 1 = J, 2 = Q, 3 = K
    				var faceCard = Math.floor(Math.random() * 4);

		    		switch(faceCard){
		    			case 0:
		    				cardName = "10";
		    				break;
		    			case 1:
		    				cardName = "jack";
		    				break;
		    			case 2: 
		    				cardName = "queen";
		    				break;
		    			case 3:
		    				cardName = "king";
		    				break;
		    		}
	    		}
	    		break;

	    	case 11: 
    			cardName = "ace";
    			break;

	    	default:
	    		cardName = cardValue;
	    		break;

    	}

    	//create the path to the card
    	path = cardImagePath + cardName + "_of_" + suit + ".png"; 

    	//return the card 
    	card = {
    		value: cardValue,
    		name: cardName,
    		suit: suit,
    		path: path
    	};

    	return card;
    }

    //evaluates a situation, returns string containing correct play
    function evaluate(playerHand, dealerCard){

    	var correctPlay = null;

    	/* BEGIN STRATEGY LOGIC */
    	
    	//pairs
    	if(playerHand.type == "pair"){
			switch(playerHand.card1.value){
				case 2:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
							correctPlay = "split";
							break;
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 3:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
							correctPlay = "split";
							break;
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 4:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
							correctPlay = "hit";
							break;
						case 5:
						case 6:
							correctPlay = "split";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 5:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
							correctPlay = "double";
							break;
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 6:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "split";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 7:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
							correctPlay = "split";
							break;
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 8:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "split";
							break;
					}
				}
				break;

				case 9:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "split";
							break;
						case 7:
							correctPlay = "stand";
							break;
						case 8:
						case 9:
							correctPlay = "split";
							break;
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;

				case 10:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;

				case 11:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "split";
							break;
					}
				}
				break;
			}
		}

		//soft hands
		if(playerHand.type == "soft"){
			switch(playerHand.handValue){
				case 13:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
							correctPlay = "hit";
							break;
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 14:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
							correctPlay = "hit";
							break;
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 15:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
							correctPlay = "hit";
							break;
						case 4:
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}	
				}
				break;

				case 16:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
							correctPlay = "hit";
							break;
						case 4:
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 17:
				{
					switch(dealerCard.value){
						case 2:
							correctPlay = "hit";
							break;
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 18:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
							correctPlay = "stand";
							break;
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;

				case 19:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
							correctPlay = "stand";
							break;
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;

				case 20:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;

				case 21:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;

			}
		}

		//hard hands
		if(playerHand.type == "hard"){
			switch(playerHand.handValue){
				case 5:
				case 6:
				case 7:
				case 8:
					correctPlay = "hit";
					break;

				case 9:
				{
					switch(dealerCard.value){
						case 2:
							correctPlay = "hit";
							break;
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "double";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;
				
				case 10:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
						case 7:
						case 8:
						case 9:
							correctPlay = "double";
							break;
						case 10:
						case 11:
							correctPlay = "stand";
							break;
					}
				}
				break;
				
				case 11:
					correctPlay = "double";
					break;
				
				case 12:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
							correctPlay = "hit";
							break;
						case 4:
						case 5:
						case 6:
							correctPlay = "stand";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;
				
				case 13:
				case 14:
				case 15:
				case 16:
				{
					switch(dealerCard.value){
						case 2:
						case 3:
						case 4:
						case 5:
						case 6:
							correctPlay = "stand";
							break;
						case 7:
						case 8:
						case 9:
						case 10:
						case 11:
							correctPlay = "hit";
							break;
					}
				}
				break;
				
				case 17:
				case 18:
				case 19:
				case 20:
				case 21:
					correctPlay = "stand";
					break;
				
			}
		}

		return correctPlay;
    }



});