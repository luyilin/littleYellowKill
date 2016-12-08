var Vue = require('vue');
require('../tpl/component.html'); // html内引用图片需要
require('../css/style.css');

if('a') {
    require.ensure([], function(require) {
        require('./main.js');
        // require('../../test/foldcontent');
    });
}

// $('.example1').css('color','red');

var vm = new Vue({
    el: '#app-2',
    data: {
        message: 'hello app',
        mess2: 'hello mess'
    }
});

// 注册全局组件 props
Vue.component('my-component', {
    props: ['message'],
    template: '<div>a custom component {{message}}</div>'
});
// 注册
new Vue({
    el: '#example'
});
// 创建根实例

// 注册局部组件,也适用于其他可注册的功能,如指令
var componentChild = {
    template: '<div>a child component</div>'
};

new Vue({
    el: '#parent-component',
    components: {
        'child-component': componentChild
    }
});

// 使用组件时,data必须是函数
var data = {counter : 0};

Vue.component('click-component', {
    template: '<button v-on:click="counter++">{{counter}}</button>',
    data: function () {
        return data; // 这种情况三个按钮共用一个data,因此每次增加counter影响整个组件
    }
});

new Vue({
    el: '#click-wrap'
});

// click 改进

Vue.component('click-btn', {
    template: '<button v-on:click="counter++">{{counter}}</button>',
    data: function () {
        return {
            counter: 0
        }
    }
});

new Vue({
    el: '#click-btn-wrap'
});

// 父子组件通信:props down, events up 父组件通过 props 向下传递数据给子组件, 子组件通过 events 给父组件发送消息

// 动态props
new Vue({
    el: "#input-wrap",
    data: {
        msg: 'aa'
    },
    components: {
        msgComponent: {
            props: ['myMessage'],
            template: '<span>{{myMessage}}</span>'
        }
    }
});

// 子组件-events-父组件
// 每个Vue实例都实现了事件接口 Events interface 使用 $on(eventName) 监听事件 $emit(eventName)触发事件
Vue.component('event-component', {
    template: '<button v-on:click="increment">{{counter}}</button>',
    data: function () {
        return {
            counter: 0
        }
    },
    methods: {
        increment: function () {
            this.counter ++;
            this.$emit('increment')
            // 子组件和它外部完全解耦,它所做的只是触发一个父组件关心的内部事件。
        }
    }
});
new Vue({
    el: '#event-wrap',
    data: {
        total: 0
    },
    methods: {
        incrementTotal: function () {
            this.total ++
        }
    }
});

// 表单输入组件
Vue.component('my-input', {
    template: '<div><label v-bind:for="randomId">{{label}}</label><input type="text" v-bind:id="randomId" v-bind:value="value" v-on:input="onInput"></div>',
    props: ['value', 'label'],
    data: function () {
        return {
            randomId: 'input-' + Math.random()
        }
    },
    methods: {
        onInput: function (event) {
            this.$emit('input', event.target.value); // 父组件获取子组件 input value 值的变化
        }
    }
});
new Vue({
    el: '#my-input-wrap',
    data: {
        message: 'hello input'
    }
});

// 动态组件 多个组件共用一个挂载点, 可以动态切换
new Vue({
    el: '#multi-component-wrap',
    components: {
        home: {
            template: '<p>hello home</p>',
        },
        school: {
            template: '<p>hello school</p>'
        }
    },
    data: {
        currentView: 'home' // 父子通信 父组件不能直接接收home
    }
});
