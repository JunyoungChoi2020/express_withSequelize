const jwt = require('jsonwebtoken');

const isValid = (token) => {
    try {
        jwt.verify(token, 'SecretKey');
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken){
            const [authType, authToken] = (accessToken).split(" ");
            if(isValid(authToken)){
                req.app.locals.isLogin = true;
            } else {
                req.app.locals.isLogin = false;
            }
        } else {
            req.app.locals.isLogin = false;
        }
        
        next();
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 상태 확인에 실패했습니다.",
        });
    }
}