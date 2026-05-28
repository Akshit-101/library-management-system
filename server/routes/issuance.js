const express = require('express')  
const router = express.Router();
const {getAllissuances,getissuance,postissuance,updateissuance} = require('../controllers/issuance.js')

router.get("/", getAllissuances)    
router.get("/:id",  getissuance)        
router.post("/",  postissuance)      
router.put("/:id",  updateissuance)     

module.exports = router