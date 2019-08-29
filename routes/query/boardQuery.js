const board = require('../model/boardModel')
const boardSecret = require('../model/boardSecretModel')
const moment = require('moment-timezone')

module.exports = async (query,kind) => {
    const nowDate = moment.tz(new Date(),"Asia/Seoul").format('YYYY-MM-DD hh:mm:ss')
    let selectBoard
    let returnValue = false
    let returnDoc = []
    switch(kind){
        case 'select':
            if(query == 6){
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
            // eslint-disable-next-line no-case-declarations
            let newBoard
            if(query.boardKind == 6){
                newBoard = new boardSecret()
                newBoard.boardSecret = query.boardSecret
            }else{
                newBoard = new board()
            }
            newBoard.author = query.author
            newBoard.authorName = query.authorName
            newBoard.title = query.title
            newBoard.date = nowDate
            newBoard.viewTime = 0
            newBoard.notice = query.notice
            newBoard.content = query.content
            newBoard.boardKind = query.boardKind
            newBoard.fileFolder = query.fileFolder
            await query.file.map(Data => 
                newBoard.file.push(Data)
                )
            await newBoard.save(async (err) => {
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
            if(query.boardKind == 6){
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
                        return returnValue
                    }
                    else {
                        returnValue = true
                        return returnValue
                    }
                    })
        break

        case 'delete':
            if(query.boardKind == 6){
                selectBoard = boardSecret
            }
            else{
                selectBoard = board
            }

            selectBoard.deleteOne({author: query.author,boardId: query.boardId, boardKind: query.boardKind})
            .exec((err)=>{
                if(err) {
                    return returnValue
                }
                else{
                    returnValue = true
                    return returnValue
                }
            })
            break

            case 'import':
                // eslint-disable-next-line no-case-declarations
                let importBoard
                if(query.boardKind == 6){
                    importBoard = new boardSecret()
                    importBoard.boardSecret = query.boardSecret
                }else{
                    importBoard = new board()
                }
                importBoard.author = query.author
                importBoard.authorName = query.authorName
                importBoard.title = query.title
                importBoard.date = query.date
                importBoard.viewTime = 0
                importBoard.notice = query.notice
                importBoard.content = query.content
                importBoard.boardKind = query.boardKind
                importBoard.fileFolder = query.fileFolder
                await query.file.map(Data => 
                    importBoard.file.push(Data)
                    )
                await importBoard.save(async (err) => {
                    if(err) {
                        return returnValue
                    }
                    else{
                        returnValue = true
                        return returnValue
                    }
                })
            break


        default:
            break
    }

    if(!(returnDoc === "")){
        return returnDoc
    }
    else{
        return returnValue
    }
}