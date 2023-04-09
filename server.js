const { Server } = require("socket.io");
const io = new Server(3000, {
    cors: {
        origin: ["http://127.0.0.1:5500"]
    }
});

//every socket has a id, so we can create a hashmap that 
//will link names to socket id connections
//and reference this map to prepend user names to messages

const names = {};

io.on("connection", (socket) => {
  

  socket.on("new-user", (name) => {
    names[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  })

  socket.on("send-chat-message", (message) => {
    socket.broadcast.emit("chat-message", {
      name: names[socket.id],
      message
    });
  })

  socket.on("disconnect", () => {
    socket.broadcast.emit('user-disconnected', names[socket.id]);
    delete names[socket.id];
  })

});


