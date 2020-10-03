const app = Vue.createApp({
    template: `
        <top-header></top-header>
        <main-display></main-display>
    `
});

app.component('top-header', {
    template: `
        <div class="header">todos</div>
    `
});

app.component('main-display', {
    data() {
        return {
            todos: [
                {id: 1, text: 'Learn HTML'},
                {id: 2, text: 'Learn CSS'},
                {id: 3, text: 'Learn JS'},
                {id: 4, text: 'Learn Vue.js'},
                {id: 5, text: 'Do something great!'},
            ]
        }
    },
    template: `
        <div class="main-display">
            <todo 
                v-for="todo in todos"
                :key="todo.id"
                :id="todo.id"
                :text="todo.text"
                ></todo>
            <add-todo @addTodo="addTodo"></add-todo>
        </div>
    `,
    methods: {
        addTodo(ev, text) {
            this.todos.push({id: this.todos.length + 1, text: text})
        }
    }
});

app.component('todo', {
    props: ['text', 'id'],
    template: `
        <div class="todo-item">
            <input type="checkbox" :name="id" :id="id" class="todo-item__done-checkbox">
            <label :for="id" class="todo-item__text">{{text}}{{key}}</label>
            <input type="button" class="todo-item__delete-btn" value="Delete">
        </div>
    `
});

app.component('add-todo', {
    data() {
        return {
            text: 'New todo'
        }
    },
    template: `
        <div class="add-todo">
            <input type="text" class="add-todo__text-input" v-model="text">
            <button @click="$emit('addTodo', $event, this.text)">Add</button>
        </div>
    `
});

app.mount('#app');