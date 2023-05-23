const  mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema( {
    rating:{ type: Number, required: true, min: 0, max: 5 },
    Text:{ type: String },
    user: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    video: { type: mongoose.Types.ObjectId, required: true, ref: 'Video'},
});

module.exports = mongoose.model('Review', reviewSchema);