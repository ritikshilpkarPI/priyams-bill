const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
    file: (request, file) => {
        console.log(file);
        // const match = ["image/png", "image/jpg", "image/jpeg"];

        // if (match.indexOf(file.type) === -1) {
        //     return `${Date.now()}-blog-${file.originalname}`;
        // }

        // return {
        //     bucketName: "file",
        //     filename: `${Date.now()}-blog-${file.originalname}`,
        //     file: file
        // }
    }
});

module.exports = multer({ storage });