$(document).ready(function() {
    // Find the third list item and remove 'hot' class from that element
    $('#three').removeClass('hot');
  
    // Replace 'hot' class a new class name called 'favorite'
    $('li.hot').addClass('favorite');
  });
  