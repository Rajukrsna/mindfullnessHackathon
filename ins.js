const mongoose = require('mongoose');
const HabitTracker = require('./model/HabitTracker'); // Assuming your model is named Habit

async function insertSampleData() {
  const habits = [
    {  completed: true, date: new Date("2025-01-01T09:00:00Z") },
    {  completed: false, date: new Date("2025-01-02T08:00:00Z") },
    {  completed: true, date: new Date("2025-01-03T06:30:00Z") },
    {  completed: false, date: new Date("2025-01-04T20:00:00Z") },
    {  completed: true, date: new Date("2025-01-05T07:00:00Z") },
    {  completed: true, date: new Date("2025-01-06T18:00:00Z") },
    {completed: false, date: new Date("2025-01-07T22:00:00Z") },
    {  completed: true, date: new Date("2025-01-08T09:00:00Z") },
    {  completed: true, date: new Date("2025-01-09T08:00:00Z") },
    {completed: false, date: new Date("2025-01-10T06:30:00Z") }
  ];

  try {
    await HabitTracker.insertMany(habits);
    console.log('Sample data inserted successfully!');
  } catch (err) {
    console.error('Error inserting data:', err);
  }
}

insertSampleData();
