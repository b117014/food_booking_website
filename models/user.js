var mongoose    =   require("mongoose");
var passportlo    = require("passport-local-mongoose");

var userschema   =   new mongoose.Schema({
	                      fname:String,
	                      lname:String,
	                      phone:Number,
	                      username:String,
	                      email:String,
	                      password:String,
	                      image:String
});

userschema.plugin(passportlo);

module.exports =   mongoose.model("User",userschema);