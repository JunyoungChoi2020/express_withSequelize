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
        req.app.locals.isLogin = false;
        if(accessToken){
            const [authType, authToken] = (accessToken).split(" ");
            if(isValid(authToken)){
                req.app.locals.isLogin = true;
            }
        }
        next();
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 상태 확인에 실패했습니다.",
        });
    }
}