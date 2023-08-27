import {Data} from './data/data.js'

console.log('index.js')

// Get the container element by its ID
const objectList = document.getElementById("objectList");

// Loop through the array of objects and create list items
Data.forEach(obj => {
    const listItem = document.createElement("li");
    listItem.textContent = `Name: ${obj.name}, Content: ${obj.content}, Dates: ${obj.dates}`;
    objectList.appendChild(listItem);
});

