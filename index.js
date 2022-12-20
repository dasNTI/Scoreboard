const express = require('express')
const app = express()

app.use("/static/", express.static(__dirname + "/public"))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/c', (req, res) => {
    res.sendFile(__dirname + '/controls.html')
})

const server = require('http').createServer(app)
const io = require('socket.io')(server)

var board = []

function sortBoard() {
    board.sort((a, b) => {
        let atime = a.time.split(':')
        let btime = b.time.split(':')

        atime = atime[0] * 6000 + atime[1] * 100 + atime[2]
        btime = btime[0] * 6000 + btime[1] * 100 + btime[2]

        return atime - btime
    })

    console.log(board)
}

io.on('connection', socket => {
    socket.emit("update", board)

    socket.on('add', player => {
        if (board.find(p => p == player)) return

        board.push(player)
        sortBoard()
        io.emit('alert', {
            place: board.indexOf(player),
            behindOf: board[board.indexOf(player) - 1]?.name || "niemand",
            otherPlayerTime: board[board.indexOf(player) - 1]?.time || 0
        })
        io.emit('update', board)
    })

    socket.on('delete', player => {
        board.splice(board.indexOf(board.find(p => p.name == player.name)), 1)
        sortBoard()
        io.emit('update', board)
    })

    socket.on('edit', player => {
        let prevTime = board.find(p => p.name == player.name).time
        board.splice(board.indexOf(board.find(p => p.name == player.name)), 1)
        board.push(player)

        sortBoard()

        if (player.time != prevTime) 
            io.emit('alert', {
                place: board.indexOf(player),
                behindOf: board[board.indexOf(player) - 1]?.name || "niemand",
                otherPlayerTime: board[board.indexOf(player) - 1]?.time || 0
            })
        io.emit('update', board)
    })
})

server.listen(181, () => {
    console.log(`http://${require('ip').address()}:0181`)
})