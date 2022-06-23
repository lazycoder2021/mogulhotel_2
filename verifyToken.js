const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {
    //console.log('middleware medding...')
    

    let authHeader = req.headers.token;

    if (!authHeader) {
        return res.status(403).json({ "msg": "token not present" })
    }
    
    authHeader = authHeader.split(' ')[1]; 
    console.log(authHeader)
    jwt.verify(authHeader, process.env.PASS_JWT, function (err, user) {
        if (err) {
            return res.status(403).json({ "msg": "token not valid" })
        } else {
            req.user = user; 
            next();
        }
    })

     
}


function verifyTokenAndAdmin (req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = verifyToken;
