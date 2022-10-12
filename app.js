const express = require("express");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const app = express();

const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");

sequelize.sync({force:false}).then(() => {
    console.log("DB connected");
}).catch(err => {
    console.log(err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.listen(5000, () => {
    console.log("서버가 켜졌어요!");
  });