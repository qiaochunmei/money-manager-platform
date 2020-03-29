const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

// 引入users.js
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');


// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to mongodb
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true     //这个即是报的警告
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// passport 初始化
app.use(passport.initialize());

// 引入passport配置文件
require('./config/passport')(passport);

app.get("/", (req, res) => {
  res.send("Hello World!");
})

// 使用routes
app.use('/api/users', users); // 通过中间件使用routes
app.use('/api/profiles', profiles);


const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
