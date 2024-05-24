import { io } from "https://www.unpkg.com/socket.io@4.7.5/client-dist/socket.io.esm.min.js";
import {getUsername, setUsername} from "./username.mjs";
import {getPlant} from "./database/client_plants.mjs";

let username = null;
const roomNo = new URLSearchParams(window.location.search).get('plant_id');  // This fetches the plant ID from the URL
const socket = io();

let plant = null;

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    // it sets up the interface so that userId and room are selected
    document.getElementById('initial_form').style.display = 'block';
    document.getElementById('chat_interface').style.display = 'none';

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === username) {
            // it enters the chat
            hideLoginInterface(room, userId);
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === username) who = 'Me';
        writeMessage(who, chatText)
    });
}

function writeMessage(who, message) {
    writeOnHistory('<b>' + who + ':</b> ' + message);
}

async function loadHistory() {
    const href = window.location.href;
    const elements = href.split("/");
    const plant_id = elements[elements.length - 1];

    plant = await getPlant(plant_id);

    plant.comments.forEach(comment => writeMessage(comment.name, comment.message))
}


/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket

function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, username, chatText);
}
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    let message = { name: username, message: chatText };

    fetch(`/chat?plant_id=${roomNo}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Message saved:', data);
            socket.emit('chat', roomNo, username, chatText);
        })
        .catch(error => console.error('Error sending message:', error));
}


/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    username = document.getElementById('username').value;
    if (!username) username = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, username);
}

/**
 * it appends the given html text to the history div
 * @param text: the text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}

/**
 * it hides the initial form and shows the chat
 * @param room the selected room
 * @param userId the user name
 */
function hideLoginInterface(room, userId) {
    document.getElementById('initial_form').style.display = 'none';
    document.getElementById('chat_interface').style.display = 'block';
    document.getElementById('who_you_are').innerHTML= userId;
    document.getElementById('in_room').innerHTML= ' '+room;
}

function fillUsernameField() {
    const usernameField = document.getElementById("username"); // Ensure this matches your form's username input ID
    if (usernameField) {
        usernameField.value = getUsername();
    }
}

function setUsernameButtonClicked() {
    const usernameField = document.getElementById("username"); // This ID should match the username input field
    const usernameToSet = usernameField.value;
    setUsername(usernameToSet);
}

document.addEventListener("DOMContentLoaded", function(event) {
    fillUsernameField();
    const connectButton = document.getElementById("connect"); // Assuming you want to set username upon clicking connect
    if (connectButton) {
        connectButton.addEventListener("click", setUsernameButtonClicked);
    }
});

await loadHistory();

document.getElementById("connect").addEventListener("click", connectToRoom);
document.getElementById("chat_send").addEventListener("click", sendChatText);
init();

