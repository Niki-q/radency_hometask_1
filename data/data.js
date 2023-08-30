//  Constants

const  svgFolderPath  =  './data/svg/'


// Classes

export class Note {
    constructor(name, content, category, archived) {
        this.id = generateUniqueId()
        this.name = name
        this.created = formatDateToMonthDDYYYY(new Date())
        this.content = content
        this.category = category
        this.isArchived = archived

        const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;

        const matches = [];
        let match;

        while ((match = datePattern.exec(content)) !== null) {
            matches.push(match[0]);
        }
        this.dates = matches
    }
    getCategoryIconPath(){
        return getIconPath(this.category)
    }
    toTableTr(tr){
        const logoCell = document.createElement("td");
        const iconContainer = document.createElement("div")
        iconContainer.className = 'IconContainer'
        const logoIcon = document.createElement("img");
        logoIcon.src = this.getCategoryIconPath()
        logoIcon.className = 'CategoryIcon'

        const tdName = document.createElement("td");
        tdName.textContent = this.name
        const tdCreated = document.createElement("td");
        tdCreated.textContent = this.created
        const tdCategory = document.createElement("td");
        tdCategory.textContent = this.category
        const tdContent = document.createElement("td");
        tdContent.textContent = this.content
        const tdDates = document.createElement("td");
        tdDates.textContent = this.dates.join(', ')
        iconContainer.appendChild(logoIcon);
        logoCell.appendChild(iconContainer);

        tr.append(logoCell, tdName, tdCreated, tdCategory, tdContent, tdDates)
    }
}

class NoteStorage{
    constructor(list) {
        this.actual = list.filter(note => !note.isArchived)
        this.archived = list.filter(note => note.isArchived)

    }
    getAllNotes(){
        return this.actual.concat(this.archived)
    }
    getById(id){
        return this.getAllNotes().find(note => note.id===id)
    }
    addNote(name, content, category){
        this.actual.push(new Note(name, content, category, false))
    }
    archiveNote(id){
        const mustBeArchiveNote = this.getById(id)

        this.actual = this.actual.filter(note => note !== mustBeArchiveNote)
        this.archived.push(mustBeArchiveNote)
        mustBeArchiveNote.isArchived = true
    }
    unArchiveNote(id){
        const mustBeUnArchiveNote = this.getById(id)


        this.archived = this.archived.filter(note => note !== mustBeUnArchiveNote)
        this.actual.push(mustBeUnArchiveNote)
        mustBeUnArchiveNote.isArchived = false
    }
    getCategoryCounts(){
        let categories_archived =  this.archived.map(note => note.category)
        let categories_actual = this.actual.map(note => note.category)

        // Создайте объект для хранения результатов
        const categoryCounts = {};

        categories_actual.forEach(category => {
            // Инициализируйте счетчики для каждой категории
            categoryCounts[category] = [0, 0];
        });

        categories_actual.forEach(category => {
            categoryCounts[category][0]++; // Увеличьте счетчик для актуальных заметок
        });

        categories_archived.forEach(category => {
            categoryCounts[category][1]++; // Увеличьте счетчик для заметок в архиве
        });

        return categoryCounts
    }
}


function generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substr(2, 5);

    return timestamp + randomPart;
}

function formatDateToMonthDDYYYY(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

export const getIconPath = function (name){
    return `${svgFolderPath}${name}.svg`
}

const defaultNotesList = [
    new Note('Shoppingc list', 'Need to buy groceries and household essentials on 5/5/2021.', 'Task',false),
    new Note('The theory of evolution','Planning to read about Darwin\'s theory of natural selection tomorrow, on 5/6/2021.','Random Thought',false),
    new Note('New Feature','Implementing the \'undo\' feature in the app today, on 5/7/2021.','Idea',false),
    new Note('William Gaddis','Starting to read \'The Recognitions\' by William Gaddis on 5/8/2021.','Quote',false),
    new Note('Books','Returning borrowed books to the library on 5/9/2021.','Task',false),
    new Note('Dentist','I’m gonna have a dentist appointment on the 3/5/2021, I moved it from 5/5/2021','Task',true),
    new Note('a2', '','Quote',true)
]
export const Data = new NoteStorage(defaultNotesList)
