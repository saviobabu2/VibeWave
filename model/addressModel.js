const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var addressSchema = new Schema(
     {



          user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true },

list :[{
     

          user_name: {
               type: String,
               required: true,
          },
          
          phone: {
               type: String,
               required: true,
          },
          pincode: {
               type: Number,
               required: true,
          },
          address: {
               type: String,
               required: true,
          },
          
          town: {
               type: String,
               required: true,
          },
          state: {
               type: String,
               required: true,
          },}
          
          ]
       
          

     },
     {
          timestamps: true,
     }
);

//Export the model
module.exports = mongoose.model("Address", addressSchema);