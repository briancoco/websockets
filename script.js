const socket = io('http://localhost:3000');
const submitBtn = document.querySelector('.submit-btn');
const messageInp = document.querySelector('.message-input');
const messageForm = document.querySelector('.message-input-container');
const messageContainer = document.querySelector('.message-container');

socket.on('connect', () => {
    //on connection we want to prompt the user for their name
    //then emit an event to the ws server, so we can
    //add this name to our hashmap

    const name = prompt('Enter your name: ');
    socket.emit('new-user', name);

});

socket.on('user-connected', (name) => {
    const div = document.createElement('div');
    div.innerText = `${name} has connected`;
    messageContainer.appendChild(div);
})

socket.on('user-disconnected', (name) => {
    const div = document.createElement('div');
    div.innerText = `${name} has disconnected`;
    messageContainer.appendChild(div);
})

socket.on('chat-message', (socket) => {
    appendMessage(socket);
})


//we need an event listener that will trigger a callback
//function when the send btn is clicked
//this callback will throw an event to our web socket server
//passing in the given message

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('send-chat-message', messageInp.value);
    appendMessage({name: 'You', message: messageInp.value});
    messageInp.value = '';
})

function appendMessage(socket) {
    //this function creates a div that will contain a given message
    //and appends it onto our chat log
    const div = document.createElement('div');
    div.innerText = `${socket.name}: ${socket.message}`;

    messageContainer.appendChild(div);
    
}