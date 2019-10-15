const multer = require("multer");
const path = require("path");

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", ".."),
        filename: (req, file, callback) => {
            const extensao = path.extname(file.originalname);
            const nome = path.basename(file.originalname, extensao);
            
            callback(null, `${nome}${extensao}`);
        }
    })
}