const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = ( req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        if ( !token ){
            throw new Error('¡Autenticación fallida!')
        }
        const decodedToken = jwt.verify(token, "clave_privada_no_compartir");
        req.userData = {userId: decodedToken.userId}
        next();
    } catch (err) {
        const error = new HttpError('¡Autenticación fallida!', 403);
            return next(error)
    }
}