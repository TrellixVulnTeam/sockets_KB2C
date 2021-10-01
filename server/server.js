// Need to install socket library 11:23
// npm i socket.io

//also installed npm i nodemon --save-dev for a dev dependancy (this is the server to look for changes in dev)
const io = require("socket.io")(3001,{
  cors: ["http://localhost:8080"]
});

// runs everytime a client makes a connection to
// our server and give a socket instance for each one of them.
io.on('connection', socket => { //function that runs everytime client connects
  console.log(socket.id); //random ID assiged to each person when they connect to our  server
  // socket.on('custom-event',(number, string, object)=>{ // listen for the custom event
  //   // when ever a socket hears the "custom-event", we will call a function
  //   //console.log("custom-event", number, string, object);
  // });
  socket.on('send-message',(message, room)=>{ // listen for the custom event
    console.log("send-message -> ", message);
    //send the message down to our clients
    // we can call the message whatever we want.

    //send to every single socket. IO.emit send to all clients
    // io.emit('recieve-message', message);

    //send message to every other sockect that is not me.
    if(room === "") {
      //send message to every other sockect that is not me.
      socket.broadcast.emit('recieve-message', message)
    } else {
      //recieve the room property from the client and send to only that room
      //when using the .to() it already does the broadcast portion of the emit.
      // i.e. it sends to everyone except your self
      socket.to(room).emit('recieve-message', message)
    }
  });
  //send to multiple people but not to everyone. We can send to custom rooms
  socket.on("join-room", (room, cb) => {
    //the callback must always be the last variable in the function
    socket.join(room, cb );
    //Really cool because you cant call code from the client on the server.
    //with this call back you can do this
    //because you are creating a connection to make this work

    //if you want to do something and tell the use when it is done.
    //You can use this call back.
    // Usecase: have a messaging system where you would tell the user once the message was sent.
    //The call back can be used to verify once the callback has benn sent.
    //to have the callback, your message was successfull is rI eally useful.
    cb("Joined: " + room);
  });

});
