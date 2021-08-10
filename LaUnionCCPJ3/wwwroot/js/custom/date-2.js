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
			color:  " #1a1a1a ",
			boxShadow: " #151515 "
		}); 
	});
};
