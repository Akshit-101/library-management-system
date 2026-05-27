require('dotenv').config()

const auth = (req,res,next) => {

    const x_api_key = req.headers['x-api-key']  

    const api_key = process.env.API_KEY

    if (!x_api_key){
        return res.status(401).json({ message: "Unauthorized" })  
    }

    if (api_key === x_api_key){
        next()
    }else{
        return res.status(401).json({ message: "Unauthorized" }) 
    }
}

module.exports = auth