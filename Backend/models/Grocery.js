const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const GrocerySchema = new Schema({
    productImage: {
        type: [String],
        validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    countryOfOrigin: {
        type: String,
        //required: true
    },
    gstPercentage: {
        type: Number,
        //required: true
    },
    maxAllowedQuantity: {
        type: Number,
        //required: true
    },
    length: {
        type: Number,
        //required: true
    },
    breadth: {
        type: Number,
        //required: true
    },
    height: {
        type: Number,
        //required: true
    },
    weight: {
        type: Number,
        //required: true
    },
    returnWindow: {
        type: Number,
        //required: true
    },
    manufacturerName: {
        type: String,
       // required: true
    },
    manufacturedDate: {
        type: Date,
       // required: true
    },
    instructions: {
        type: String,
       // required: true
    },
    itemCategory: {
        type: String,
        //required: true
    },
    returnable: {
        type: Boolean,
        //required: true
    },
    cancellable: {
        type: Boolean,
        //required: true
    },
    cashOnDelivery: {
        type: Boolean,
        //required: true
    },
    packerName: {
        type: String,
    
    },
    packerAddress: {
        type: String,

    },
    commodityName: {
        type: String,
        
    },
    UOM: {
        type: String,
        
    },
    UOMValue: {
        type: Number,
        
    },
    MRP: {
        type: Number,
        //required: true
    },
    purchasePrice: {
        type: Number,
        //required: true
    },
    quantity: {
        type: Number,
        //required: true
    },
    SKU: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


function arrayLimit(val) {
    return val.length <= 4;
}

const Grocery=mongoose.model('Grocery',GrocerySchema);

module.exports=Grocery;