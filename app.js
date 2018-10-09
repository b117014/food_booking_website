var express       =     require("express"),
    bodyparser    =     require("body-parser"),
    mongoose      =     require("mongoose"),
    Menu          =     require("./models/mess"),
    Menu2         =     require("./models/mess2"),
    User          =     require("./models/user"),
    middleware     =     require("./middleware/index"),
    passport      =     require("passport"),
    passportlo    =     require("passport-local"),
    passportlomo  =     require("passport-local-mongoose"),
    app           =     express();

   mongoose.connect("mongodb://prabhat:prabhat123@ds121603.mlab.com:21603/mess");
   app.use(bodyparser.urlencoded({extended:true}));
   app.use(express.static(__dirname+"/public"));
 

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
    app.listen(3000);