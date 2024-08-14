// =============================== LOBBY up UX ================================

let wsLobby = null;

async function setUserToLog(userId) {
    try {
        let playerStatus = document.getElementById('player-'+ userId).children[1];
        playerStatus.innerHTML = `<div class="waiting-player"></div>`;
    } catch (error) {
        console.error('Failed to makePlayerLog', error);
    }
}

async function setUserToLogout(userId) {
    try {
        console.log('user logout =>', userId);
        let a= 'player-'+ userId
        let userBox = document.getElementById(a);
        let playerStatus = userBox.children[1];
        playerStatus.innerHTML = `<div class="pending-player"></div>`;
    } catch (error) {
        console.error('Failed to makePlayerLogout', error);
    }
}

// =============================== LOBBY WS utils ================================

async function handleWsLobbyMessage(data) {
    try {
        // console.log('data', data);
        if (data.eventType === 'redirect') {
            if (data.userId && data.userId === userId) {
                redirect(data);
                return;
            }
            return ;
        }
        if (data.userId && data.userId === userId) {
            console.log('ignorted')
            return;
        }
        let eventTypes = { 
            'ping': ping,
            'pong': pong,
            'leave': leave,
            'addPlayer': addPlayer,
            'addIa': addIa
        }; 
        eventTypes[data.eventType](data);
    } catch (error) {
        console.error(error);
    }
}


async function sendToWsLobby(eventType, msg) {
    try {
        let data = {
            userId: userId,
            eventType: eventType,
            message: msg
        };
        wsLobby.send(JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}

async function managerSendToWsLobby(eventType, msg, contactId) {
    try {
        let data = {
            userId: contactId,
            eventType: eventType,
            message: msg
        };
        wsLobby.send(JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }
}

// =============================== LOBBY WEBSOCKET ================================

async function connectLobbySocket(roomName) {
    try {
        wsLobby = new WebSocket(`wss://${window.location.host}/ws/lobby/${roomName}/`);
        
        wsLobby.onopen = function () {
            console.log('[WebSocket Lobby] => Connection established to room =>', roomName);
            let msg = userId + ' | ping';
            sendToWsLobby('ping', msg);
        };
        
        wsLobby.onmessage = async function (e) {
            let data = await JSON.parse(e.data);
            if (data.senderId === userId) return;
            handleWsLobbyMessage(data);
        };
        
        wsLobby.onclose = function (e) {
            console.log('[WebSocket] => Connection closed:', e);
        };

        wsLobby.onerror = function (error) {
            console.error('[WebSocket] => Error:', error);
        };
    } catch (error) {
        console.error('[WebSocket] => Connection failed', error);
    }
}

function disconnectLobbySocket() {
    try {
        console.log('[WebSocket] => Disconnecting...');
        console.log(userId);
        wsLobby.send(JSON.stringify({
            'message': 'disconnect',
            'senderId': userId
        }));
    } catch (error) {
        console.error('Error in disconnectWebSocket:', error);
    }
}


// =============================== LOBBY socketAction ================================

async function ping(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        let msg = userId + ' | pong';
        sendToWsLobby('pong', msg);
        setUserToLog(data.userId);
    } catch (error) {
        console.error(error);
    }
}

async function pong(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        setUserToLog(data.userId);
    } catch (error) {
        console.error(error);
    }
}

async function leave(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        if (!gameStart) {
            setUserToLogout();
        } else {
            console.log('You win');
        }
    } catch (error) {
        console.error(error);
    }
}

async function addPlayer(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        let newUser = await APIgetUserById(data.userId);
        innerNewPlayer(newUser);
    } catch (error) {
        console.error(error);
    }
}

async function addIa(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        innerNewIA();
    } catch (error) {
        console.error(error);
    }
}

async function redirect(data) {
    try {
        console.log('[WS-G]=> (' + data.message + ')');
        console.log('redirecting');
        console.log(data.message);
        window.location.href = data.message;

    } catch (error) {
        console.error(error);
    }
}

// =============================== LOBBY WS INNER ================================

async function innerNewPlayer(user) {
    try {
        let slopContent = document.getElementById('slop-content');
        let newPlayerDiv = document.createElement('div');
        newPlayerDiv.className = 'player-slot player-present';
        newPlayerDiv.id = `player-${user.id}`;
        newPlayerDiv.innerHTML = `
            <div class="player-data">
                <img src="${user.img.startsWith("profile_pics/") ? "/media/" + user.img : user.img}" alt="pp">
                <div class="player-status-online online"></div>
                <span>${user.username}</span>
            </div>
            <div class="player-status">
                <div class="pending-player"></div>
            </div>
        `;
        slopContent.appendChild(newPlayerDiv);
    } catch (error) {
        console.error('Failed to innerNp', error);
    }
}

async function innerNewIA() {
    try {
        let slopContent = document.getElementById('slop-content');
        let newIaPlayerDiv = document.createElement('div');
        newIaPlayerDiv.className = 'player-slot player-present';
        newIaPlayerDiv.innerHTML = `
            <div class="player-data">
                <img src="https://www.forbes.fr/wp-content/uploads/2017/01/intelligence-artificielle-872x580.jpg.webp" alt="pp">
                <div class="player-status-online online"></div>
                <span>IA</span>
            </div>
            <div class="player-status">
                <div class="waiting-player"></div>
            </div>
        `;
        slopContent.appendChild(newIaPlayerDiv);
    } catch (error) {
        console.error('Failed to innerNewIA', error);
    }
}