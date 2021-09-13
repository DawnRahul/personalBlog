const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Instantiating the Schema class and passing in the document structure as an argument to the schema class

const postSchema = new mongoose.Schema({
    postTitle : {
          type: String,
          required: [true, "Title is required"]
    },
    postBody : String
  });

//Creating a mongoose model of post collection and the UserSchema created above
const postModel = mongoose.model('post', postSchema);
// The String "post" above is the name of your collection


module.exports = postModel;
