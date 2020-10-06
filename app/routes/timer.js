const router = require('express').Router();
const verify = require('../middlewares/verifyToken');
const { createTimer, getAllTimer, updateDaySession, createDaySession, updateTimer, deleteTimer } = require('../controllers/timerController');

router.get('/getAllTimer', verify, getAllTimer);
router.post('/createTimer', verify, createTimer);
router.post('/createDaySession', verify, createDaySession);
router.put('/updateDaySession', verify, updateDaySession);
router.put('/updateTimer', verify, updateTimer);
router.delete('/deleteTimer/:id', verify, deleteTimer);

router.get('/', verify, (req,res) => {
    res.json({posts: {title: 'my rist post'}});
});



module.exports = router;