const randomstring = require('randomstring')

const fileFolderRandom = (req,res,next) => {
    const p = new Promise((resolve)=>{
        const ran = randomstring.generate(10)
        resolve(ran)
    })

    p.then((ran)=>{
        req.fileFolder = ran
        next()
    })
}

module.exports = fileFolderRandom