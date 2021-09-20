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


const homeStartingContent = "What's on your mind? Just write here...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// to collect all posts in an array from database
let allPosts = [];

app.get("/", function(req, res){

  postModel.find({},function(err, docs){
    console.log("finding docs..");
    console.log(docs.length);
    if(err){
      console.log(err);
    }else {
      if(docs.length > 0 ){
        //collection of all documents of 'posts' Collection in 'allPost' array
        allPosts = docs;
      }else {
        console.log("No posts to show!");
      }
    }
  });

  // console.log(allPosts);
  
  //using setTimeout to load homepage at 3 second delay, so that
  // allposts fetched from database in time and rendered in time.
  setTimeout(()=>{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: allPosts
      });
  }, 100);
  
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
  // callback function(err) is used so that only if creation and saving of 
  //document is done, callback function will run means then it will redirect to root page.
  postModel.create([{
    postTitle : title,
    postBody : content
  }], function(err){
    if(!err){
      res.redirect("/");
    }
  });

  

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
