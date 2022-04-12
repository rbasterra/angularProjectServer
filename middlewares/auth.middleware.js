const isAuthenticated = (req, res, next) => {
    // if (!req.user){
    //     return res.status(401).json('Usuario no autenticado');
    // }
    // debugger
    // console.log(req.isAuthenticated());
    // console.log(req);
    if (req.isAuthenticated()){
        return next();
    }
    return res.status(401).json('Authentication failed: user not authenticated');
};

module.exports = {isAuthenticated};