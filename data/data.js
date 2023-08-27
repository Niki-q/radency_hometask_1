export class Note {
    constructor(name, content, category, archived) {
        this.name = name
        this.created = new Date()
        this.content = content
        this.category = category
        this.archived = archived
        this.dates = get_dates(content)
    }
}

 const get_dates = function (content) {
    // Regular expression to match dates in the format "3/5/2021"
    const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/g;

    // Use the RegExp.exec() method to find all matches in the text
    const matches = [];
    let match;

    while ((match = datePattern.exec(content)) !== null) {
        matches.push(match[0]);
    }

    return matches;
}

export const Data = [
    new Note('Shoppingc list', 'Need to buy groceries and household essentials on 5/5/2021.', 'Task',false),
    new Note('The theory of evolution','Planning to read about Darwin\'s theory of natural selection tomorrow, on 5/6/2021.','Random Thought',false),
    new Note('New Feature','Implementing the \'undo\' feature in the app today, on 5/7/2021.','Idea',false),
    new Note('William Gaddis','Starting to read \'The Recognitions\' by William Gaddis on 5/8/2021.','Quote',false),
    new Note('Books','Returning borrowed books to the library on 5/9/2021.','Task',false),
    new Note('a1','','',true),
    new Note('a2', '','',true)
]
