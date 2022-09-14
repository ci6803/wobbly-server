const { expressjwt: jwt } = require("express-jwt");

function getTokenFromHeader (req) {
    console.log(req.headers)
    if(req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {

        const token = req.headers.authorization.split(" ")[1];
        return token;
    }
    return null;

}

const isAuthenticated = jwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: 'payload',
    getToken: getTokenFromHeader


});

module.exports = {
    isAuthenticated
}