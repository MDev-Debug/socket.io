import { io } from './http'

interface RoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface Message {
    username: string;
    text: string;
    createdAt: Date;
    room: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on('connection', (socket) => {

    socket.on('selected_room', (data, callback) => {
        let userFound = users.find(u => u.username == data.username && u.room == data.room)

        if (userFound) {
            userFound.socket_id = socket.id
        } else {
            socket.join(data.room)
            
            users.push({
                room: data.room,
                username: data.username,
                socket_id: socket.id
            })
        }
        const messagesRoom = getMessagesRoom(data.room)
        callback(messagesRoom)
    })

    socket.on('send_message', (data) => {
        const message: Message = {
            username: data.username,
            text: data.message,
            createdAt: new Date(),
            room: data.room
        }

        messages.push(message)

        io.to(data.room).emit('send_message', message)
    })
})

function getMessagesRoom(room: string) {
    return  messages.filter(m => m.room === room)
}