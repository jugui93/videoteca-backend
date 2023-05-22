const  mongoose  = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const videoSchema = new Schema( {
    title:{ type: String, required: true, minlength: 8 },
    description:{ type: String, required: true, minlength: 10 },
    url:{ type: String, required: true },
    public:{ type:Boolean, required:true },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review'}],
    comments: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Comments'}]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Video', videoSchema);