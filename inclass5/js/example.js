// ADD NEW ITEM TO END OF LIST
const list = document.querySelector('ul');
const newItemEnd = document.createElement('li');
newItemEnd.textContent = 'cream';
list.appendChild(newItemEnd);

// ADD NEW ITEM START OF LIST
const newItemStart = document.createElement('li');
newItemStart.textContent = 'kale';
list.insertBefore(newItemStart, list.firstChild);

// ADD A CLASS OF COOL TO ALL LIST ITEMS
const listItems = list.querySelectorAll('li');
listItems.forEach(item => item.classList.add('cool'));

// ADD NUMBER OF ITEMS IN THE LIST TO THE HEADING
const itemCount = listItems.length;
const heading = document.querySelector('h2');
const span = document.createElement('span');
span.textContent = `${itemCount}`;
heading.appendChild(span);
  
  
