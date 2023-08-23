const { Server } = require("socket.io");

const io = new Server(8096, {
    cors : true,
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log('Socket Connected', socket.id);

    socket.on("room:join", (data) => {
        console.log(data);
        const {email, room} = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        //io.to(socket.id).emit("room:join", data);
        io.to(room).emit("user:joined", {email, id: socket.id});
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({to, offer}) =>{
        io.to(to).emit("incomming:call", {from:socket.id, offer});
    })

    socket.on("call:accepted", ({to, ans}) => {
        io.to(to).emit("call:accepted", {from:socket.id, ans});
    })

    socket.on("peer:nego:needed", ({to, offer}) => {
        //console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", {from:socket.id, offer})
    });

    socket.on("peer:nego:done", ({to, ans}) => {
        //console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", {from:socket.id, ans});
    });



});



// const express = require('express');
// const wrtc = require('wrtc');
// const app = express();

// let senderStream;;

// app.use(express.json());
// app.use(express.static('./public'))

// app.post('/broadcast', async (req, res) => {
//     const { sdp } = req.body;
//     const peer = new wrtc.RTCPeerConnection();
//     peer.ontrack = (e) => handleTrackEvent(e, peer);
//     const desc = new wrtc.RTCSessionDescription(sdp)
//     await peer.setRemoteDescription(desc);
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     res.json({
//         sdp: peer.localDescription
//     })
// });

// app.post('/consumer', async (req, res) => {
//     const { sdp } = req.body;
//     const peer = new wrtc.RTCPeerConnection();
//     const desc = new wrtc.RTCSessionDescription(sdp)
//     await peer.setRemoteDescription(desc);
//     senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
//     const ans = await peer.createAnswer();
//     await peer.setLocalDescription(ans);
//     res.json({
//         sdp: peer.localDescription
//     })
// });

// /**
//  * 
//  * @param {RTCTrackEvent} e 
//  * @param {RTCPeerConnection} peer 
//  */
// function handleTrackEvent(e, peer) {
//     console.log(e.streams[0])
//     senderStream = e.streams[0];
// }

// app.listen(9000)