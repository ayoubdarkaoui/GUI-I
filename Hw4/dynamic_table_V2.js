/*
Assignment 4 File: dynamic_table_V2.js
Assignment 3 Details: Using the jQuery Plugin/UI Dynamic multiplication Table
Ayoub Darkaoui, UMass Lowell Computer Science Student, Ayoub_Darkaoui@student.uml.edu

Copyright (c) 2024 by Ayoub Darkaoui. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AD on June 17, 2024 at 9:23 PM
*/
// store HTML elements as variables
var dynamicTable = document.getElementById("dynamicTable");
var infoMsg = document.getElementById("info");
var minX = document.getElementById("minX");
var maxX = document.getElementById("maxX");
var minY = document.getElementById("minY");
var maxY = document.getElementById("maxY");
var minXVal, maxXVal, minYVal, maxYVal;

/* generateTable makes sure each value is valid and begins inserting the HTML
elements necessary to create the columns and rows for a multiplication table.
The table data is calculated and filled in during the insertion of the rows.
Returns true if successful, otherwise returns false. */
function generateTable() {
    let temp = 0;
    let rowString = "";

    // if values are not valid then do nothing and return false
    if (!checkValues()) { return false; }

    if (minXVal > maxXVal) {    // swap min and max column values
        temp = minXVal;
        minXVal = maxXVal;
        maxXVal = temp;
        infoMsg.textContent = "Swapping starting and ending column value. ";
    }
    else {
        infoMsg.textContent = "";
    }
    if (minYVal > maxYVal) {    // swap min and max row values
        temp = minYVal;
        minYVal = maxYVal;
        maxYVal = temp;
        infoMsg.textContent += "Swapping starting and ending row value.";
    }
    else {
        infoMsg.textContent += "";
    }

    // insert empty table HTML
    dynamicTable.innerHTML = "<table><thead><tr " +
        "id=\"columns\"></tr></thead><tbody id=\"rows\"></tbody></table>";

    let columns = document.getElementById("columns");
    let rows = document.getElementById("rows");

    // fill in columns
    columns.innerHTML = "<th></th>";
    for (let i = minXVal; i <= maxXVal; i++) {
        columns.innerHTML += "<th>" + i + "</th>";
    }

    // fill in rows with multiplication data
    for (let i = minYVal; i <= maxYVal; i++) {
        rowString += "<tr><th>" + i + "</th>";
        for (let j = minXVal; j <= maxXVal; j++) {
            rowString += "<td>" + (i * j) + "</td>";
        }
        rowString += "</tr>";
    }
    rows.innerHTML = rowString;

    return true;
}

/* checkValues checks the user input form values and returns true if they are
within range of -50 to 50, otherwise it displays an error message within the
fieldset and returns false */
function checkValues() {
    minXVal = parseInt(minX.value);
    maxXVal = parseInt(maxX.value);
    minYVal = parseInt(minY.value);
    maxYVal = parseInt(maxY.value);

    if (minXVal < -50 || minXVal > 50 || isNaN(minXVal) || maxXVal < -50 ||
        maxXVal > 50 || isNaN(maxXVal) || minYVal < -50 || minYVal > 50 ||
        isNaN(minYVal) || maxYVal < -50 || maxYVal > 50 || isNaN(maxYVal)) {
        infoMsg.textContent = "One or more values is not within range of -50 to"
            + " 50";
        return false;
    }
    else {
        infoMsg.textContent = "";
        return true;
    }
}

