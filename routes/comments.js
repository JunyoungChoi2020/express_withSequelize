const { Users, Comments } = require('../models/');
const router = require('express').Router();
const auth = require("../routes/middleware/auth");

router.post('/:postId', auth, async (req,res)=>{
    try {
        const postId = req.params.postId;
        const userId = req.app.locals.user.userId;
        const {comment} = req.body;
        const nickname = await Users.findOne(
            {where: {userId:userId}},
            {attributes: 'nickname'}    
        )

        if(!comment.length){
            res.status(400).send("댓글 내용을 입력해주세요")
        }

        await Comments.create({
            postId: postId,
            userId: userId,
            nickname: nickname.nickname,
            comment: comment,
        })

    res.status(200).json({message: "댓글을 작성하였습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

router.get('/:postId', async (req,res)=>{
    try {
        const postId = req.params.postId;

        let allComments = await Comments.findAll(
            {where: {postId: postId}},
            {order: [
                ['createdAt', 'DESC']
            ]}
        );
        res.status(200).json({result: allComments});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
    
})

router.get('/:commentId', auth, async (req,res)=>{
    try {
        const commentId = req.params.commentId;
        const thisComment = await Comments.findOne({
            where : {commentId : commentId}
        });
        res.status(200).json({result: thisComment});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

router.put('/:commentId', auth, async (req,res)=>{
    try {
        const commentId = req.params.commentId;
        const { comment } = req.body;

        await Comments.update(
            {comment: comment},
            {where: {commentId: commentId}},
        );
        res.status(200).json({message: "게시글이 수정되었습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

router.delete('/:commentId', auth, async (req,res)=>{
    try {
        const commentId = req.params.commentId;
        await Comments.destroy({where : {commentId: commentId}});
        res.status(200).json({message: "게시글이 삭제되었습니다."});
    } catch (error) {
        res.status(400).json({ errorMessage: error });
    }
})

module.exports = router;