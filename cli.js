const CryptoJS = require('crypto-js');
const io = require('socket.io-client');
const readline = require('readline');

const protocol = 'https://';
const hostname = 'cryptochat.dev';
const port = '443';

const lineReader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var username = '';
var password = '';

// connect to socketio endpoint
var socket = io.connect(protocol + hostname + ':' + port);

socket.on('connect', function () {
    // on connect
    socket.emit('chat event', {
        data: 'User Connected'
    });
});

getUsername();

function getUsername() {
        lineReader.question('What is your username? ', (answer) => {
                username = answer;
                getPassword();
        });
}

function getPassword() {
        lineReader.question('What is your room password? ', (answer) => {
                password = answer;

                socket.emit('chat event', {
                    "user_name": code.encryptMessage(username, password),
                    "message": code.encryptMessage('has joined the room.', password)
                });

                chat();
        });
}

function chat() {
        lineReader.question('Send a message: ', (answer) => {
                checkCommands(answer);
                chat();
        });
}

function checkCommands(message) {
    var args = message.split(' ');

    // switch for command
    switch (args[0]) {
        case '/nick':
            // change username
            if (args.length == 1) {
                // if no username arguments were provided then alert the user
                console.log('Invalid nickname. Correct usage: /nick <username>');

            } else {
                username = args[1];

                // broadcast the username change to the whole room
                socket.emit('chat event', JSON.parse({
                    "user_name": code.encryptMessage(username, password),
                    "message": code.encryptMessage('changed their username to ' + username, password)
                }));
            }

            break;

        case '/leave':
            // leave the room
            leaveAndReload();
            break;

        default:
            // if no slash command, just send the message normally
            sendMessage(message);
    }
}

let code = {
        encryptMessage: function (messageToEncrypt = '', secretkey = '') {
                var encryptedMessage = CryptoJS.AES.encrypt(
                        messageToEncrypt,
                        secretkey
                );

                return encryptedMessage.toString();
        },
        decryptMessage: function (encryptedMessage = '', secretkey = '') {
                var decryptedBytes = CryptoJS.AES.decrypt(
                        encryptedMessage,
                        secretkey
                );

                return decryptedBytes.toString(CryptoJS.enc.Utf8);
        }
};

function sendMessage(message) {
    socket.emit('chat event', {
        // encrypt and send the user's name and message
        "user_name": code.encryptMessage(username, password),
        "message": code.encryptMessage(message, password)
    });
}

socket.on('my response', function (msg) {
    // console.log(msg); // for debugging: print the encrypted contents of the response

    if (typeof msg.user_name !== 'undefined') {
        if (code.decryptMessage(msg.user_name, password) == '' && code.decryptMessage(msg.message, password) == '') {
            // if the username and key are empty values, stop
            return;
        }

        console.log(decodeURI(code.decryptMessage(msg.user_name, password)) + ': ' + code.decryptMessage(msg.message, password).toString());
    }
});

function leaveRoom() {
    // on tab close, broadcast to the room

    socket.emit('chat event', JSON.parse({
        "user_name": code.encryptMessage(username, password),
        "message": code.encryptMessage('has left the room.', password)
    }));
}

function leaveAndReload() {
        leaveRoom();
        process.exit(0);
}
