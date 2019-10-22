var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true 
    },
    url: {
        type: String,
        required: false 
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"}
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;