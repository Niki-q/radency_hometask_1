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
        editButton.className = 'ToolIcon EditButton'
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
        deleteButton.className = 'ToolIcon DeleteButton'
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

    // refresh listeners to tool buttons

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
    const EditButtons = document.getElementsByClassName('EditButton')

    for (const button of EditButtons) {
        button.addEventListener('click', function() {
            const parentElement = this.closest('tr');
            if (parentElement) {
                const parentId = parentElement.id;
                openModal('Edit Note', 'Save changes', parentId)
                // refreshTable()
            }
        });
    }

    const DeleteButtons = document.getElementsByClassName('DeleteButton')

    for (const button of DeleteButtons) {
        button.addEventListener('click', function() {
            const parentElement = this.closest('tr');
            if (parentElement) {
                const parentId = parentElement.id;
                Data.deleteNote(parentId)
                refreshTable()
                console.log(`Note with id='${parentId}' has been deleted`)
            }
        });
    }
}



// Listeners


// Archive functional

const ArchiveSwitch = document.getElementById('ArchiveSwitch')

let ArchiveView = false
ArchiveSwitch.addEventListener('click',() =>{
    ArchiveView = !ArchiveView
    refreshTable()
} )

// Modal window

const modal = document.getElementById('myModal');
const createButton = document.querySelector('#createButton');
const categoryCounts = Data.getCategoryCounts()

const taskForm = document.getElementById('taskForm');
const taskFormInputNodes = taskForm.getElementsByTagName('input')
const taskFormSelectNode = document.getElementById('category')

createButton.addEventListener('click', function() {
    openModal('Add new Note', 'Create', false)
});

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    if (taskForm.attributes.mode.value === 'Create'){
        Data.addNote(taskFormInputNodes.name.value, taskFormInputNodes.content.value, taskFormSelectNode.value)
        console.log(`Note with name='${taskFormInputNodes.name.value}' has been added`)
    }
    else{
        Data.editNote(taskForm.attributes.edit_id.value, {
            name:taskFormInputNodes.name.value,
            content:taskFormInputNodes.content.value,
            category:taskFormSelectNode.value
        })
        console.log('Note with id='+taskForm.attributes.edit_id.value+' has been edited')
    }
    console.log(Data.getAllNotes())
    refreshTable()
    closeModal()
});

const openModal = function (title, button_text, edit){
    if (edit){
        taskForm.reset()
        taskForm.setAttribute('mode', 'Edit')
        taskForm.setAttribute('edit_id', edit)

        const editNote = Data.getById(edit)
        taskFormInputNodes.name.value = editNote.name
        taskFormInputNodes.content.value = editNote.content
        taskFormSelectNode.value = editNote.category

    }
    else{
        taskForm.setAttribute('mode', 'Create')
    }

    const taskFormTitle = document.getElementById('taskFormTitle')
    const taskFormButton = document.getElementById('taskFormButton')
    taskFormTitle.textContent = title
    taskFormButton.textContent = button_text
    modal.style.display = 'block';
}

const closeModal = function (){
    modal.style.display = 'none';

}

const closeButton = modal.querySelector('.close');
closeButton.addEventListener('click', function() {
    closeModal()
});

window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal()
    }
});


document.addEventListener('DOMContentLoaded',()=>{
    refreshTable()

    const categoryOptions = Object.keys(categoryCounts)

    categoryOptions.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText; // Установите значение (value) для отправки на сервер
        option.text = optionText;  // Установите текст, отображаемый в списке
        taskFormSelectNode.appendChild(option);
    });

})
