const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const UsersService = require('./UsersService');

const usersService = new UsersService();

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

//Nasłuchiwanie na dołączenie usera do czatu i wykonywane akcje.
io.on('connection', (socket) => {
    socket.on('join', (name) => {
        usersService.addUser({
            id: socket.id,
            name
        });
        io.emit('update', {
            users: usersService.getAllUsers()
        })
    })
})

//Funckcja która wykonuje się po utraceniu połączenia klienta z serwerem.(wyjście z app)
io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      usersService.removeUser(socket.id);
      socket.broadcast.emit('update', {
        users: usersService.getAllUsers()
      });
    });
});

// obsługa wysyłania wiadomości do użytkowników czatu
io.on('connection', (socket)=>{
    socket.on('message', (message)=>{
        const {name} = usersService.getUserById(socket.id);
        socket.broadcast.emit('message', {
            text: message.text,
            from: name,
            id: message.id,
            date: message.date
        })
    });
});
// Obsługa usuwania wiadomosci po otrzymaniu id
io.on('connection', (socket)=>{
    socket.on('deleteMessageSocket', (id)=>{        
        socket.broadcast.emit('deleteMessageSocket', {            
            id: id            
        })
    });
});

server.listen(3001, () => { //3000 prędzej
    console.log('listening on *:3001');
});