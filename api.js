const delay = 500;
const key = "todos";
const read = () => JSON.parse(localStorage.getItem(key) || "[]");
const write = (items) => localStorage.setItem(key, JSON.stringify(items));

const copy = (source, target) => {
    target.task = source.task;
    target.completed = !!source.completed;
    target.dateAdded = source.dateAdded || new Date();
    return target;
};

const getNextId = (items) => {
    return (Math.max.apply(Math, items.map(i => i.id)) || 0) + 1;
};

const seedData = () => {
    write([{
            id: 14,
            task: "Learn more about HTML, CSS and Javascript",
            completed: false,
            dateAdded: new Date("2016-01-4")
        },
        {
            id: 15,
            task: "Study for test",
            completed: false,
            dateAdded: new Date("2013-06-1")
        },
        {
            id: 16,
            task: "Have some Fun",
            completed: false,
            dateAdded: new Date("2014-03-3")
        },
        {
            id: 17,
            task: "Buy a puppy",
            completed: false,
            dateAdded: new Date("2011-03-6")
        },
        {
            id: 22,
            task: "Eat pizza",
            completed: false,
            dateAdded: new Date("2012-03-4")
        },
        {
            id: 23,
            task: "Go for a run",
            completed: true,
            dateAdded: new Date("2013-04-3")
        }
    ]);
};

const init = () => {
    const items = read();

    if (!items || !items.length) {
        seedData();
    }
};

init();

window.api = {};

api.getList = (callback) => {
    setTimeout(() => {
        callback(read());
    }, delay);
};

api.get = (id, callback) => {
    setTimeout(() => {
        const items = read();
        const item = items.find(i => i.id === id);
        callback(item);
    }, delay);
};

api.update = (data, callback) => {
    setTimeout(() => {
        const items = read();
        const item = items.find(i => i.id === data.id);
        copy(data, item);
        write(items);
        callback(true);
    }, delay);
};

api.create = (data, callback) => {
    setTimeout(() => {
        const items = read();
        const id = getNextId(items);
        const item = copy(data, {
            id
        });
        items.push(item);
        write(items);
        callback(id);
    }, delay);
};

api.delete = (id, callback) => {
    setTimeout(() => {
        const items = read();
        const index = items.findIndex(i => i.id === id);

        if (index === -1) {
            callback(false);
        }

        items.splice(index, 1);
        write(items);
        callback(true);
    }, delay);
};
