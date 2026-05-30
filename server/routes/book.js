const express = require('express')  
const router = express.Router();
const {
    getAllbooks,
    getbook,
    postbook,
    getAllCategories,
    getAllCollections
} = require('../controllers/book.js')

router.get("/", getAllbooks)    
router.get("/categories", getAllCategories)
router.get("/collections", getAllCollections)
router.get("/:id",  getbook)        
router.post("/",  postbook)      

module.exports = router