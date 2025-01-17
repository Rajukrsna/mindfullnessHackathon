// In your routes (habitTracker.js)



const Practice = require('../model/Practice');
const express = require('express');
const HabitTracker = require('../model/HabitTracker');
const router = express.Router();

router.get('/', async(req,res)=>{
    const practice  = await Practice.find();
res.render('profile',{practice: practice});
})
router.get('/analytics', (req,res)=>{
  res.render("video");
});

router.get('/api/habit-tracker-events', async (req, res) => {
    try {
        const medName = req.body;//get the meditation name
        //const habits = await HabitTracker.find({user.Id})
        //get the completed dates of the medName
      const habits = await HabitTracker.find();
      console.log(habits);  // Filter by logged-in user
      const events = habits.map(habit => ({
        title: habit.completed ? 'Completed' : 'Not Completed',
        start: habit.date,
        backgroundColor: habit.completed ? 'green' : 'red',
      }));
      res.json(events);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching habit events');
    }
  });
  

  module.exports = router;