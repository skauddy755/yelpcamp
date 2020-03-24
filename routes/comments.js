var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local");

	Campground 		= require("../models/campground"),
	Comment 		= require("../models/comment"),
	User 			= require("../models/user");

	middlewareObj 	= require("../middleware");

var router = express.Router();
//===============================================================================
router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, item){
		if(err) console.log("Some ERROR>>>>>>>>>>>>>>>>>>>>>>");
		else
			res.render("comments/new", {campground:item});
	});
	//res.render("comments/new");
});
router.post("/campgrounds/:id/comments",isLoggedIn ,function(req, res){
	Campground.findById(req.params.id, function(err, cg){
		if(err){
			console.log("ERROR ...");
			res.redirect("/campgrounds");
		}
		else
		{
			Comment.create(req.body.comment, function(err, cmt){
				if(err)console.log("ERROR ...");
				else
				{
					cmt.author.id       = req.user._id;
					cmt.author.username = req.user.username;
					cmt.save();
					cg.comments.push(cmt);
					cg.save();
					req.flash("success", "Added new comment...!!");
					res.redirect("/campgrounds/"+cg._id);
				}
			});
		}
	});
});
//---------------EDIT COMMENT-----------------------------
router.get("/campgrounds/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership,function(req, res){
	var campground_id = req.params.id;
	Comment.findById(req.params.comment_id, function(err, item){
		if(err)res.redirect("back");
		else{
			res.render("comments/edit", {campground_id: campground_id, comment:item});
		}
	});
});

//---------------UPDATE COMMENT---------------------------
router.put("/campgrounds/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	//res.send("WE EDITED THE COMMENT...");
	console.log(req.body.comment+"/t"+req.params.comment_id);
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, item){
		if(err)
		{
			console.log("ERROR in submitting the edited comments..");
			console.log(item);
			res.redirect("back");
		}
		else
		{
			console.log(item);
			req.flash("success", "Successfully, saved your changes to the comment...!!")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});
//------------------DELETE COMMENT-------------------
router.delete("/campgrounds/:id/comments/:comment_id/destroy", middlewareObj.checkCommentOwnership, function(req, res){
	//res.send("WE EDITED THE COMMENT...");
	//console.log(req.body.comment+"/t"+req.params.comment_id);
	Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err, item){
		if(err)
		{
			//console.log("ERROR in submitting the edited comments..");
			//console.log(item);
			res.redirect("back");
		}
		else
		{
			//console.log(item);
			req.flash("success", "Successfully, deleted the comment...!!")
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

//________________________MIDDLEWARE fxn : ___________________________________
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) return next();
	req.flash("error", "You need to be logged in first...!!");
	res.redirect("/login");
}


//============================================================================
module.exports = router;