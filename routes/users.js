const jwt = require('jsonwebtoken');
const { Users } = require('../models/');
const singUpValidation = require('./middleware/signup_validation');
const router = require('express').Router();
const auth = require("../routes/middleware/auth");

router.post('/signup', singUpValidation, auth, async (req, res) => {
    try {
        if(req.app.locals.isLogin){
            res.status(401).send("이미 로그인 중입니다.");
        }
        const { nickname, password, confirm } = req.body;
        const nicknameInDB = await Users.findOne({where: {nickname: nickname}});

        if(password !== confirm){
            res.send("패스워드와 패스워드 확인 값이 서로 다릅니다.");
        }
        if(!nicknameInDB){
            await Users.create({
                nickname: nickname,
                password: password
            }).then(_=> res.send("회원가입에 성공하였습니다."));
        } else {
            res.send("중복된 닉네임입니다.")
        }
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
});

router.post('/login', auth, async(req, res) => {
    try {
        if(req.app.locals.isLogin){
            res.status(401).send("이미 로그인 중입니다.");
        }
        const { nickname, password } = req.body;

        await Users.findOne({ where : { nickname: nickname} }).then(user => {
            if(user == null || user == undefined){
                res.status(401).send("유저 정보가 존재하지 않습니다.");
            }

            if(user.nickname !== nickname || user.password !== password){
                res.status(403).send("아이디 또는 패스워드가 잘못되었습니다.");
            }
            
            const token = "Bearer " + jwt.sign({userId: user.userId}, "SecretKey", {expiresIn: '600s'});
            res.cookie('accessToken', token).send({
                msg: "로그인에 성공했습니다.",
                token: token
            });
        });

    } catch (error) {
        console.log("login error: " + error);
    };
});

router.get('/', async (req, res) => {
    const userInfo = await Users.findAll();
    res.json({"result": userInfo});
})
module.exports = router;
