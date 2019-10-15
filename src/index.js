const fs = require('fs');
const cors = require('cors');
const multer = require("multer");
const crypto = require('crypto');
const express = require('express');
const bodyParse = require('body-parser');

const uploadConfig = require("./config/upload");

const app = express();
const upload = multer(uploadConfig);

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

const alg = 'aes256';
const passwd = 'abcdabcd';

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.post('/upload/cipher', upload.single('file'), async (req, res) => {
    const { originalname } = req.file;   
    const fileEncoded = `encoded-${originalname}`;

    const read = fs.createReadStream(originalname);
    const write = fs.createWriteStream(fileEncoded);
    const cipher = crypto.createCipher(alg, passwd);
    read.pipe(cipher).pipe(write);

    res.send('http://localhost:3000/get/' + fileEncoded);
});

app.post('/upload/decipher', upload.single('file'), async (req, res) => {
    const { originalname } = req.file;    
    const fileDecoded = `decoded-${originalname}`;

    const read = fs.createReadStream(originalname);
    const write = fs.createWriteStream(fileDecoded);
    const decipher = crypto.createDecipher(alg, passwd);
    read.pipe(decipher).pipe(write);

    res.send('http://localhost:3000/get/' + fileDecoded);
});

app.get('/get/:file', (req, res) => {
    const { file } = req.params;
    res.download(file);
});

app.use((erro, req, res, next) => {
    res.json({ error: erro.message });
});

app.listen(3000);

/*
    by: Ricardo Lima - CCO8NA
*/