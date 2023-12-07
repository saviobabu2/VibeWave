const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({


  user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true },

  product: [
     {
      productId :{type:mongoose.Schema.Types.ObjectId, ref:'Product', required:true },

      quantity: {type:Number, default:1, required:false },
    price: {type:Number, default:1, required:false }
      
     }


  ]




}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
