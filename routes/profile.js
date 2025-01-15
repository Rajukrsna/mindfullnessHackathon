// In your routes (habitTracker.js)



const Practice = require('../model/Practice');
const express = require('express');
const HabitTracker = require('../model/HabitTracker');
const router = express.Router();

router.get('/', async(req,res)=>{
    const practice  = await Practice.find();
res.render('profile',{practice: practice});
})
router.get('/habit-tracker',(req, res) => {
res.render('habitTracker')
})
router.get('/api/habit-tracker-events', async (req, res) => {
    try {
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