const express = require("express")
const router = express.Router()

router.get('/:where/:boardId',(req,res)=>{
    res.redirect("http://withyou27.byus.net/xe/"+req.params.where+"/"+req.params.boardId)
})

module.exports = router