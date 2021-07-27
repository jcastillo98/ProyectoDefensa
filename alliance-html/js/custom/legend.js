function legend(parent, data) {
	"use strict";

    //parent.className = 'legend';
    var datas = data.hasOwnProperty('datasets') ? data.datasets : data;

    jQuery(parent).empty();

    for (var i = 0; i < datas.length; i++) {
        //datas.forEach(function(d) {

        var span = jQuery("<div></div>")
            .html(datas[i].label)
            .addClass("weblator-label")
            .css({
                fontSize : jQuery(parent).attr("data-font-size") + "px"
            });

        var title = jQuery("<li></li>")
            .attr("class", "title")
            .append(span);

        var box = jQuery("<div></div>")
            .addClass("box")
            .css({
                backgroundColor : datas[i].color,

            });

        if (jQuery(parent).hasClass("tr"))
            title.append(box);
        else
            title.prepend(box);

        jQuery(parent).append(title);


    };
}
