var express       =     require("express"),
    bodyparser    =     require("body-parser"),
    mongoose      =     require("mongoose"),
    Menu          =     require("./models/mess"),
    Menu2         =     require("./models/mess2"),
    Comment       =     require("./models/comment"),
    User          =     require("./models/user"),
    middleware    =     require("./middleware/index"),
    override      =     require("method-override"),
    passport      =     require("passport"),
    passportlo    =     require("passport-local"),
    passportlomo  =     require("passport-local-mongoose"),
    dateformat    =     require("dateformat"),
    flash         =     require("connect-flash"),
    cookie        =     require("cookie-parser"),
    app           =     express();

   mongoose.connect("mongodb://prabhat:prabat@123@ds049598.mlab.com:49598/mess_booking");
   app.use(bodyparser.urlencoded({extended:true}));
   app.use(express.static(__dirname+"/public"));
   app.use(override("_method"));
   app.use(flash());
   app.use(cookie());
   var now = new Date(); 

      app.use(require("express-session")({
    	  secret:"this is your booking",
    	  resave:false,
    	  saveUninitialized:false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

 
    

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    passport.use(new passportlo(User.authenticate()));

   
app.use(function(req,res,next){
    	res.locals.current_user = req.user;
        res.locals.error = req.flash("err");
        res.locals.success = req.flash("suc");
    	next();
    })
  app.set("view engine","ejs");
   //====================
   //Mess 1
   //==================== 

    app.get("/land",function(req,res){
    	res.render("land");
    })
    app.get("/mess/book",middleware.isloggedin,function(req,res){
        
    	  res.render("new");
          
          
    });
    
    app.get("/mess/:id",middleware.isloggedin,function(req,res){
        Menu.findById(req.params.id,function(err,menu){
        	if(err){
        		console.log(err);
        	}else{
        		
        		res.render("index",{menu:menu});
        	}
        })

    });
    app.post("/mess",function(req,res){
    	  
   
    	 Menu.create(req.body.mess,function(err,menu1){
    	 	  if(err){
    	 	  	console.log(err);
    	 	  }else{
                req.flash("suc","Your coupan has booked in mess-1");
    	 	  	res.redirect("/mess/"+menu1._id);

    	 	  }
    	 })
    	
    });

    //===================
    // Mess 2
    //==================

    app.get("/mess2/book",middleware.isloggedin,function(req,res){
        
    	res.render("new2");
    })
    app.post("/mess2",function(req,res){

    	Menu2.create(req.body.mess2 ,function(err,menu2){
    		if(err){
    			console.log(err);
    		}else{
                req.flash("suc","your coupan has been booked in mess-2");
    			res.redirect("/mess2/"+menu2._id);
    		}
    	})
    })
    app.get("/mess2/:id",middleware.isloggedin,function(req,res){
    	Menu2.findById(req.params.id , function(err,menu2){
    		if(err){
    			console.log(err);
    		}else{
    			res.render("index",{menu:menu2});
    		}
    	})
    })
    

//=================
// Comments
//================

app.get("/mess/book/comments",function(req,res){
	Comment.find({},function(err,comment){
		if(err){
			console.log(err);
		}else{
			

			res.render("comment/comment",{comment:comment})
		}
	})
})
app.get("/mess/book/new_comments",function(req,res){
	res.render("comment/new");
})
app.post("/mess/book/comments",function(req,res){

	Comment.create(req.body.comments, function(err,comm){
		   if(err){
		   	console.log(err);
		   }else{
		   	   comm.author.id= req.user.id;
		   	   comm.author.username=req.user.username;
		   	   comm.date=dateformat(now,"mmmm dS, yyyy");
		   	   comm.save();
               req.flash("suc","Your commented successful");
		   	res.redirect("/mess/book/comments");
		   }
	})
})

app.delete("/mess/book/comments/:comment_id",function(req,res){
	 Comment.findByIdAndRemove(req.params.comment_id , function(err,comm){
	 	   if(err){
	 	   	console.log(err);
	 	   }else{
            req.flash("suc","Your message has been deleted");
	 	   	res.redirect("/mess/book/comments");
	 	   }
	 })
})

//==================
// Authentication
//==================

app.get("/login",function(req,res){
	  res.render("login");

})

app.get("/register",function(req,res){
	  res.render("register");
})

app.post("/register",function(req,res){

	User.register(new User({username:req.body.username}) , req.body.password , function(err,user){
		  if(err){
		  	console.log(err);
		  }else{
		  	passport.authenticate("local")(req,res,function(){
		  		  res.redirect("/land");
		  	})
		  }
	})
})

 app.post("/login" , passport.authenticate("local",{
 	                 successRedirect:"/land",
 	                 failureRedirect:"/login"
 }), function(req,res){});

 app.get("/logout",function(req,res){
 	   req.logout();
 	   res.redirect("/land");
 })
    app.listen(process.env.PORT,process.env.IP);