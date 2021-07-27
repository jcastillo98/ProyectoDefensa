﻿function lagXHRobjekt() {
	"use strict";
	var XHRobjekt = null;
	
	try {
		ajaxRequest = new XMLHttpRequest(); // Firefox, Opera, ...
	} catch(err1) {
		try {
			ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP"); // Noen IE v.
		} catch(err2) {
			try {
					ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP"); // Noen IE v.
			} catch(err3) {
				ajaxRequest = false;
			}
		}
	}
	return ajaxRequest;
}


function menu_updatesort(jsonstring) {	
	"use strict";
	mittXHRobjekt = lagXHRobjekt(); 

	if (mittXHRobjekt) {
		mittXHRobjekt.onreadystatechange = function() { 
			if(ajaxRequest.readyState == 4){
				var ajaxDisplay = document.getElementById('sortDBfeedback');
				if(ajaxRequest.responseText && ajaxDisplay){
					ajaxDisplay.innerHTML = ajaxRequest.responseText;
					jQuery('input#menu_order').val(ajaxDisplay.innerHTML);
				}
			} else {
				// Uncomment this an refer it to a image if you want the loading gif
				//document.getElementById('sortDBfeedback').innerHTML = "<img style='height:11px;' src='images/ajax-loader.gif' alt='ajax-loader' />";
			}
		}
		var cpturl=php_data.treeupdate_path_url;
		
		ajaxRequest.open("GET", ""+cpturl+"?jsonstring=" + jsonstring + "&rand=" + Math.random()*9999, true);
		ajaxRequest.send(null); 
	}
}
