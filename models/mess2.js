var mongoose   =   require("mongoose");

var messschema   =   new mongoose.Schema({
	                    
	                    
	                   num1:String,
	                   num2:String,
	                   num3:String,
	                   num4:String,
	                   num5:String,
	                   num6:String,
	                   num7:String,
	                    num8:String,
	                   num9:String,
	                   num10:String,
	                   num11:String,
	                   num12:String,
	                   num13:String,
	                   num14:String,
	                    num15:String,
	                   num16:String,
	                   num17:String,
	                   num18:String,
	                   num19:String,
	                   num20:String,
	                   num21:String,
	                   amount:Number,
	                   author:{
	                   	  id:{
	                   	  	  type:mongoose.Schema.Types.ObjectId,
	                   	  	  ref:"User"
	                   	  },
	                   	  username:String
	                   }



});


module.exports   =   mongoose.model("Menu2",messschema);