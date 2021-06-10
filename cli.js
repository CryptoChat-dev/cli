// Imports

const CryptoJS = require('crypto-js');
const io = require('socket.io-client');
const readline = require('readline');
const dotenv = require('dotenv').config();

const lineReader = readline.createInterface({input: process.stdin, output: process.stdout});

var username;
var password;
var roomName;

// connect to socketio endpoint
let socket;
const initiateSocket = (room) => {
    socket = io(process.env.API);
    socket.emit('join', room)
}

getUsername();

function getUsername() {
    lineReader.question('Username: ', (answer) => {
        username = answer;
        getPassword();
    });
}

function getPassword() {
    lineReader.question('Room Key: ', (answer) => {
        password = answer;
        roomName = CryptoJS.SHA512(password).toString();
        initiateSocket(roomName)
        console.log(`\n[CLI] Connected to CryptoChat.\n`)

        socket.emit('chat event', {
            "roomName": roomName,
            "user_name": crypt.encryptMessage(username, password),
            "message": crypt.encryptMessage('has joined the room.', password)
        });
        
        socket.on('my response', incomingHandler);

        setTimeout(() => chat(), 1500);
    });
}

function chat() {
    lineReader.question(`--- [${username}]: `, (answer) => {
        if (answer == '/exit') {
            leaveAndReload();
            return;
        }
        if (answer.length > 0) {
            sendMessage(answer);
        }
        chat();
    });
}

let crypt = {
    encryptMessage: function (messageToEncrypt = '', secretkey = '') {
        var encryptedMessage = CryptoJS.AES.encrypt(messageToEncrypt, secretkey);

        return encryptedMessage.toString();
    },
    decryptMessage: function (encryptedMessage = '', secretkey = '') {
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretkey);

        return decryptedBytes.toString(CryptoJS.enc.Utf8);
    }
};

function sendMessage(message) {
    socket.emit('chat event', { // encrypt and send the user's name and message
        "roomName": roomName,
        "user_name": crypt.encryptMessage(username, password),
        "message": crypt.encryptMessage(message, password)
    });
}

function incomingHandler(msg) {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0, null)
    var decryptedUsername = crypt.decryptMessage(msg.user_name, password);
    var decryptedMessage = crypt.decryptMessage(msg.message, password);
    if (decryptedUsername !== '' || decryptedMessage !== '') { // if the username and message are empty values, stop
        console.log(`[${decryptedUsername}]: ${decryptedMessage}`);
        chat();
    } else {
        var time = new Date();
        console.log(`[${time}] Could not decrypt: ${msg}`);
    }
}

function leaveAndReload() {
    socket.emit('chat event', JSON.parse(JSON.stringify({
        "roomName": roomName,
        "user_name": crypt.encryptMessage(username, password),
        "message": crypt.encryptMessage('has left the room.', password)
    })));
    setTimeout(() => process.exit(0), 1500)
}
