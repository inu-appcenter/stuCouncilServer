const mongoose = require('mongoose')
const shortid = require('shortid')
const Schema = mongoose.Schema

let boardSchema = new Schema({
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
    content : String
})

module.exports = mongoose.model('boardSchema',boardSchema)