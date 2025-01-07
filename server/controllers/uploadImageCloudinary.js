const { uploadImages } = require("../util/image");
const {clodinaryFoldersPathKey} = require("../util/constant");


const uploadImageCloudinary = async (req, res) => {
    try {
        const { file, type = clodinaryFoldersPathKey.itemsImages } = req.body;
        const result = await uploadImages([file],type);
        res.status(200).send(result[0]);
    } catch (error) {
        res.status(400).json(error);
    }
};
module.exports = uploadImageCloudinary