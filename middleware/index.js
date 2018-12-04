var Comment =  require("../models/comment");

ob = {};

ob.isloggedin= function(req,res,next){
	            if(req.isAuthenticated()){
	            	return next();
	            }
	            
	            res.redirect("/login");
}

ob.isOwnProfile = function(req,res,next){
	        if(req.isAuthenticated())
	        {
	        	Comment.findById(req.params.comment_id , function(err,comm){
	        		if(err){
	        			console.log(err);
	        		}else{
	        			if(comm.author.id.equals(req.user.id)){
	        				return next();
	        			}
	        			
	        		}
	        	})
	        }
}

module.exports =  ob;