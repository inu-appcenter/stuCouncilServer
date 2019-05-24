const express = require('express')
const multer = require('multer')
const authMiddleWare = require('./function/auth')
const boardQuery = require('./query/boardQuery')
const board = require('./model/boardModel')


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
let fileArray = []


//router.use('/',authMiddleWare)

router.get('/all',(req,res)=>{
    res.status(200).json(mockup)
})

router.post('/all',async (req,res) => {
    board.find({boardKind : req.body.boardKind},{
        "_id" : false,
        "content" : false
    }).sort({date:'desc'}).exec((err,docs)=>{
        if(err){
            console.log(err)
            return res.status(400).json({ans: false})
        }
        else{
            return res.status(200).send(docs)
        }
    })
})


router.post('/create',upload.array('userFile',4),async (req,res) => {
    await req.files.map(Data => fileArray.push(Data.filename))
    let createQuery = {
        author : req.decoded.id,
        title : req.body.title,
        file : fileArray,
        content : req.body.content,
        notice : req.body.notice,
        boardKind : req.body.boardKind
    }

    if(boardQuery(createQuery,'create')){
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})

router.post('/update',upload.array('userFile',4),async (req,res) => {
    await req.files.map(Data => fileArray.push(Data.filename))
    let updateQuery = {
        boardId : req.body.boardId,
        author : req.decoded.id,
        title : req.body.title,
        file : fileArray,
        content : req.body.content,
        notice : req.body.notice,
        boardKind : req.body.boardKind
    }

    if(boardQuery(updateQuery,'update')){
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})

router.post('/delete',async(req,res)=>{
    
})





module.exports = router