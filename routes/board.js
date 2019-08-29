const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const randomstring = require('randomstring')
const rimraf = require('rimraf')

const authMiddleWare = require('./function/auth')
const boardQuery = require('./query/boardQuery')
const board = require('./model/boardModel')
const boardSecret = require('./model/boardSecretModel')

// const app = express()

const router = express.Router()
let fileFolder = randomstring.generate(7)
const storage = multer.diskStorage({
    
    destination : (req,file,cb)=> {
        fs.mkdir('./file/'+fileFolder,()=>{
                cb(null,'file/'+fileFolder+'/')
        })
    },
    filename : (req,file,cb)=>{
        let extension = path.extname(file.originalname)
        let basename = path.basename(file.originalname, extension)
        cb(null,basename+extension)
    }
})


const upload = multer({storage: storage})

let fileArray = []
let selectBoard 


router.use('/create',authMiddleWare)
router.use('/update',authMiddleWare)
router.use('/delete',authMiddleWare)
router.use('/one',authMiddleWare)
router.use('/import',authMiddleWare)



router.post('/one',async (req,res) => {
    if(req.body.boardKind == 6){
        selectBoard = boardSecret
    }else{
        selectBoard = board
    }

    await selectBoard.findOne({boardId : req.body.boardId},{
        "_id" : false,
        "serverTime" : false
    }).exec(async(err,docs) => {
        if(err){
            res.status(400).json({ans:"fail"})
        }
        else{
            res.status(200).json(docs)
        }
    })
    
    

})


router.post('/search',async(req,res)=>{
    if(req.body.boardKind == 6) {
        selectBoard = boardSecret
    }
    else{
        selectBoard = board
    }

    await selectBoard.find({boardKind : req.body.boardKind,title:{$regex:req.body.search,$options:'i'}},{
        "_id" : false,
        "content" : false,
        "boardKind" : false,
        "serverTime" : false
    })
    .exec((err,docs)=>{
        if(err){
            res.status(400).json({ans:'fail'})
        }
        else{
            res.status(200).json(docs)
        }
    })
})

router.post('/all',async (req,res) => {
    let returnDoc = []

    if(req.body.boardKind == 6){
        selectBoard = boardSecret
    }else{
        selectBoard = board
    }
    await selectBoard.find({boardKind : req.body.boardKind},{
        "_id" : false,
        "content" : false,
        "boardKind" : false,
        "serverTime" : false
    }).sort({date:'desc'}).exec(async (err,docs)=>{
        if(err){
            res.status(400).json({ans : "fail"})
        }
        else{
            returnDoc.push(docs)
            res.status(200).send(returnDoc)
        }
    }) 
})


router.post('/create',upload.array('userFile',4),async (req,res) => {
    fileArray=[]
    await req.files.map(Data => fileArray.push(Data.filename))
    let createQuery

    if(req.body.boardKind == 6){
        createQuery = {
            author : req.decoded.id,
            authorName: req.decoded.name,
            title : req.body.title,
            file : fileArray,
            content : req.body.content,
            notice : req.body.notice,
            boardKind : req.body.boardKind,
            boardSecret : req.body.boardSecret,
            fileFolder : fileFolder
        }
    }
    else{
        createQuery = {
            author : req.decoded.id,
            authorName: req.decoded.name,
            title : req.body.title,
            file : fileArray,
            content : req.body.content,
            notice : req.body.notice,
            boardKind : req.body.boardKind,
            fileFolder : fileFolder
        }
    }

    if(boardQuery(createQuery,'create')){
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})

router.post('/update',upload.array('userFile',4),async (req,res) => {
    fileArray = []
    await req.files.map(Data => fileArray.push(Data.filename))
    let updateQuery = {
        boardId : req.body.boardId,
        author : req.decoded.id,
        authorName: req.decoded.name,
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
    let deleteQuery = {
        boardId : req.body.boardId,
        boardKind : req.body.boardKind,
        author : req.decoded.id
    }

    if(boardQuery(deleteQuery,'delete')){
        req.body.fileFolder && rimraf.sync(`./file/${req.body.fileFolder}`)
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})


router.post('/import',upload.array('userFile',4), async(req,res)=>{
    fileArray=[]
    await req.files.map(Data => fileArray.push(Data.filename))
    let createQuery

    if(req.body.boardKind == 6){
        createQuery = {
            author : req.decoded.id,
            authorName: req.decoded.name,
            title : req.body.title,
            file : fileArray,
            content : req.body.content,
            notice : req.body.notice,
            boardKind : req.body.boardKind,
            boardSecret : req.body.boardSecret,
            fileFolder : fileFolder
        }
    }
    else{
        createQuery = {
            author : req.decoded.id,
            authorName: req.decoded.name,
            title : req.body.title,
            data: req.body.date,
            file : fileArray,
            content : req.body.content,
            notice : req.body.notice,
            boardKind : req.body.boardKind,
            fileFolder : fileFolder
        }
    }

    if(boardQuery(createQuery,'import')){
        res.status(200).json({ans : "success"})
    }
    else{
        res.status(400).json({ans : "fail"})
    }
})




module.exports = router