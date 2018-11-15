import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import uuid from 'uuid';
import moment from 'moment';

import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

const socket = io('/');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            text: '',
            name: ''
        };
    }
    //Nasłuchiwanie na zdarzenia z backendu
    componentDidMount() {
        socket.on('message', message => this.messageReceive(message));
        socket.on('update', ({users}) => this.chatUpdate(users));
        socket.on('deleteMessage', id => this.deleteMessage(id));
    }
    //Metody
    messageReceive(message) { // Metoda odbiera wiadomość i aktualizuje jej stan
        const messages = [message, ...this.state.messages];
        this.setState({messages});
    }

    chatUpdate(users) { //Serwer każdorazowo wysyła tablicę z aktualną listą userów.
        this.setState({users});
    }

    handleMessageSubmit(message) { //obsługa wysyłania wiadomosci do servera
        const messages = [message, ...this.state.messages];
        this.setState({messages});
        socket.emit('message', message);
    }

    handleUserSubmit(name) {    // tworzenie nowego usera czatu
        this.setState({name});
        socket.emit('join', name);
    }
    // Delete message - potrzebne id wiadomosci + user - + zrobić kontroler w backendzie
    // Mogę to robić jako callback- przesłać w emiter zaktualizowany stan wiadomości kliento do pozostałych,
    // choc to rozwiązanie będzie obciażać serwer przy bardzo długiej liczbie wiadomosci w stanie.  
    //Lepiej przekazać do emitera id wiadomości która jest usuwana i obsłuzyc ją metodą
    //Muszę stworzyć osobną metodę dla emitera, nie mogę użyć deleteMessage bo się chyba zapętli program.
    //ver client
    handleDeleteMessage(id) {  
        const actualMessages = this.state.messages.filter(message => message.id !== id);
        this.setState({messages: actualMessages});
        socket.emit('deleteMessage', id);
    }
    // ver do backendu
    deleteMessage(id) {
        const actualMessages = this.state.messages.filter(message => message.id !== id);
        this.setState({messages: actualMessages});
    }
    //render
    render() {
        return this.state.name !== '' ? this.renderLayout() : this.renderUserForm();
    }

    renderUserForm() {
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
    }

    renderLayout() {
        return (
           <div className={styles.App}>
             <div className={styles.AppHeader}>
               <div className={styles.AppTitle}>
                 ChatApp
               </div>
               <div className={styles.AppRoom}>
                 App room
               </div>
             </div>
             <div className={styles.AppBody}>
               <UsersList
                 users={this.state.users}                 
               />
               <div className={styles.MessageWrapper}>
                 <MessageList
                   messages={this.state.messages}
                   nameClient={this.state.name}
                   deleteMessage={this.handleDeleteMessage.bind(this)}
                 />
                 <MessageForm
                   onMessageSubmit={message => this.handleMessageSubmit(message)}
                   name={this.state.name}
                 />
               </div>
             </div>
           </div>
        );
     }

};

export default hot(module)(App);
/*
Problemem było przekazanie własciwości w złym miejscu metody rendr. Zamiast w messageList to zostały one przekazane w messageList.
Muszę zwracać większą uwagę.

 */