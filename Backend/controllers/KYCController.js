const KYC = require('../models/KYC'); // Assuming the Shop model is in the models directory


// add bank account details
exports.submitKYCDetails = async (req, res) => {
    try {
        const userId=req.user.id;
        const { email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url, status } = req.body;

        const kyc = await KYC.create({userId, email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url, status});
        res.status(201).json({ message: 'KYC Details submitted successfully!', kyc });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update bank details
exports.updateKYCDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, mob_no, fssai_no, address, idType, idNumber, id_image_url, gstin_certificate_url } = req.body;
        const kyc = await KYC.findById(id);

        if (!kyc) {
            return res.status(404).json({ message: 'KYC details not found' });
        }
        if(kyc.status == 'Pending' || kyc.status == 'Rejected'){
            if (email) kyc.email = email;
            if (mob_no) kyc.mob_no = mob_no;
            if (fssai_no) kyc.fssai_no = fssai_no;
            if (address) kyc.address = address;
            if (idType) kyc.idType = idType;
            if (idNumber) kyc.idNumber = idNumber;
            if (id_image_url) kyc.id_image_url = id_image_url;
            if (gstin_certificate_url) kyc.gstin_certificate_url = gstin_certificate_url;
            // if (status) kyc.status = status; this is to be done by admin

            await kyc.save();
            res.json({ message: 'KYC details updated successfully!', kyc });
        }
        else{
           res.status(400).json({ message: 'Status is Verified: Cannot Modify Details' });
        }   
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



// Get bank account details by ID
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