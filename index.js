import {archiveNote, Data, getIconPath} from './data/data.js'

console.log('index.js')
const fillTD = function (text){
    let td = document.createElement("td");
    td.textContent = text
    return td
}
// Get the container element by its ID
const notesTable = document.getElementById("notesTable");

const fillTable = function (data, name){
    console.log('fill table')
    const thead = document.getElementById('thead')
    thead.textContent = name
    data.forEach(note => {
        const trNote = document.createElement("tr");
        // trNote.className = 'table-primary'
        const logoCell = document.createElement("td");
        const iconContainer = document.createElement("div")
        iconContainer.className = 'IconContainer'
        const logoIcon = document.createElement("img");
        logoIcon.src = note.getCategoryIconPath()
        logoIcon.className = 'CategoryIcon'

        iconContainer.appendChild(logoIcon);
        logoCell.appendChild(iconContainer);
        trNote.appendChild(logoCell);

        trNote.appendChild(fillTD(note.name))
        trNote.appendChild(fillTD(note.created))
        trNote.appendChild(fillTD(note.category))
        trNote.appendChild(fillTD(note.content))
        trNote.appendChild(fillTD(note.dates.join(', ')))

        const editButtonCell = document.createElement("td");
        const editButton = document.createElement("img");
        // editButton.className = "btn btn-info"; // Применяем классы Bootstrap
        // editButton.textContent = "Edit";
        editButton.src = getIconPath('Edit')
        editButton.className = 'ToolIcon'
        editButtonCell.appendChild(editButton);
        trNote.appendChild(editButtonCell);

        const archiveButtonCell = document.createElement("td");
        const archiveButton = document.createElement("img");
        // archiveButton.className = "btn btn-warning"; // Применяем классы Bootstrap
        // archiveButton.textContent = "Archive";
        archiveButton.src = getIconPath('Archive')
        archiveButton.className = 'ToolIcon ArchiveButton'
        archiveButtonCell.appendChild(archiveButton);
        trNote.appendChild(archiveButtonCell);

        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("img");
        // deleteButton.className = "btn btn-danger"; // Применяем классы Bootstrap
        // deleteButton.textContent = "Delete";
        deleteButton.src = getIconPath('Delete')
        deleteButton.className = 'ToolIcon'
        deleteButtonCell.appendChild(deleteButton);
        trNote.appendChild(deleteButtonCell);



        // listItem.textContent = `Name: ${obj.name}, Content: ${obj.content}, Dates: ${obj.dates}`;
        trNote.id = note.id
        notesTable.appendChild(trNote);
    });

}

const clearTable = function (){
    console.log('clear table')
// Проверить, существует ли такой элемент
    if (notesTable) {
        // Получить первый вложенный элемент
        const firstChild = notesTable.firstElementChild;

        // Удалить все остальные вложенные элементы
        while (notesTable.childElementCount > 1) {
            notesTable.removeChild(notesTable.lastElementChild);
        }
    }
}
document.addEventListener('DOMContentLoaded',()=>{
    refreshTable()
})

// const createButtonDiv = document.getElementById('createButton')
// const createBUtton = createButtonDiv.firstChild

const refreshTable = function (){
    clearTable()
    if (ArchiveView){
        fillTable(Data.filter((note) => {
            return note.archived
        }),'Archive Notes')
    }
    else {
        fillTable(Data.filter((note) => {
            return !note.archived
        }),'Actual Notes')
    }

    const ArchiveButtons = document.getElementsByClassName('ArchiveButton')

    for (const button of ArchiveButtons) {
        button.addEventListener('click', function() {
            // Получаем ID родителя (предполагается, что родитель — это tr элемент)
            const parentElement = this.closest('tr'); // Ищем ближайший родительский tr элемент
            if (parentElement) {
                const parentId = parentElement.id;
                archiveNote(parentId);
                // console.log(`Note with ID ${parentId} has been archived`);
                refreshTable()
            }
        });
    }

}

const ArchiveSwitch = document.getElementById('ArchiveSwitch')

let ArchiveView = false
ArchiveSwitch.addEventListener('click',() =>{
    ArchiveView = !ArchiveView
    refreshTable()
} )


