var exampleVM = new Vue({
    el: '#app',
    data: {
        message: 'hello vue.js lalaaa',
        mess2: 'hello',
        greeting: false,
        a: 2,
        b: 32,
        newTodo: '',
        todos: [
            {text: 'learn javascript'},
            {text: 'learn vue.js'},
            {text: 'build something awesome'}
        ],
        firstName: 'yilin',
        lastName: 'lu',
        fullName: 'yilin lu'
    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        },
        addTodo: function () {
            var text = this.newTodo.trim();
            if (text) {
                this.todos.push({text: text});
                this.newTodo = ''
            }
        },
        removeTodo: function (index) {
            this.todos.splice(index, 1)
        }
    },
    computed: {
        c : function () {
            return this.b +1;
        },
        fullName: {
            get: function () {
                return this.firstName + ' ' + this.lastName
            },
            set: function (newName) {
                var name = newName.split(' ')
                this.firstName = name[0]
                this.lastName = name[name.length - 1]
            }
        }
    }
});


