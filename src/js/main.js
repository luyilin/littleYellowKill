// var vue = require('vue');
// vue.module('myModule', []);
var vue = require('../../node_modules/vue');

var exampleVM = new vue({
    el: '#app',
    data: {
        message: 'hello vue.js lalaaaaaa',
        mess2: 'hello',
        greeting: true,
        a: 2,
        b: 32,
        newTodo: '',
        todos: [
            {text: 'learn javascript'},
            {text: 'learn vue.js'},
            {text: 'build something awesome'}
        ]
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        },
        addTodo: function () {
            var text = this.newTodo.trim();
            if (text) {
                this.todos.push({text: text})
                this.newTodo = ''
            }
        },
        removeTodo: function (index) {
            this.todos.splice(index, 1)
        }
    }
});

require('../css/style.css');
