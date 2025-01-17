// In your routes (habitTracker.js)



const Practice = require('../model/Practice');
const express = require('express');
const HabitTracker = require('../model/HabitTracker');
const router = express.Router();

router.get('/', async(req,res)=>{
    const practice  = await Practice.find();
res.render('profile',{practice: practice});
})


  

  module.exports = router;