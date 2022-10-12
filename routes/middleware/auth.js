const jwt = require('jsonwebtoken');
const { Users } = require("../../models")
const cookieParser = require('cookie-parser');

module.exports = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        const [authType, authToken] = (accessToken).split(" ");
        
        if (!authToken || authType !== "Bearer") {
            res.status(401).send({
              errorMessage: "로그인 후 이용 가능한 기능입니다.",
            });
            return;
        }
        const isValid = (token) => {
            try {
                jwt.verify(token, 'SecretKey');
                return true;
            } catch (error) {
                return false;
            }
        }

        if(isValid(authToken)){
            const { userId } = jwt.verify(authToken, 'SecretKey');
            const userTable = await Users.findOne({where: {userId: userId}});
            req.app.locals.user= userTable;
            next();
        } else {
            res.status(401).send("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
        }

    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
    }
};


