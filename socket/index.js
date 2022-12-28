// const user = require('../server/controller/user')
const io= require('socket.io')(8900,{
    path:"/socket/socket.io",
    cors:{
        origin:"http://vibing.cf"
    }
}) 

let users=[]
let liveUsers= []


const AddLiveusers =(userId,socketId)=>{
    if(userId != null){
        !liveUsers.some((user)=>user.userId ===userId )&&
        liveUsers.push({userId,socketId});
}
}

const removeLiveUser =(socketId)=>{
    liveUsers = liveUsers.filter(user=>user.socketId != socketId)
}

const Addusers =(userId,socketId)=>{
    if(userId != null){
    !users.some((user)=>user.userId ===userId)&&
    users.push({userId,socketId});
    }
}


const removeUser =(socketId)=>{
    users = users.filter(user=>user.socketId != socketId)
}


 

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("Adduser",(userId)=>{ 
        console.log("userId socket Id");
        console.log(userId,socket.id);
        userId !=null &&
        Addusers(userId,socket.id)
        io.emit("getUsers",users)
    });


    socket.on("AddLiveUser",(userId)=>{ 
        userId !=null &&
        AddLiveusers(userId,socket.id)
        io.emit("getLiveUser",liveUsers)
    });

    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId)
        io.to(user?.socketId).emit("getMessage",{
            senderId,
            text,
        })
    })

    socket.on('sendNotification',({senderId,receiverId,type})=>{
        const receiver = getLiveUsers(receiverId)
        io.to(receiver.socketId).emit('getNotification',{
            senderId,type
        })
    })


    socket.on("disconnect",()=>{
        console.log("a user disconnected");
        removeUser(socket.id)
        io.emit("getUsers",users)


        removeLiveUser(socket.id)
        io.emit("getLiveUser",liveUsers)
    });
});



let getUser =(userId)=>{
    return users?.find(user=>user.userId === userId)    
}  

let getLiveUsers =(userId)=>{
    console.log("userId");
    console.log(userId);
    return liveUsers?.find(user=>user.userId === userId)    
}  


// io.on("connection",(socket)=>{
//     console.log("user Connected");
// })