const board = require('../model/boardModel')
const boardSecret = require('../model/boardSecretModel')
const moment = require('moment-timezone')

module.exports = async (query,kind) => {
    const nowDate = moment.tz(new Date(),"Asia/Seoul").format('YYYY-MM-DD hh:mm:ss')
    console.log(nowDate)
    let selectBoard
    let returnValue = false
    let returnDoc = []
    switch(kind){
        case 'select':
            if(query == 5){
                selectBoard = boardSecret
            }else{
                selectBoard = board
            }
                await selectBoard.find({boardKind : query,notice : true},{
                "_id" : false,
                "content" : false,
                "boardKind" : false,
                "serverTime" : false
            }).sort({date:'desc'}).exec(async(err,docs)=>{
                if(err){
                    console.log(err)
                    return returnValue
                }
                else{
                    returnDoc.push(docs)
                    await selectBoard.find({boardKind : query},{
                        "_id" : false,
                        "content" : false,
                        "boardKind" : false,
                        "serverTime" : false
                    }).sort({date:'desc'}).exec(async (err,docs)=>{
                        if(err){
                            console.log(err)
                            return returnValue
                        }
                        else{
                            returnDoc.push(docs)
                            return returnDoc
                        }
                    })
                }
            }) 
            break

        case 'create':
            let newBoard
            if(query.boardKind == 5){
                newBoard = new boardSecret()
                newBoard.boardSecret = query.boardSecret
            }else{
                newBoard = new board()
            }
            newBoard.author = query.author
            newBoard.title = query.title
            newBoard.date = nowDate
            newBoard.viewTime = 0
            newBoard.notice = query.notice
            newBoard.content = query.content
            newBoard.boardKind = query.boardKind
            await query.file.map(Data => 
                newBoard.file.push(Data)
                )
            await newBoard.save(async (err,docs) => {
                if(err) {
                    return returnValue
                }
                else{
                    returnValue = true
                    return returnValue
                }
            })
        break
        case 'update':
            if(query.boardKind == 5){
                selectBoard = boardSecret
            }else{
                selectBoard = board
            }
            selectBoard.updateMany(
                {boardId : query.boardId},
                {$set:
                    {
                        title : query.title,
                        content : query.content,
                        file : query.file,
                        notice : query.notice
                    }
                },
                {multi:true}
                ).exec((err)=>{
                    if(err){
                        console.log(err)
                        return returnValue
                    }
                    else {
                        returnValue = true
                        return returnValue
                    }
                    })
        break
        default:
            break
    }

    console.log(returnDoc)
    if(!(returnDoc === "")){
        return returnDoc
    }
    else{
        return returnValue
    }
}