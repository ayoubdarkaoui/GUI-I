document.addEventListener("DOMContentLoaded", function() {
    // Step 1: Add new item "cream" to end of list
    const list = document.querySelector('ul');
    const newItemEnd = document.createElement('li');
    newItemEnd.textContent = 'cream';
    list.appendChild(newItemEnd);
  
    // Step 2: Add new item "kale" to start of list
    const newItemStart = document.createElement('li');
    newItemStart.textContent = 'kale';
    list.insertBefore(newItemStart, list.firstChild);
  
    // Step 3: Add a class of "cool" to all list items
    const listItems = list.querySelectorAll('li');
    listItems.forEach(item => item.classList.add('cool'));
  
    // Step 4: Add number of items in the list to the heading
    const itemCount = listItems.length;
    const heading = document.querySelector('h2');
    const span = document.createElement('span');
    span.textContent = `${itemCount}`;
    heading.appendChild(span);
  });
  