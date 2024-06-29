$(document).ready(function() {
    // Create backgroundColor variable
    var backgroundColor = $('#one').css('background-color');
    
    // Write the background color of the first list item into the page using append() after the <ul> element
    $('ul').after('<p>Background color of the first list item: ' + backgroundColor + '</p>');
    
    // Change all <li> elements, using .css() method to update css properties
    $('li').css({
        'background-color': '#c5a996',
        'border': '1px solid white',
        'color': 'black',
        'text-shadow': 'none',
        'font-family': 'Georgia'
    });
});
