jQuery(document).ready(function() {
	"use strict";
    if (jQuery(".current_day").length > 0)  
		initShadow();
});

function initShadow() {
	"use strict";
	jQuery(document).ready(function(){
		jQuery(".flat-icon").flatshadow({
			fade: false,
			angle: "SE",
			color:  " #2a2f43 ",
			boxShadow: " #222636 "
		}); 
	});
};