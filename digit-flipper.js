// Digit Flipper
// Author: Shelly Njoo, shelly@shellynjoo.com

//Takes a number and outputs a span for each digit into a parent element
var printSeparateDigits = function(num, parentElem) {
	if (typeof num != 'string') {
		num = num.toString();	
	}
	parentElem.empty();
	for (var i=0;i<num.length;i++) {
	 	parentElem.append(
	 		'<span class="digit">'+num[i]+'</span>'
	 	);
	}
}

//Moves contents of New element into Old element
var moveNewToOld = function(parentElem) {
	var oldEl = parentElem.find('.old');
	var newEl = parentElem.find('.new');
	//if new is not empty, move new elems to old
	if (newEl.children().length > 0) {
		oldEl.empty();
		newEl.children().appendTo(oldEl);
	}
}

/*Call Flip*/
var flipThis = function(el) {
	//Give element explicit height so transform-origin can calculate properly
	el.css( 'height', el.height() );
	var elContent = el.text();
	el.empty();
	//Create front and back element, Leave front element empty, fill back element with content of el
	el.append('<div class="front"></div><div class="back">'+elContent+'</div>');
	if ( window.navigator.userAgent.indexOf("MSIE") > -1 || navigator.appVersion.indexOf('Trident/') > -1 ) {
		return;
	} else {
		//Init Flip plugin
		el.flip({
			axis: 'x',
			trigger: 'manual',
			speed: 200
		});
		//Trigger Flip
		el.flip(true);
		//Destroy Flip when transition ends
		setTimeout(//need timeout instead of using ontranstionend because if user changes the number too fast, the end event can never fire
		    function(e) {
		    	el.unwrap();
		    	el.find('.front').remove();
		    	el.text( el.find('.back').text() );
		    	el.find('.back').empty();
		    	el.removeAttr('style');
		    }
		, 200);//set timeout equal to speed of flip
	}
}

//Find digit element to flip. Pass in two elements with child elems, find child elems that differ, then call flip on them
var flipDiffDigit = function(parentElem) {
	var oldDigits = parentElem.find('.old').children();
	var newDigits = parentElem.find('.new').children();

	//Failsafe: if old & new have different amounts of children, flip all the digits in .new elem
	if (oldDigits.length != newDigits.length) {
		newDigits.each(function() {
			flipThis( $(this) );
		});
	} else {
	//Otherwise, compare each digit and flip the different one
		for (var i=0;i<oldDigits.length;i++) {
			if ( $(oldDigits[i]).text() != $(newDigits[i]).text() ) {
				flipThis( $(newDigits[i]) );
			}
		}
	}
	//Give leading zeros visibility hidden
	//Leading zeros needed as padding, otherwise container collapses
	var $firstNewDigit = $(newDigits[0]);
	if ($firstNewDigit.text() == 0) {
		$firstNewDigit.addClass('leading-zero');
	}
}

//Put it all together
var flipDigits = function(num, parentElem) {
	moveNewToOld(parentElem);
	printSeparateDigits( num, parentElem.find('.new') );//new num
	flipDiffDigit(parentElem);
}