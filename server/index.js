const express = require('express')
require('dotenv').config()
const cors = require('cors')
require('./db/db.js')


const app = express()
app.use(cors())
app.use(express.json())

app.get("/app",(req,res)=>{
    res.send("Hello!")
})

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server Running")
})

