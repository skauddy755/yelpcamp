var mongoose 	= require("mongoose"),
	Campground 	= require("./models/campground"),
	Comment 	= require("./models/comment");







//Sample array campgrounds...
var data = [
	{
		name: "Salmon Creek",
		image: "https://image.shutterstock.com/image-photo/camping-caravans-cars-parked-on-260nw-1388851691.jpg",
		description: "blah blah blah...!!!"
	},
	{
		name: "Blue Hills",
		image: "https://image.shutterstock.com/image-photo/camping-caravans-cars-parked-on-260nw-1388851691.jpg",
		description: "blah blah blah...!!!"
	},
	{
		name: "Desert Mase",
		image: "https://image.shutterstock.com/image-photo/camping-caravans-cars-parked-on-260nw-1388851691.jpg",
		description: "blah blah blah...!!!"
	},
	{
		name: "Lake Laky",
		image: "https://image.shutterstock.com/image-photo/camping-caravans-cars-parked-on-260nw-1388851691.jpg",
		description: "blah blah blah...!!!"
	}
];




//Remove all Campgrounds...
function seedDB()
{
	Campground.remove({}, function(err){
		if(err)console.log(err);
		else
		{
			console.log("All Campgrounds removed...");
			data.forEach(function(seed){
				Campground.create(seed, function(er, item){
					if(err) console.log(err);
					else
					{
						console.log("Added a new campground...");
						//Create a comment...
						Comment.create({
							text: "wtf dude...!!",
							author: "Homer"
						}, function(err, comment){
							if(err) console.log(err);
							else
							{
								console.log(comment);
								item.comments.push(comment);
								item.save();
							}
						});
					}
				});
			});
		}
	});
}






module.exports = seedDB;