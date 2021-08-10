jQuery(function($){
	"use strict";

    setTimeout(function(){
        $("canvas[data-weblator-poll-id]").each(function(){
            new Poll($(this).data("weblator-poll-id"), $(this).data("chart"));
        });
    }, 1000);

});