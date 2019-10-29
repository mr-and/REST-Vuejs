function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var messageApi = Vue.resource('/message{/id}');


Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<v-layout justify-center>' +
            '<v-flex xs12 sm6>' +
                '<v-text-field v-on:keyup.enter="save" autofocus counter="50" clearable clear-icon="mdi-close" ' +
                'label="Новая заметка" v-model="text" />' +
            '</v-flex>' +
                '<v-btn color="#283593"  @click="save"> Сохранить </v-btn>' +
        '</v-layout>',
    methods: {
        save: function() {
            var message = { text: this.text };

            if (this.id) {
                messageApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                        this.text = ''
                        this.id = ''
                    })
                )
            } else {
                messageApi.save({}, message).then(result =>
                    result.json().then(data => {
                        this.messages.push(data);
                        this.text = ''
                    })
                )
            }
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template:
        '<v-layout align-center justify--space-around row fill-height>' +
        '<v-flex xs12 sm5 offset-sm3>' +
            '<v-list-tile>' +
                '<v-list-tile>' +
                    '<i><span class="blue-grey--text" >{{ message.id }}.&nbsp; </span></i> {{ message.text }}' +
                '</v-list-tile >' +
        '<v-spacer></v-spacer>' +
                '<v-list-tile-action>' +
                    '<v-btn @click="edit" icon><v-icon>mdi-pencil</v-icon></v-btn>' +
                '</v-list-tile-action>' +
                '<v-list-tile-action>' +
                    '<v-btn  @click="del" icon><v-icon>mdi-delete</v-icon></v-btn>' +
                '</v-list-tile-action>' +
            '</v-list-tile>' +
        '<v-divider></v-divider>' +
        '</v-flex>' +
        '</v-layout>',

    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            messageApi.remove({id: this.message.id}).then(result => {
                if (result.ok) {
                    this.messages.splice(this.messages.indexOf(this.message), 1)
                }
            })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null
        }
    },
    template:
        '<v-layout align-space-around justify-start column>' +
            '<message-form :messages="messages" :messageAttr="message" />' +
            '<message-row v-for="message in messages" :key="message.id" :message="message" ' +
            ':editMethod="editMethod" :messages="messages" />' +
        '</v-layout>',

    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});


var app = new Vue({
    el: '#app',
    template: '<v-app dark>' +
        '<v-toolbar color="#283593" dense fixed  app> <span white--text>TodoList</span></v-toolbar>' +
        '<v-content>' +
            '<v-container>' +
                    '<messages-list :messages="messages" />' +
            '</v-container>' +
        '</v-content>' +
        '</v-app>',

    created: function() {
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    },

    data: {
        messages: []
    }
});
