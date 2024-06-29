$(document).ready(function() {
    // Use .before() method to insert a new paragraph
    $('ul').before('<p>Just Updated</p>');
  
    // Use .prepend() method to add a plus symbol (+)
    $('li.hot').prepend('+ ');
  
    // Create a new <li> element and store it as a variable
    var newListItem = $('<li><em>gluten-free</em> soy sauce</li>');
  
    // Using .after() method to add the newListItem
    $('li').last().after(newListItem);
  });