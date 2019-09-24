const express = require("express")
const router = express.Router()

router.get('/:where/:boardId',(req,res)=>{
    res.redirect("http://withyou27.byus.net/xe/"+req.params.where+"/"+req.params.boardId)
})

router.get('/',(req,res)=>{
    res.redirect("http://withyou27.byus.net/xe/?module=file&act=procFileDownload&file_srl="+req.query.file_srl+"&sid="+req.query.sid)
    // http://we.incheon.ac.kr/xe/?module=file&act=procFileDownload&file_srl=5734589&sid=9a28a0b12ce3cabc8c4dba294fd94018
    // http://we.incheon.ac.kr/xe/?module=file&act=procFileDownload&file_srl=5733888&sid=ddd584784eee9ff98080edcec46aaf5d
})

module.exports = router