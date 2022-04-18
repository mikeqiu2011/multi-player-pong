const server = require('http').createServer()
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = 3000
server.listen(PORT, () => {
    console.log('server is listening on', PORT);
})

let readyPlayerCount = 0

io.on('connection', (socket) => {
    console.log('a user is connected...', socket.id);

    socket.on('ready', () => {
        console.log('Player ready', socket.id);
        readyPlayerCount++

        if (readyPlayerCount % 2 == 0) {  // solve problem when user reconnect but game not restarted
            //broadcast startgame
            io.emit('startGame', socket.id) // the 2nd player will be chosen as referee
        }
    })

    socket.on('paddleMove', (paddleData) => {
        socket.broadcast.emit('paddleMove', paddleData) // fwd only to the other player
    })

    socket.on('ballMove', (ballData) => {
        socket.broadcast.emit('ballMove', ballData)
    })

    socket.on('disconnect', (reason) => {
        console.log('client disconnected', socket.id, reason);
    })
})