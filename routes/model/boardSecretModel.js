const mongoose = require('mongoose')
const shortid = require('shortid')
const Schema = mongoose.Schema

let boardSecretSchema = new Schema({
    author : String,
    title : String,
    date : String,//{type:Date, default:Date.now},
    boardId : {
        type : String,
        unique : true,
        default : shortid.generate
    },
    viewTime : Number,
    file : [],
    content : String,
    notice : Boolean,
    boardKind : Number,
    boardSecret : Boolean,
    serverTime : {type:Date, default:Date.now}
})

module.exports = mongoose.model('boardSecretSchema',boardSecretSchema)