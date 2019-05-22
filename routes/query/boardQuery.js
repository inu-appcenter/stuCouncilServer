const board = require('../model/boardModel')

module.exports = async (query,kind) => {
    const nowDate = new Date()
    switch(kind){
        case 'create':
            let newBoard = new board()
            newBoard.author = query.author
            newBoard.title = query.title
            newBoard.date = nowDate
            newBoard.viewTime = 0
            newBoard.notice = query.notice
            newBoard.content = query.content
            await query.file.map(Data => 
                newBoard.file.push(Data)
                )
            await newBoard.save(async (err,docs) => {
                if(err) {
                    return false
                }
                else{
                    console.log(docs)
                    return true
                }
            })
        default:
            break
    }
}