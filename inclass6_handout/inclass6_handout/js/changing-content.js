$(document).ready(function() {
    // Use .text() method to replace items containing pine with almonds
    $('li:contains("pine")').text('almonds');
  
    // Select all list items whose class attribute contains the word hot, and update the content with <em> tag
    $('li.hot').each(function() {
        var content = $(this).html();
        $(this).html('<em>' + content + '</em>');
      });
  
    // Select the <li> element that has an id attribute whose value is one, then remove it
    $('#one').remove();
  });
  