const express = require('express')
const router = express.Router()
const mockup = require('./mokup.json')

router.get('/all',(req,res)=>{
    res.status(200).json(mockup)
})

module.exports = router