var Poll = function( id, chart_data ) {
	"use strict";

    $ = jQuery;
	var new_chart_data = chart_data.replace(/!/gi, '"');
	
    var self = this,
        //The Container the hold the whole poll and chart
        container = $("[data-poll-id='"+ id +"']"),
        //The canvas that displays the chart
        canvas = container.find("canvas"),
        //The chart type
        chartType = null, //1 - Bar, 2 - Pie, 3 - Dougnut, 4 - Line, 5 - Radar, 6 - Polar, 7 - Bootstrap
        //Is the user allowed to vote
        votingAllowed = false,
        //When the chart should be displayed
        displayChart = 0, //1 - After voting, 2 - Always, 3 - Click, 4 - Never
        //Chart Data
        chartData,
        //Chart Datasets
        chartDatasetsOptions,
        //Total Votes
        totalVotes = 0,
        //Can we show the chart
        showChart = false,
        //Instance
        instance = null,
        //The index of the radio button
        optionIndex = 0,
		// Chart data
		stringChartData = new_chart_data;



    function init() {

        //Setup events
        events();

        //Find out if the user is allowed to vote
        canUserVote();

        //Get the chart data
        getChartData();

        //Slide loading up
        container.find(".weblator-poll-loading").slideUp();

    }

    function canUserVote() {

        $.post(ajaxurl, {action: "has_voted", poll_id: id}, function (data) {

            if ( parseInt(data,10) ){
                votingAllowed = false;
                disableVoting();
            }
            else
                votingAllowed = true;
        });
    }

    function disableVoting() {

        //Disable radios and vote button
       // container.find("input[type=radio], .vote-button").attr("disabled", "disabled");

    }

    function whenToLoad() {


		displayChart = parseInt(id,10);

		if ( displayChart == 1 ){

			if ( !votingAllowed ){
				loadChart();
				showHideButton();
			}


		}else if ( displayChart == 2 ){

			loadChart();
			showHideButton();

		}else if ( displayChart == 3 ){

			showShowButton();


		}else if ( displayChart == 4 ){
			hideBothButtons();
		}
		
		if(jQuery('.grid').length > 0)
		{
			jQuery('.grid').masonry();
		}
    }

    function getChartData() {

            chartData = $.parseJSON(stringChartData),
            chartType = chartData.chart_type;

            //Update the totalVotes var with the actual total
            for (var i=0; i < chartData.totals.length; i++)
                chartData.totals[i] = parseInt(chartData.totals[i],10);

            //Oragnise the chart data
            if (chartData.chart_type == 1 || chartData.chart_type == 4 || chartData.chart_type == 5){

                chartDatasetsOptions = {

                    labels : chartData.labels,
                    datasets : [

                        {
                            fillColor : chartData.styles[0].fillColor,
                            strokeColor : chartData.styles[0].strokeColor,
                            pointColor : chartData.styles[0].pointColor,
                            pointStrokeColor : chartData.styles[0].pointStrokeColor,
                            data : chartData.totals

                        }
                    ]
                }

                for(var i = 0; i < chartDatasetsOptions.datasets[0].data.length; i++)
                    totalVotes += chartDatasetsOptions.datasets[0].data[i];

            }else {

                chartDatasetsOptions = [];

                for (var i = 0; i < chartData.totals.length; i++) {

                    totalVotes += parseInt(chartData.totals[i],10);

                    chartDatasetsOptions.push({
                        value: parseInt(chartData.totals[i],10),
                        color: chartData.option_colours[i],
                        label: chartData.labels[i],

                    });
                }


            }

            whenToLoad();
    }

	
    function loadChart() {

        slideDownCanvas();

        switch ( parseInt(chartType,10) ) {

            case 1:
                instance = new Chart( canvas.get(0).getContext("2d")).Bar( chartDatasetsOptions, chartData.options );
            break;

            case 2:
                instance = new Chart( canvas.get(0).getContext("2d")).Pie( chartDatasetsOptions, chartData.options );
                legend(document.getElementById("legend-" + id), chartDatasetsOptions);
            break;

            case 3:
                instance = new Chart( canvas.get(0).getContext("2d")).Doughnut( chartDatasetsOptions, chartData.options );
                legend(document.getElementById("legend-" + id), chartDatasetsOptions);
            break;

            case 4:
                instance = new Chart( canvas.get(0).getContext("2d")).Line( chartDatasetsOptions, chartData.options );
            break;

            case 5:
                instance = new Chart( canvas.get(0).getContext("2d")).Radar( chartDatasetsOptions, chartData.options );
            break;

            case 6:
                instance = new Chart( canvas.get(0).getContext("2d")).PolarArea( chartDatasetsOptions, chartData.options );
                legend(document.getElementById("legend-" + id), chartDatasetsOptions);
            break;

            case 7:
                loadBootstrap();
            break;

            showHideButton();
        }
    }

    function loadBootstrap() {

        if ( container.find(".bs-chart-container").length )
            container.find(".bs-chart-container").remove();

        var total = 0;
        for(var i=0; i < chartDatasetsOptions.length; i++)
            total = total + parseInt(chartDatasetsOptions[i].value,10);


        var bsChartContainer = $('<div/>')
            .attr("class", "bs-chart-container")
            .css("display", "block")
            .css("width", "100%");

        for(var i = 0; i < chartDatasetsOptions.length; i++){

            var label = $("<strong/>").html(chartDatasetsOptions[i].label);

            var progressContainer = $('<div/>').attr("class", "progress");

            var p = (chartDatasetsOptions[i].value / total) * 100

            var progressBar = $('<div/>')
                .attr("class", "progress-bar")
                .attr("role", "progressbar")
                .attr("aria-valuenow", p)
                .attr("aria-valuemin", 0)
                .css({
                    backgroundColor : chartDatasetsOptions[i].color
                });

            if (chartData.options.bsBarStriped)
                progressContainer.addClass("progress-striped");

            var span = $('<span/>')
                .attr("class", "")
                .html(chartDatasetsOptions[i].value);

            if (p > 0)
                progressBar.append(span);

            progressContainer.append(progressBar);
            bsChartContainer.append(label);
            bsChartContainer.append(progressContainer);
        }

        container.find(".width-control").html(bsChartContainer);

        bsChartContainer.slideDown();

        $(".progress-bar").each(function(){

            var value = $(this).attr("aria-valuenow");

            $(this).animate({
                width:value + "%"
            }, 1000);

        });

    }

    function submitVote() {

        //Check if a radio button has been selected if not display a warning
        if ( !container.find( ".weblator-poll-vote ul li input[type='radio']:checked" ).length ){

            container.find(".alert-danger").slideDown();
            setTimeout(function(){
                container.find(".alert-danger").slideUp();
            }, 3000);

            return;

        } else {

            //Show the spinny icon
           // container.find(".vote-button .vote-spin").css("display", "inline-block");
            //Show success message
            container.find(".alert-success").slideDown();
            //container.find("input[type=radio], .vote-button").attr("disabled", "disabled");

            var option = container.find("input[name='weblator-chart-options']:checked").val();
            optionIndex = container.find("input[name='weblator-chart-options']:checked").attr("data-index");

            $.post(ajaxurl, {action:"save_vote", option:option, poll_id:id}, function(response){

                //Uncheck the radio button
                container.find("input[name='weblator-chart-options']:checked").prop('checked', false);

                //Re-check to see if we can vote again
                canUserVote();

                if ( votingAllowed ) {
                    container.find("input[type=radio], .vote-button").removeAttr("disabled");
                } else {
                    disableVoting();
                }

                //Check to see if we should show the chart
                if ( displayChart == 1 ){

                    if ( instance ) {

                        updateCharts();

                    } else {

                        getChartData();
                        loadChart();
                    }

                }else if ( displayChart == 2 ){

                    updateCharts();

                }else if ( displayChart == 3 ){

                    if ( instance ) {

                        updateCharts();
                    }

                }

                container.find(".vote-button .vote-spin").css("display", "none");

                setTimeout(function(){
                    container.find(".alert-success").slideUp();
                }, 3000);

            });
        }
    }

    function updateCharts() {

        switch ( parseInt(chartType,10) ) {

            case 1:
                var newValue = instance.datasets[0].bars[optionIndex].value + 1
                instance.datasets[0].bars[optionIndex].value = newValue;
                instance.update();
            break;

            case 2:
            case 3:
            case 6:
                var newValue = instance.segments[optionIndex].value + 1
                instance.segments[optionIndex].value = newValue;
                instance.update();
            break;

            case 4:
            case 5:
                var newValue = instance.datasets[0].points[optionIndex].value + 1
                instance.datasets[0].points[optionIndex].value = newValue;
                instance.update();
            break;

            case 7:
                getChartData();
                loadBootstrap()
            break;
        }


    }


    function showHideButton() {

        container.find(".weblator-view-poll").css("display", "none");
        container.find(".weblator-hide-poll").css("display", "block");
    }

    function showShowButton() {

        container.find(".weblator-view-poll").css("display", "block");
        container.find(".weblator-hide-poll").css("display", "none");
    }

    function hideBothButtons(){

        container.find(".weblator-view-poll").css("display", "none");
        container.find(".weblator-hide-poll").css("display", "none");
    }

    function slideDownCanvas(){

        if ( chartType == 7 ) {

            container.find(".bs-chart-container").slideDown();

        }else {

            canvas.slideDown();

            if ( container.find(".legend").length )
                container.find(".legend").slideDown();

        }

        showHideButton();
    }

    function slideUpCanvas(){

        if ( chartType == 7 ) {

            container.find(".bs-chart-container").slideUp();

        }else {

            canvas.slideUp();

            if ( container.find(".legend").length )
                container.find(".legend").slideUp();

        }

        showShowButton();
    }

    function events() {

        //Vote button
        container.find(".vote-button").click( submitVote );

        //View Button
        container.find(".weblator-view-poll").click( function(e){

            e.preventDefault();

            if ( !instance && chartType != 7 )
                loadChart();


            slideDownCanvas();



        } );

        //Hide Button
        container.find(".weblator-hide-poll").click( function(e){

            e.preventDefault();
            slideUpCanvas();

        } );
    }

    init();
}
