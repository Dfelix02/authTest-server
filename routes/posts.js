const router = require('express').Router();
const verify = require('./verifyToken');

//checking the token
router.get('/', verify, (req,res) =>{
    res.send(req.user);
});



module.exports = router;