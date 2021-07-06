const expressJwt = require('express-jwt');
const errorHandler = require('./error-handler');

//use to authenticate api
function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    }) // To exclude api from authentication (unless)
}

async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true);
    }
    done();
}
module.exports = authJwt