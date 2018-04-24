Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        tasks: []
    }
});

Vue.component('hover-card', {
    mounted: function() {
        $(this.$el).hoverCard();
    },
    template: `
        <div class="hover-card">
            <a tabindex="-1" href="javascript:void(0);">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a>
            <div class="hover-detail slide-right bottom-positioned">
                <slot></slot>
            </div>
        </div>`
});


Vue.directive('focus', {
    inserted: function(el) {
        el.focus()
    }
});

Vue.filter('truncate', function(str, length) {
    length = length || 30;

    if (str.length <= length) {
        return str;
    }

    str = str.slice(0, length);

    return str + '...';
});

Vue.filter('formatDate', function(date) {
    date = new Date(date);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
});

window.vm = new Vue({
    el: '#app',
    store,
    data: function() {
        return {
            heading: 'To Do List',
            tasks: [],
            newTask: null,
            taskModel: {},
            searchValue: null,
            taskLoaded: false
        }
    },
    created: function() {
        this.getTasks();
    },
    methods: {
        getTasks() {
            var self = this;
            api.getList(tasks => {
                console.log(self === this);
                this.taskLoaded = true;
                self.tasks = tasks;
            });
        },
        addTask: function() {
            var self = this;
            var task = {
                task: self.newTask
            };

            api.create(task, function(id) {
                api.get(id, function(task) {
                    self.tasks.push(task);
                    self.newTask = null;
                })
            });
        },
        deleteTask: function(index) {
            var task = this.tasks[index];
            api.delete(task.id, () => this.tasks.splice(index, 1));
        },
        editTask: function(task) {
            var self = this;
            self.taskModel = task;
        },
        saveTask: function() {
            var self = this;
            api.update(self.taskModel, function() {
                var index = self.tasks.findIndex(i => i.id === self.taskModel.id);
                self.tasks[index] = self.taskModel;
                self.taskModel = {};
            });
        },
        completeTask: function(task) {
            var self = this;
            task.completed = !task.completed;
            api.update(task, function() {});
        }
    },
    computed: {
        filteredTasks: function() {
            var self = this

            if (!self.searchValue) {
                return self.tasks;
            }

            const searchable = self.searchValue.toLowerCase();
            return self.tasks.filter(value => value.task.toLowerCase().includes(searchable));
        }
    }
});
