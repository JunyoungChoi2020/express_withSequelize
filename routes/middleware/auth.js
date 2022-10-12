const jwt = require('jsonwebtoken');
const { Users } = require("../../models")

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
            
            if (!authToken || authType !== "Bearer") {
                res.status(401).send({
                errorMessage: "로그인 후 이용 가능한 기능입니다.",
                });
            }

            if(isValid(authToken)){
                const { userId } = jwt.verify(authToken, 'SecretKey');
                const userTable = await Users.findOne({where: {userId: userId}});
                if(!userTable){
                    res.status(401).send("유저 정보가 존재하지 않습니다.")
                }
                req.app.locals.user= userTable;
                req.app.locals.isLogin = true;
                next();
            } else {
                res.status(401).send("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
            }
        } else {
            req.app.locals.isLogin = false;
            next();
        }

    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};


