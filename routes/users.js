var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
/*
Registration Part
1. Write POST request that recieves username, password
2. Once you get password, save it and hash it 
3. To make hash more secure, add salt so that it's harder for people to figure out the password
4. Use uuid package to assign unique id to each user
5. Save user with the uuid (and hashed password/user) NOT the default MongoDB id

LOGIN Part
1. Write another POST request that recieves user/pass 
2. get user based on username
3. Compare passwords using decrypt package
4. Return user id

Keep User logged in part
Assign cookie to the person so that the browser knows they previously logged in
*/
module.exports = router;
