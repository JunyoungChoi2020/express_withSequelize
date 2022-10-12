const { Posts, Likes, Comments } = require('../models');
const router = require('express').Router();
const auth = require("../routes/middleware/auth");

router.post('/', auth, async (req,res)=>{
    const userInfo = req.app.locals.user;
    try {
        const { title, content, like } = req.body;
        const userId = userInfo.userId;

        await Posts.create({
            userId: userId,
            title: title,
            content: content,
            like: like,
        });

        res.status(200).json({message: "게시글 작성에 성공했습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
});

router.get('/like', auth, async (req,res)=>{
    const userId = req.app.locals.user.userId;
    const userLikeTable = await Likes.findAll({
        where: {userId: userId},
        attributes: ['postId']
    })
    let postIdList = userLikeTable.map(v => {
        return v.dataValues.postId
    })

    const postList = await Posts.findAll({
        where: {postId : postIdList},
        order: [
            ['like', "DESC"]
        ]
    })
    
    res.json({data: postList})
})

router.put('/:postId/like', auth, async (req, res) => {
    const postId = req.params.postId;
    const userId = req.app.locals.user.userId;

    const myPost = await Posts.findOne({where : {postId: postId}});
    if(myPost == null){res.status(400).send("포스팅 페이지가 존재하지 않습니다.")};
    
    const usersLikeTable = await Likes.findOne({where: {postId: postId, userId: userId}})

    if(usersLikeTable == null){
        await Posts.update({like: myPost.like + 1}, {where : {postId: postId}});
        await Likes.create({
            userId: userId,
            postId: postId
        })
        res.json({message: "게시글의 좋아요를 등록하였습니다."})
    } else {
        await Posts.update({like: myPost.like - 1}, {where : {postId: postId}});
        await Likes.destroy({
            where: {likeId: usersLikeTable.likeId}
        })
        res.json({message: "게시글의 좋아요를 취소하였습니다."})
    }
})

router.get('/', auth, async (req,res)=>{
    try {
        let allPosts = await Posts.findAll({
            include: [Likes]
        });
        res.status(200).json({result: allPosts});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
    
});

router.get('/:postId', auth, async(req,res)=>{
    try {
        const postId = req.params.postId;
        const thisPost = await Posts.findOne({
            where : {postId : postId}
        });
        res.status(200).json({result: thisPost});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
});

router.put('/:postId', auth, async (req,res)=>{
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        await Posts.findOne({where: {postId : postId}}).then(user => {
            user.update({content: content, title: title});
        })
        res.status(200).json({message: "게시글이 수정되었습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

router.delete('/:postId', auth, async (req,res)=>{
    try {
        const postId = req.params.postId;
        await Posts.destroy({where : {postId: postId}});
        res.status(200).json({message: "게시글이 삭제되었습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

module.exports = router;