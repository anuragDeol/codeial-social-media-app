// observer or server - listens to the subscribers or clients (server side)

module.exports.chatSockets = function(socketServer){
   // let io = require('socket.io')(socketServer);
    let io = require('socket.io')(socketServer, {
        cors: {
            origin:'http://localhost:8000',
            methods: ['GET','POST']
        }
    });

    io.on('connection', function(socket){
        console.log('new connection received', socket.id);  // socket is object with lot of properties, one of them is 'id'

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        // detects event sent by the client
        socket.on('join_room', function(data){
            console.log('joining request received', data);

            // join socket to the chatroom
            socket.join(data.chatroom);

            // emit an event here, it tells all the subscribers that a new subscriber has joined the chatroom
            io.in(data.chatroom).emit('user_joined', data);
        });

        // detect send_message and broadcast to everyone in the room
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}



// module.exports.chatSockets = function(socketServer) {
//     let io = require('socket.io')(socketServer);


//     io.sockets.on('connection', function(socket) {
//         console.log('new connection received', socket.id);

//         socket.on('disconnect', function() {
//             console.log('socket disconnected');
//         });


//         // detects event sent by the client
//         socket.on('join_room', function(data) {
//             console.log('joining request received.', data);

//             // join socket to the chatroom
//             socket.join(data.chatroom);

//             // emit an event here, it tells all the subscribers that a new subscriber has joined the chatroom
//             io.in(data.chatroom).emit('user_joined', data);
//         });


//         socket.on('send_message', function(data) {
//             io.in(data.chatroom).emit('receive_message', data);
//         });


//     });
// }
