//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const postModel = require("./models/posts");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blogDB');
}


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// to collect all posts in an array from database
let allPosts = [];

app.get("/", function(req, res){

  postModel.find({}, function(err, docs){
    console.log("finding docs..");
    console.log(docs.length);
    if(err){
      console.log(err);
    }else {
      if(docs.length > 0 ){
        //collection all documents of 'posts' Collection in 'allPost' array
        allPosts = docs;
      }else {
        console.log("No posts to show!");
      }
    }
  });

  // console.log(allPosts);

  res.render("home", {
    startingContent: homeStartingContent,
    posts: allPosts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/blog/compose", function(req, res){
  res.render("compose");
});

app.post("/blog/compose", function(req, res){
   let title = req.body.postTitle;
   let content = req.body.postBody;

  // Creating new document under posts collection using postModel 
  postModel.create([{
    postTitle : title,
    postBody : content
  }]);

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  // let requestedTitle = _.camelCase(_.lowerCase(req.params.postName));
  // console.log( "Camel case of requestedTitle : " + requestedTitle);
  // *******************IM HERE *********** HERE ************************ HERE ************

 let postId = req.params.postId; 
  postModel.findById({_id : postId}, function(err, docs){

    if(err){
      console.log(err);
    }else{
      console.log("single posts page");
      console.log(docs);
      console.log(docs.postTitle);

      res.render("post", {
        title: docs.postTitle,
        content: docs.postBody
      }); 
    }
    
  });

});



app.post("/post/:postId/readmore" , (req, res)=>{

  const postId = req.body.readMore;
  console.log("postId :" + postId );

  // res.redirect("/post/" + postId);
  
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
