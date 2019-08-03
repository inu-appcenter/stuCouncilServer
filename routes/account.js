const express = require('express')
const request = require('request')

const authMiddleWare = require('./function/auth')
const config = require('./config/config')

const router = express.Router()

let returnJson = {}
let returnStatus

router.use('/changeInfo',authMiddleWare)
router.use('/myPage',authMiddleWare)


router.post('/changeInfo',(req,res)=>{
    const changeQuery = {
        url : config.changeInfoPath,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        method : 'POST',
        form : {
            id : req.decoded.id,
            passwd : req.body.passwd,
            newPasswd : req.body.newPasswd,
            tel : req.body.tel,
            major : req.body.major,
            name : req.body.name
        },
        json : true
    }
    request.post(changeQuery,(err,response)=>{
        if(!err){
            switch(response.statusCode){
                case 200 :
                    returnStatus = 200
                    returnJson = {
                        ans : "success"
                    }
                break
                
                case 400 :
                    returnStatus = 400
                    returnJson = {
                        ans : "password"
                    }
                break

                default:
                break
            }
            res.status(returnStatus).json(returnJson)
        }
        else{
            console.log(err)
        }
    })
})

router.post('/tmpPasswd', async(req,res)=>{
    const tmpPasswdQuery = {
        url : config.tmpPasswdPath,
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        },
        form : {
            id : req.body.id,
            name : req.body.name
        },
        json : true
    }

    request.post(tmpPasswdQuery,(err,response)=>{
        if(!err){
            switch(response.statusCode){
                case 200 :
                    returnStatus = 200
                    returnJson = {
                        ans : "success"
                    }
                break
                case 400 :
                    returnStatus = 400
                    returnJson = {
                        ans : "fail"
                    }
                break

                default :
                break
            }
            res.status(returnStatus).json(returnJson)
        }
        else{
            console.log(err)
        }
    })
})

router.post('/myPage',async (req,res) => {
    let decodedQuery = {
        id : req.decoded.id,
        name : req.decoded.name,
        major : req.decoded.major,
        tel : req.decoded.tel
    }
    res.status(200).json(decodedQuery)
})

module.exports = router