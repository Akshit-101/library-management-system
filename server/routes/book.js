const express = require('express')  
const router = express.Router();
const {
    getAllbooks,
    getbook,
    postbook,
    updatebook,
    getAllCategories,
    getAllCollections
} = require('../controllers/book.js')

router.get("/", getAllbooks)    
router.get("/categories", getAllCategories)
router.get("/collections", getAllCollections)
router.get("/:id",  getbook)        
router.post("/",  postbook)      
router.put("/:id",  updatebook)     

module.exports = router