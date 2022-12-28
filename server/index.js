const express = require('express')
require('dotenv').config()
const app=express()
const cors = require('cors')
var session = require('express-session')
var cookieParser = require('cookie-parser')
const connection = require('./db')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')   
const postRouter = require('./routes/post')
const authRouter = require('./routes/auth')
const conversationRouter = require('./routes/conversation')
const messageRouter = require('./routes/message')



connection()

app.use(cors())
app.use(express.json())

app.use(session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))


app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.use('/api/conversation',conversationRouter)
app.use('/api/message',messageRouter)




// const port=process.env.PORT||4000
app.listen(4000,()=>console.log(`listening on port 5000`));
// const port=process.env.PORT||4000
// app.listen(port,()=>console.log(`listening on port ${port}`));