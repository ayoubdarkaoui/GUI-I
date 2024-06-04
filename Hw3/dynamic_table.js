/*
Assignment 3 File: dynamic_table.js
Assignment 3 Details: Creating an intractive table using Java Script
Ayoub Darkaoui, UMass Lowell Computer Science Student, Ayoub_Darkaoui@student.uml.edu

Copyright (c) 2024 by Ayoub Darkaoui. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AD on June 3, 2024 at 9:23 PM
*/


// store HTML elements as variables
var generateButton = document.getElementById("generateButton");
var infoMsg = document.getElementById("info");
var minX = document.getElementById("minXVal");
var maxX = document.getElementById("maxXVal");
var minY = document.getElementById("minYVal");
var maxY = document.getElementById("maxYVal");
var minXVal, maxXVal, minYVal, maxYVal;

/* generateTable makes sure each value is valid and begins inserting the HTML
elements necessary to create the columns and rows for a multiplication table.
The table data is calculated and filled in during the insertion of the rows. */
function generateTable(event) {
    event.preventDefault(); // Prevent form submission

    let temp = 0;
    let rowString = "";

    // if values are not valid then do nothing
    if (!checkValues()) { return; }

    if (minXVal > maxXVal) {    // swap min and max column values
        temp = minXVal;
        minXVal = maxXVal;
        maxXVal = temp;
        infoMsg.textContent = "Starting and ending column value swapped. ";
    } else {
        infoMsg.textContent = "";
    }
    if (minYVal > maxYVal) {    // swap min and max row values
        temp = minYVal;
        minYVal = maxYVal;
        maxYVal = temp;
        infoMsg.textContent += "Starting and ending row value swapped.";
    } else {
        infoMsg.textContent += "";
    }

    // insert empty table HTML
    document.getElementById("table").innerHTML = "<table><thead><tr id=\"columns\"></tr></thead><tbody id=\"rows\"></tbody></table>";
    document.getElementById("table").style.overflow = "scroll";

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
        infoMsg.textContent = "One or more values is not within range of -50 to 50 ";
        return false;
    } else {
        infoMsg.textContent = "";
        return true;
    }
}

// add event listeners to the form
document.getElementById('tableForm').addEventListener('submit', generateTable);
minX.addEventListener("focusout", checkValues, false);
maxX.addEventListener("focusout", checkValues, false);
minY.addEventListener("focusout", checkValues, false);
maxY.addEventListener("focusout", checkValues, false);
