const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const KYCSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address:{
        type: String,
        required: true
    },
    documentType: {
        type: String,
        enum: ['Aadhar', 'PAN', 'Passport', 'Driving License'],
        required: true
    },
    documentNumber: {
        type: String,
        required: true,
        unique: true
    },
    documentImage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

KYCSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const KYC = mongoose.model('KYC', KYCSchema);

module.exports = KYC;