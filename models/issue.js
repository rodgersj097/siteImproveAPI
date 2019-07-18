const mongoose = require('mongoose')
const Schema = mongoose.Schema

const issueSchema = new Schema( {
    issue: { 
       type: String,
       required: true
    },
    category: { 
       type: String,
      required: true
    },
    occurences: { 
       type: Number, 
       require: true
    },
    gained: { 
       type: Number ,
       required: true
    },
    toGain: { 
       type: Number ,
       required: true
    },
    date: { 
       type: Date, 
       required: true
    }
})


const Issue = mongoose.model('Issue', issueSchema)
module.exports = Issue