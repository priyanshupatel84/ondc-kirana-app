const validator = require('validator');
const KYC = require('../models/KYC'); // Assuming the KYC model is in the models directory

// Helper function to validate KYC data
const validateKYCData = (data) => {
    const errors = [];

    if (data.email && !validator.isEmail(data.email)) {
        errors.push('Invalid email format.');
    }
    if (data.mob_no && !validator.isMobilePhone(data.mob_no, 'any')) {
        errors.push('Invalid mobile number.');
    }
    if (data.fssai_no && !validator.isLength(data.fssai_no, { min: 14, max: 14 })) {
        errors.push('FSSAI number must be exactly 14 characters.');
    }
    if (data.address && !validator.isLength(data.address, { min: 10, max: 200 })) {
        errors.push('Address must be between 10 and 200 characters.');
    }
    if (data.idType && !['Aadhar', 'PAN', 'Passport', 'Driving License'].includes(data.idType)) {
        errors.push('Invalid ID type. Allowed types are Aadhar, PAN, Passport, Driving License.');
    }
    if (data.idNumber && !validator.isAlphanumeric(data.idNumber)) {
        errors.push('ID number must be alphanumeric.');
    }
    if (data.id_image_url && !validator.isURL(data.id_image_url)) {
        errors.push('Invalid ID image URL.');
    }
    if (data.gstin_certificate_url && !validator.isURL(data.gstin_certificate_url)) {
        errors.push('Invalid GSTIN certificate URL.');
    }

    return errors;
};

// Submit KYC Details
exports.submitKYCDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url, status } = req.body;

        // Validate input data
        const validationErrors = validateKYCData({ email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const kyc = await KYC.create({ userId, email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url, status });
        res.status(201).json({ message: 'KYC Details submitted successfully!', kyc });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update KYC Details
exports.updateKYCDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url } = req.body;

        // Validate input data
        const validationErrors = validateKYCData({ email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const kyc = await KYC.findById(id);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC details not found' });
        }

        if (kyc.status === 'Pending' || kyc.status === 'Rejected') {
            if (email) kyc.email = email;
            if (mob_no) kyc.mob_no = mob_no;
            if (fssai_no) kyc.fssai_no = fssai_no;
            if (address) kyc.address = address;
            if (idType) kyc.idType = idType;
            if (idNumber) kyc.idNumber = idNumber;
            if (id_image_url) kyc.id_image_url = id_image_url;
            if (gstin_certificate_url) kyc.gstin_certificate_url = gstin_certificate_url;

            await kyc.save();
            res.json({ message: 'KYC details updated successfully!', kyc });
        } else {
            res.status(400).json({ message: 'Status is Verified: Cannot Modify Details' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get KYC Details by ID
exports.getKYCDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const kyc = await KYC.findById(id);
        if (!kyc) {
            return res.status(404).json({ message: 'KYC details not found' });
        }

        res.json(kyc);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
