// require('dotenv').config("../../config/.env");

// const jwt = require("jsonwebtoken");
// const passport = require("passport");
// const localStrategy = require("passport-local").Strategy;
// const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");

// const { Users } = require("../../models/users");

// const JWTConfig = {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWT_SECRET_KEY
// }
// const passportConfig = {
//     usernameField: "nickname",
//     passwordField: 'password'
// }
// module.exports = () => {
//     //local strategy
//     passport.use(new localStrategy(passportConfig, (nickname, password, done) => {
//         return Users.fineOne({where : {nickname: nickname, password: password}}).then(user => {
//             if(!user){
//                 return done(null, false, {msg: "닉네임 또는 패스워드를 확인해주세요."})
//             }
//             return done(null, user, {msg: "로그인에 성공하였습니다."})
//         }).catch(err => done(err));
//     }));

//     //JWT Strategy
//     passport.use(new JWTStrategy(JWTConfig, (jwtPayload, done) => {
//         return Users.fineOneById(jwtPayload.userId).then(user => {
//             return done(null, user);
//         }).catch(err => done(err));
//     }));
// }



