const board = require('../model/boardModel')

module.exports = async (query,kind) => {
    const nowDate = new Date()
    switch(kind){
        case 'select':
            board.find({boardKind : query},{
                "_id" : false,
                "content" : false
            }).sort({date:'desc'}).exec((err,docs)=>{
                if(err){
                    console.log(err)
                    return false
                }
                else{
                    let answer = docs
                    return answer
                }
            })
        break
        case 'create':
            let newBoard = new board()
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
                    return false
                }
                else{
                    return true
                }
            })
        break
        case 'update':
            board.updateMany(
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
                        return false
                    }
                    else {
                        return true
                    }
                    })
        break
        default:
            break
    }
}