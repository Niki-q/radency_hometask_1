import {Data, getIconPath} from './data/data.js'

const notesTable = document.getElementById("notesTable");

const fillTable = function (data, name){
    const thead = document.getElementById('thead')
    thead.textContent = name
    data.forEach(note => {
        const trNote = document.createElement("tr");

        note.toTableTr(trNote)

        const editButtonCell = document.createElement("td");
        const editButton = document.createElement("img");
        editButton.src = getIconPath('Edit')
        editButton.className = 'ToolIcon'
        editButtonCell.appendChild(editButton);
        trNote.appendChild(editButtonCell);

        const archiveButtonCell = document.createElement("td");
        const archiveButton = document.createElement("img");
        const ArchiveViewButton = document.getElementById('ArchiveSwitch')
        if (ArchiveView){
            archiveButton.src = getIconPath('Archive Up')
            ArchiveViewButton.src =getIconPath('Archive Up White')
        }
        else {
            archiveButton.src = getIconPath('Archive Down')
            ArchiveViewButton.src =getIconPath('Archive Down White')
        }
        archiveButton.className = 'ToolIcon ArchiveButton'
        archiveButtonCell.appendChild(archiveButton);
        trNote.appendChild(archiveButtonCell);

        const deleteButtonCell = document.createElement("td");
        const deleteButton = document.createElement("img");
        deleteButton.src = getIconPath('Delete')
        deleteButton.className = 'ToolIcon'
        deleteButtonCell.appendChild(deleteButton);
        trNote.appendChild(deleteButtonCell);


        trNote.id = note.id
        notesTable.appendChild(trNote);
    });

}

const clearTable = function (){
    if (notesTable) {
        while (notesTable.childElementCount > 1) {
            notesTable.removeChild(notesTable.lastElementChild);
        }
    }
}

const refreshTable = function (){
    clearTable()
    if (ArchiveView){
        fillTable(Data.archived,'Archive Notes')
    }
    else {
        fillTable(Data.actual,'Actual Notes')
    }

    // refresh listeners to buttons

    const ArchiveButtons = document.getElementsByClassName('ArchiveButton')

    for (const button of ArchiveButtons) {
        button.addEventListener('click', function() {
            const parentElement = this.closest('tr');
            if (parentElement) {
                const parentId = parentElement.id;
                if (Data.getById(parentId).isArchived)
                    Data.unArchiveNote(parentId)
                else
                    Data.archiveNote(parentId)
                refreshTable()
            }
        });
    }

}



// Listeners

const ArchiveSwitch = document.getElementById('ArchiveSwitch')

let ArchiveView = false
ArchiveSwitch.addEventListener('click',() =>{
    ArchiveView = !ArchiveView
    refreshTable()
} )


document.addEventListener('DOMContentLoaded',()=>{
    refreshTable()
})
