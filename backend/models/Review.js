const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Apprenant' , required:true},
    formation: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' , required:true},
isLike: {type: Boolean, default: false}


});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;