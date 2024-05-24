//socket io set up
export default function(io) {
  //listens for connections
  io.sockets.on('connection', function (socket) {
    console.log("try");
    try {
      /**
       * create or joins a room
       */
      socket.on('create or join', function (room, userId) {
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
      });
      //broadcasts chat messages
      socket.on('chat', function (room, userId, chatText) {
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });
      //listens for chat to disconnect and logs it
      socket.on('disconnect', function(){
        console.log('someone disconnected');
      });
    } catch (e) {
    }
  });
}
