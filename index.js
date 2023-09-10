import {Data, getIconPath} from './data/data.js'

const notesTable = document.getElementById("notesTable");

const createHtmlTdToolButton = function (src, classname){
    const buttonCell = document.createElement('td')
    const button = document.createElement('img')
    button.src = src
    button.className = `ToolIcon ${classname}`
    buttonCell.appendChild(button)
    return buttonCell
}

const createHtmlTdCategoryIcon = function (src){
    const logoCell = document.createElement("td");
    const iconContainer = document.createElement("div")
    iconContainer.className = 'IconContainer'
    const logoIcon = document.createElement("img");
    logoIcon.src = src
    logoIcon.className = 'CategoryIcon'
    iconContainer.appendChild(logoIcon);
    logoCell.appendChild(iconContainer);
    return logoCell
}

const fillNotesTable = function (data, name){
    const thead = document.getElementById('thead')
    thead.textContent = name
    data.forEach(note => {
        const trNote = document.createElement("tr");
        trNote.appendChild(createHtmlTdCategoryIcon(note.getCategoryIconPath()))

        note.toTableTr(trNote)

        trNote.appendChild(createHtmlTdToolButton(getIconPath('Edit'), 'EditButton'));

        let direction = ArchiveView ? 'Up' : 'Down';
        trNote.appendChild(createHtmlTdToolButton(getIconPath(`Archive ${direction}`), 'ArchiveButton'))
        const ArchiveViewButton = document.getElementById('ArchiveSwitch')
        ArchiveViewButton.src =getIconPath(`Archive ${direction} White`)

        trNote.appendChild(createHtmlTdToolButton(getIconPath('Delete'), 'DeleteButton'));

        trNote.id = note.id
        notesTable.appendChild(trNote);
    });

}

const categoriesTable = document.getElementById('categoriesTable')

const fillCategoriesTable = function (){
    const categoryResults = Data.getCategoryCounts()
    for (const key in categoryResults){
        const [active, archived] = categoryResults[key]

        const trCategory = document.createElement("tr");

        const tdCatIcon = createHtmlTdCategoryIcon(getIconPath(key))

        const tdCatName = document.createElement("td");
        tdCatName.textContent = key

        const tdCatActive = document.createElement("td");
        tdCatActive.textContent = active

        const tdCatArchived = document.createElement("td");
        tdCatArchived.textContent = archived

        trCategory.append(tdCatIcon, tdCatName,tdCatActive,tdCatArchived)
        categoriesTable.appendChild(trCategory)
    }
}

const clearTable = function (table_body){
    if (table_body) {
        while (table_body.childElementCount > 1) {
            table_body.removeChild(table_body.lastElementChild);
        }
    }
}

const refreshTable = function (){
    clearTable(notesTable)
    fillNotesTable(ArchiveView ? Data.archived : Data.actual, ArchiveView ? 'Archive Notes' : 'Actual Notes')
    clearTable(categoriesTable)
    fillCategoriesTable()

    // refresh listeners to tool buttons
    const byClickButtons = function (buttons_class, callback){
        const buttons = document.getElementsByClassName(buttons_class)
        for (const button of buttons){
            button.addEventListener('click', (ev) => {
                const parentElement = ev.target.closest('tr');
                if (parentElement) {
                    const parentId = parentElement.id;
                    const Note = Data.getById(parentId)
                    if (Note) {
                        callback(parentId)
                    }
                }
            })
        }
    }

    byClickButtons('ArchiveButton', (parent_id)=>{
        Data.getById(parent_id).isArchived ? Data.unArchiveNote(parent_id) : Data.archiveNote(parent_id)
        refreshTable()
    })
    byClickButtons('EditButton', (parent_id)=>{
        openModal('Edit Note', 'Save changes', parent_id)
    })

    byClickButtons('DeleteButton', (parent_id) => {
        Data.deleteNote(parent_id)
        refreshTable()
        console.log(`Note with id='${parent_id}' has been deleted`)
    })

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
