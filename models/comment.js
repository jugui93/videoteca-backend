const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema( {
    text:{ type: String },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    video: { type: mongoose.Types.ObjectId, required: true, ref: 'Video'},
});

module.exports = mongoose.model('Comment', commentSchema);