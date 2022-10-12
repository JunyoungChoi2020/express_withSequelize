const Joi = require("joi");

module.exports = async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
        nickname: Joi.string().min(3).alphanum().required(),
        password: Joi.string().min(4).required(),
        confirm: Joi.string().min(4).required(),
    });

    try{
        await schema.validateAsync(body);
        next();
    }catch(e){
        res.status(400).json({msg: e});
        next();
    }
}

