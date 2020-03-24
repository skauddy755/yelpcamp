var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport 		= require("passport"),
	localStrategy 	= require("passport-local");

	//app 			= require("../app");

	Campground 		= require("../models/campground"),
	Comment 		= require("../models/comment"),
	User 			= require("../models/user");

var router = express.Router({mergeParams: true});
//===========================================================================
//--------------------------LANDING ROUTES-------------------------------------
router.get("/", function(req,res){
	res.render("landing");

});

//===========================================================================
//---------------------------SIGNUP ROUTES-----------------------------------
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	console.log(req);
	console.log("======================================================================================================")
	console.log(req.body);
	console.log("==========================================================================================");
	console.log(req.body.username);
	console.log("==========================================================================================");

	var nu = new User({username: req.body.username});
	User.register(nu, req.body.password, function(err, item){
		if(err)
		{
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});
//============================================================================
//-----------------------------LOGIN ROUTES-----------------------------------
router.get("/login", function(req, res){
	res.render("login");
});
router.post("/login",passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) , function(req, res){
	console.log("Okay..Logged in ...!!");
});

//============================================================================
//-----------------------------LOGOUT ROUTES----------------------------------
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

//============================================================================
//===========================================================================
//________________________MIDDLEWARE fxn : ___________________________________
function isLoggedIn(req, res, next)
{
	if(req.isAuthenticated()) return next();
	res.redirect("/login");
}


module.exports = router;