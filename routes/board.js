const express = require('express')
const multer = require('multer')
const authMiddleWare = require('./function/auth')
const boardQuery = require('./query/boardQuery')

const router = express.Router()
const storage = multer.diskStorage({
    destination : (req,file,cb)=> {
        cb(null,'file/')
    },
    filename : (req,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname)
    }
})
const upload = multer({storage: storage})

const mockup = require('./mokup.json')

router.use('/',authMiddleWare)

router.get('/all',(req,res)=>{
    res.status(200).json(mockup)
})

router.post('/create',upload.array('userFile',4),async (req,res) => {
    let fileArray = []
    await req.files.map(Data => fileArray.push(Data.filename))
    let createQuery = {
        author : req.decoded.id,
        title : req.body.title,
        file : fileArray,
        content : req.body.content,
        notice : req.body.notice
    }

    if(boardQuery(createQuery,'create')){
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})



/*
author : String,
    title : String,
    date : Date,
    boardId : {
        type : String,
        unique : true,
        default : shortid.generate
    },
    viewTime : Number,
    file : [],
    content : String,
    notice : Boolean
*/

module.exports = router