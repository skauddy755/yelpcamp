var Campground = require("../models/campground");
    Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCommentOwnership = function (req, res, next){

	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id, function(err, item){
			if(err)
			{
				res.redirect("back");
			}
			else
			{
				console.log(item);
				if(item.author.id.equals(req.user._id))
					next();//res.render("campgrounds/edit", {campground:item});
				else {
					req.flash("error", "You don't have the permission to do that...!!");
					res.redirect("back");
				}
			}
		});
	}
	else
	{
		res.redirect("back");
	}
}

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id, function(err, item){
			if(err)
			{
				res.redirect("back");
			}
			else
			{
				console.log(item);
				if(item.author.id.equals(req.user._id))
					next();//res.render("campgrounds/edit", {campground:item});
				else{
					req.flash("error", "You don't have the permission to do that...!!");
					res.redirect("back");
				}
			}
		});
	}
	else
	{
		res.redirect("back");
	}
}

module.exports = middlewareObj;