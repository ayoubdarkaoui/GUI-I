$(document).ready(function() {
    var tabCounter = 1;
    var tabs = $("#tabs").tabs();

    // Initialize sliders and sync with input fields
    function initializeSlider(slider, input) {
        slider.slider({
            range: "min",
            min: -50,
            max: 50,
            value: input.val(),
            slide: function(event, ui) {
                input.val(ui.value);
                input.trigger("change");
            }
        });
        input.on("change", function() {
            slider.slider("value", this.value);
        });
    }

    initializeSlider($("#minXSlider"), $("#minXVal"));
    initializeSlider($("#maxXSlider"), $("#maxXVal"));
    initializeSlider($("#minYSlider"), $("#minYVal"));
    initializeSlider($("#maxYSlider"), $("#maxYVal"));

    // Form validation
    $("#tableForm").validate({
        rules: {
            minXVal: { required: true, number: true, range: [-50, 50] },
            maxXVal: { required: true, number: true, range: [-50, 50] },
            minYVal: { required: true, number: true, range: [-50, 50] },
            maxYVal: { required: true, number: true, range: [-50, 50] }
        },
        messages: {
            minXVal: "Please enter a value between -50 and 50",
            maxXVal: "Please enter a value between -50 and 50",
            minYVal: "Please enter a value between -50 and 50",
            maxYVal: "Please enter a value between -50 and 50"
        },
        submitHandler: function(form) {
            generateTable();
            return false;
        }
    });

    // Generate table and create new tab
    function generateTable() {
        var minXVal = parseInt($("#minXVal").val());
        var maxXVal = parseInt($("#maxXVal").val());
        var minYVal = parseInt($("#minYVal").val());
        var maxYVal = parseInt($("#maxYVal").val());

        if (minXVal > maxXVal) {
            [minXVal, maxXVal] = [maxXVal, minXVal];
            $("#info").text("Starting and ending column value swapped.");
        } else {
            $("#info").text("");
        }

        if (minYVal > maxYVal) {
            [minYVal, maxYVal] = [maxYVal, minYVal];
            $("#info").append(" Starting and ending row value swapped.");
        } else {
            $("#info").append("");
        }

        var tableHtml = "<table><thead><tr id='columns'><th></th>";
        for (let i = minXVal; i <= maxXVal; i++) {
            tableHtml += "<th>" + i + "</th>";
        }
        tableHtml += "</tr></thead><tbody id='rows'>";

        for (let i = minYVal; i <= maxYVal; i++) {
            tableHtml += "<tr><th>" + i + "</th>";
            for (let j = minXVal; j <= maxXVal; j++) {
                tableHtml += "<td>" + (i * j) + "</td>";
            }
            tableHtml += "</tr>";
        }
        tableHtml += "</tbody></table>";

        var tabTitle = `${minXVal}-${maxXVal}, ${minYVal}-${maxYVal}`;
        var tabContent = $(tableHtml);

        tabs.find(".ui-tabs-nav").append(`<li><a href='#tab-${tabCounter}'>${tabTitle}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>`);
        tabs.append(`<div id='tab-${tabCounter}'>${tabContent.html()}</div>`);
        tabs.tabs("refresh");
        tabCounter++;

        // Close icon: removing the tab on click
        tabs.delegate("span.ui-icon-close", "click", function() {
            var panelId = $(this).closest("li").remove().attr("aria-controls");
            $("#" + panelId).remove();
            tabs.tabs("refresh");
        });

        // Reset form and sliders
        $('#tableForm')[0].reset();
        $("#minXSlider, #maxXSlider, #minYSlider, #maxYSlider").slider("value", 1);
        $("#minXVal, #maxXVal, #minYVal, #maxYVal").val(1);
    }

    // Remove all tabs
    $("#resetButton").click(function() {
        tabs.find(".ui-tabs-nav li").remove();
        tabs.find(".ui-tabs-panel").remove();
        tabs.tabs("refresh");
    });
});
