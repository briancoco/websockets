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
const rooms = {};

io.on("connection", (socket) => {
  

  socket.on("new-user", (data) => {
    names[socket.id] = data.name;
    rooms[socket.id] = data.room;
    socket.join(data.room);
    socket.to(data.room).emit('user-connected', data.name);
  })

  socket.on("send-chat-message", (message) => {
    const room = rooms[socket.id];
    socket.to(room).emit("chat-message", {
      name: names[socket.id],
      message
    });
  })

  socket.on("disconnect", () => {
    const room = rooms[socket.id];
    socket.to(room).emit('user-disconnected', names[socket.id]);
    delete names[socket.id];
    delete rooms[socket.id];
  })

});


