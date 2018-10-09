var mongoose    =   require("mongoose");
var passportlo    = require("passport-local-mongoose");

var userschema   =   new mongoose.Schema({
	                      username:String,
	                      email:String,
	                      password:String
});

userschema.plugin(passportlo);

module.exports =   mongoose.model("User",userschema);