const app = Vue.createApp({

    created() {
        const storedTodos = localStorage.getItem('vue-todos');
        if (!storedTodos) {
            localStorage.setItem('vue-todos', JSON.stringify(this.$data.todos));
        }
        this.$data.todos = JSON.parse(localStorage.getItem('vue-todos'));
    },

    template: `
        <top-header></top-header>
        <main-display 
            v-if="currentMainBlock==='main-display'"
            :todos="todos"
            @deleteTodo="deleteTodo"
            @todoStateChanged="todoStateChanged"
            @addTodo="addTodo"
        ></main-display>
        <done-todo-display
            v-if="currentMainBlock==='done-todo-display'"
            @todoStateChanged="todoStateChanged"
            :todos="todos"
        ></done-todo-display>
        <bottom-selector @onActiveClick=onActiveClick @onDoneClick="onDoneClick"></bottom-selector>
    `,

    data() {
        return {
            currentMainBlock: 'main-display',
            todos: [
                { id: 1, text: 'Learn HTML', isDone: false },
                { id: 2, text: 'Learn CSS', isDone: false },
                { id: 3, text: 'Learn JS', isDone: false },
                { id: 4, text: 'Learn Vue.js', isDone: false },
                { id: 5, text: 'Do something great!', isDone: false }
            ]
        }
    },

    methods: {
        onActiveClick() {
            this.currentMainBlock = 'main-display'
        },
        onDoneClick() {
            this.currentMainBlock = 'done-todo-display'
        },
        deleteTodo(ev, id) {
            this.todos = this.todos.filter(el => {
                return el.id != id
            })
            this.saveData();
        },
        todoStateChanged(ev, id) {
            const changedTodo = this.todos.find(el => {
                return el.id == id;
            });
            if (ev.target.checked) {
                changedTodo.isDone = true;
            } else {
                changedTodo.isDone = false;
            }
            this.saveData();
        },
        addTodo(ev, text) {
            let ids = [];
            this.todos.forEach(todo => {
                ids.push(todo.id)
            });
            const newId = Math.max.apply(null, ids) + 1;
            this.todos.push({
                id: newId,
                text: text
            })
            this.saveData();
        },
        saveData() {
            localStorage.setItem('vue-todos', JSON.stringify(this.$data.todos));
        }
    }
});

app.component('top-header', {
    template: `
        <div class="header">todos</div>
    `
});

app.component('main-display', {
    template: `
        <div class="main-display">
            <template v-for="todo in todos">
                <todo 
                    v-if="!todo.isDone"
                    :key="todo.id"
                    :id="todo.id"
                    :text="todo.text"
                    :isRemovable="true"
                    @deleteTodo="$emit('deleteTodo', $event, todo.id)"
                    @todoStateChanged="$emit('todoStateChanged', $event, todo.id)"
                    ></todo>
                </template>
            <add-todo @addTodo="addTodo"></add-todo>
        </div>
    `,
    props: ['todos'],
    methods: {
        addTodo(ev, text) {
            this.$emit('addTodo', ev, text);
        }
    }
});

app.component('done-todo-display', {
    template: `
        <div class="main-display">
            <template v-for="todo in todos">
                <todo 
                    v-if="todo.isDone"
                    :key="todo.id"
                    :id="todo.id"
                    :text="todo.text"
                    :isDone="todo.isDone"
                    :isRemovable="false"
                    @todoStateChanged="$emit('todoStateChanged', $event, todo.id)"
                ></todo>
            </template>
        </div>
    `,
    props: ['todos']
});

app.component('todo', {
    template: `
        <div class="todo-item">
            <input @click="$emit('todoStateChanged', $event, id)" type="checkbox" :name="id" :id="id" v-model="isDone" class="todo-item__done-checkbox">
            <label :for="id" class="todo-item__text">{{id}}. {{text}}</label>
            <input v-if="isRemovable" @click="$emit('deleteTodo', $event, id)" type="button" class="todo-item__delete-btn" value="Delete">
        </div>
    `,
    props: ['text', 'id', 'isDone', 'isRemovable'],
});

app.component('add-todo', {
    template: `
        <div class="add-todo">
            <input type="text" class="add-todo__text-input" v-model="text">
            <button @click="$emit('addTodo', $event, this.text)">Add</button>
        </div>
    `,
    data() {
        return {
            text: 'New todo'
        }
    },
});

app.component('bottom-selector', {
    template: `
        <div class="bottom-selector">
            <input @click="onActiveClick" class="bottom-selector__btn" :class="btnsClassList.activeBtnClassList" type="button" value="Active">
            <input @click="onDoneClick" class="bottom-selector__btn" :class="btnsClassList.doneBtnClassList" type="button" value="Done">
        </div>
    `,
    data() {
        return {
            btnsClassList: {
                activeBtnClassList: {
                    active: true,
                },
                doneBtnClassList: {
                    active: false
                }
            }
        }
    },
    methods: {
        onActiveClick() {
            this.resetAllActiveBtn();
            this.btnsClassList.activeBtnClassList.active = true;
            this.$emit('onActiveClick');
        },
        onDoneClick() {
            this.resetAllActiveBtn();
            this.btnsClassList.doneBtnClassList.active = true;
            this.$emit('onDoneClick');
        },
        resetAllActiveBtn() {
            for (const [key, value] of Object.entries(this.btnsClassList)) {
                value.active = false;
            }
        }
    }
});

app.mount('#app');
