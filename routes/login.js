const express = require('express')
const router = express.Router()
const request = require('request')
const config = require('./config/config')
let returnJson = {}
let returnStatus

router.post('/signUp',(req,res)=>{
    const signUpOptions = {
        url : config.signUpPath,
        headers : {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        method : 'POST',
        form:{
            id:req.body.id,
            passwd : req.body.passwd,
            tel : req.body.tel,
            major : req.body.major,
            name : req.body.name
        },
        json:true
    }
    request.post(signUpOptions,(err,response,body)=>{
        if(!err){
            switch (response.statusCode){
                case 200:
                    returnStatus = 200
                    returnJson = {
                        ans : response.body.answer
                    }
                    break
                case 400:
                    returnStatus = 400
                    returnJson = {
                        ans : response.body.answer
                    }
                    break
                default:
                    break
            }
            res.status(returnStatus).json(returnJson)
            return response
        }else{
            console.log(err)
        }
    })
})

 router.post('/signIn',async (req,res)=>{
    const signInOptions = {
        url : config.signInPath,
        headers : {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        form :{
            id : req.body.id,
            passwd : req.body.passwd
        },
        json:true
    }
    request.post(signInOptions,(err,response,body)=>{
        if(!err){
            switch (response.statusCode){
                case 200:
                    returnStatus = 200
                    returnJson = {
                        token : response.body.token
                    }
                    break
                case 400:
                    returnStatus = 400
                    returnJson = {
                        ans : response.body.ans
                    }
                    break
                default:
                    break
            }
            res.status(returnStatus).json(returnJson)
            return response
        }else{
            console.log(err)
        }
    })

})

module.exports = router