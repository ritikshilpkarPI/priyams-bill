const { uploadImages } = require("../util/image")


const uploadImageCloudinary = async (req, res) => {
    try {
        const { file } = req.body;
        const result = await uploadImages([file]);
        res.status(200).send(result[0]);
    } catch (error) {
        res.status(400).json(error);
    }
};



module.exports = uploadImageCloudinary