// jQuery events and validation
$(document).ready(function () {
    var tabs = $("#savedTables").tabs();    // saved table tabs
    var ul = tabs.find("ul");
    var removeButton = $("#removeTab");
    var resetButton = $("#resetButton");
    var tabCount = 0;
    var tabStr = "";

    tabs.hide();
    removeButton.hide();
    resetButton.hide();
    generateTable();

    // save table / submit form event
    $("#generateForm").submit(function (event) {
        event.preventDefault();     // prevent redirection on form submit
        if (generateTable()) {      // make sure values are valid
            tabs.show();
            removeButton.show();
            resetButton.show();

            // tab info strings
            tabStr = $(minX).val() + " – " + $(maxX).val() + " x " +
                $(minY).val() + " – " + $(maxY).val();

            // add new tab
            $("<li><a href=\"#tab" + tabCount + "\">" + tabStr +
                "</a></li>").appendTo(ul);
            $("<div id=\"tab" + tabCount + "\"></div>").appendTo(tabs);

            // clone table HTML into new tab
            $("#dynamicTable").clone().appendTo("#tab" + tabCount);
            tabs.tabs("refresh");
            tabs.tabs({
                active: tabCount
            });
            tabCount++;
        }
    });

    // remove individual tab
    removeButton.click(function () {
        let tabId = tabs.tabs("option", "active");
        $("#tab" + tabId).remove();
        $("a[href=\"#tab" + tabId + "\"]").closest("li").remove();

        // decrement each existing tab after a remove tab
        for (tabId; tabId < tabCount - 1; tabId++) {
            $("#tab" + (tabId + 1)).attr("id", "tab" + tabId);
            $("a[href=\"#tab" + (tabId + 1) + "\"]").attr("href", "#tab" +
                tabId);
        }
        tabs.tabs("refresh");
        tabCount--;
    });

    // reset all saved table tabs
    resetButton.click(function () {
        $("#savedTables").find("div").remove();
        ul.empty();
        tabCount = 0;
        tabs.hide();
        removeButton.hide();
        resetButton.hide();
    });

    // form validation
    $("#generateForm").validate({
        errorElement: "div",
        errorPlacement: function (error, element) {
            switch (element.attr("id")) {
                case "minX":
                    error.insertAfter("#minXSlider");
                    break;
                case "maxX":
                    error.insertAfter("#maxXSlider");
                    break;
                case "minY":
                    error.insertAfter("#minYSlider");
                    break;
                case "maxY":
                    error.insertAfter("#maxYSlider");
                    break;
                default:
                    console.log(
                        "validate(errorPlacement()): unknown element id");
            }
        }
    });

    // custom error messages for invalid number input
    $("input[type=\"number\"]").rules("add", {
        required: true,
        min: -50,
        max: 50,
        messages: {
            required: "Please enter a valid number.",
            min: "Number must be in range of -50 to 50.",
            max: "Number must be in range of -50 to 50."
        }
    });

    // global slider properties
    var sliderOpts = {
        min: -50,
        max: 50,
        step: 1,
        value: 0
    }

    /* setup two-way binding on each slider and input, generateTable() is
    called dynamically on either a slide or number input event */
    $("#minXSlider").slider(sliderOpts, {
        slide: function (event, ui) {
            $(minX).val(ui.value);
            generateTable();
        }
    });
    $("#minXSlider").slider("value", $(minX).val());
    $(minX).on("input", function () {
        let newVal = $(this).val();
        if (!isNaN(newVal) && newVal >= -50 && newVal <= 50) {
            $("#minXSlider").slider("value", newVal);
            generateTable();
        }
    });

    $("#maxXSlider").slider(sliderOpts, {
        slide: function (event, ui) {
            $(maxX).val(ui.value);
            generateTable();
        }
    });
    $("#maxXSlider").slider("value", $(maxX).val());
    $(maxX).on("input", function () {
        let newVal = $(this).val();
        if (!isNaN(newVal) && newVal >= -50 && newVal <= 50) {
            $("#maxXSlider").slider("value", newVal);
            generateTable();
        }
    });

    $("#minYSlider").slider(sliderOpts, {
        slide: function (event, ui) {
            $(minY).val(ui.value);
            generateTable();
        }
    });
    $("#minYSlider").slider("value", $(minY).val());
    $(minY).on("input", function () {
        let newVal = $(this).val();
        if (!isNaN(newVal) && newVal >= -50 && newVal <= 50) {
            $("#minYSlider").slider("value", newVal);
            generateTable();
        }
    });

    $("#maxYSlider").slider(sliderOpts, {
        slide: function (event, ui) {
            $(maxY).val(ui.value);
            generateTable();
        }
    });
    $("#maxYSlider").slider("value", $(maxY).val());
    $(maxY).on("input", function () {
        let newVal = $(this).val();
        if (!isNaN(newVal) && newVal >= -50 && newVal <= 50) {
            $("#maxYSlider").slider("value", newVal);
            generateTable();
        }
    });
});