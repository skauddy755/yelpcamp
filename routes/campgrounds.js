var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local");

	Campground 		= require("../models/campground"),
	Comment 		= require("../models/comment"),
	User 			= require("../models/user");

	middlewareObj 	= require("../middleware");

var router = express.Router({mergeParams: true});
//==============================================================
router.get("/campgrounds", function(req, res){
	console.log("USER : =================================="+req.user);
	Campground.find({}, function(err, items){
		if(err)console.log(err);
		else
			res.render("campgrounds/campgrounds", {campgrounds:items});
	});
});
router.post("/campgrounds", isLoggedIn, function(req, res){
	var name 		= req.body.name;
	var image 		= req.body.image;
	var description = req.body.description;

	var author = {
		id      : req.user._id,
		username: req.user.username
	};

	var obj = new Campground({name:name, image:image, description:description, author:author});
	
	Campground.create(obj, function(err,item){
		if(err)console.log(err);
		else{
			req.flash("success", "Successfully added a new campground...!!");
			res.redirect("/campgrounds");
		}
	});
	//res.send("New camground has been added successfully to the array...");
});
router.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, item){
		if(err)
			console.log(err);
		else
			res.render("campgrounds/show", {campground:item});
	});
	//res.send("This will be the INFO page some day... id = "+req.params.id);
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//-------------EDIT ROUTE------------------
router.get("/campgrounds/:id/edit",middlewareObj.checkCampgroundOwnership , function(req, res){
	Campground.findById(req.params.id, function(err, item){
		res.render("campgrounds/edit", {campground:item});
	});
});

//-------------UPDATE ROUTE----------------
router.put("/campgrounds/:id",middlewareObj.checkCampgroundOwnership ,function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, item){
		if(err) res.redirect("/campgrounds");
		else{
			req.flash("success", "Successfully saved your changes...!!");
			res.redirect("/campgrounds/"+req.params.id);
		} 
	});
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------DELETE ROUTE----------------
router.delete("/campgrounds/:id",middlewareObj.checkCampgroundOwnership ,function(req, res){
	Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err, item){
		if(err) res.redirect("/campgrounds");
		else {
			req.flash("success", "Campground deleted...!!")
			res.redirect("/campgrounds/");
		}
	});
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//________________________MIDDLEWARE fxn : ___________________________________
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) return next();
	req.flash("error", "You need to be logged in first...!!");
	res.redirect("/login");
}



//=================================================================================
module.exports = router;