const express = require('express')
require('dotenv').config()
const cors = require('cors')
require('./db/db.js')
const auth = require('./middleware/auth.js')
const memberRoutes = require('./routes/member.js')
const bookRoutes = require('./routes/book.js')
const issuanceRoutes = require('./routes/issuance.js')
const taskRoutes = require('./routes/task.js')


const app = express()
app.use(cors())
app.use(express.json())
app.use(auth)
app.use('/member', memberRoutes)
app.use('/book', bookRoutes)
app.use('/issuance', issuanceRoutes)
app.use('/task', taskRoutes)

app.get("/app",(req,res)=>{
    res.send("Hello!")
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Running")
})

