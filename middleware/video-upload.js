const multer = require('multer');
const { v4: uuid} = require('uuid');

const MIME_TYPE_MAP = {
    'video/mp4':'mp4',
    'video/mpeg':'mpeg',
    'video/ogg':'ogg',
    'video/webm':'webm',
    'video/quicktime':'mov'
}

const videoUpload = multer({
    limits: 500000000,
    storage: multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, 'uploads/videos')
        },
        filename: (req, file, cb)=>{
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + '.' + ext )
        }
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Mime type invalido!')
        cb(error, isValid);
    }
});

module.exports = videoUpload;