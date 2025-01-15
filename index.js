const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const port =3000;


dotenv.config();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies before using them



app.set('view engine', 'ejs');
// Database connection
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000}, )
  .then(() => console.log('Database connected'))
   .catch(err => console.error('Database connection error:', err));


app.use('/facialExpression', require('./routes/facialExpression')); // Protect activity routes
app.use('/medRecommend', require('./routes/medRecommend')); // Protect activity routes
 app.use('/profile', require('./routes/profile')); // Protect activity routes

app.get('/', (req, res) => {
  res.redirect("/facialExpression")
});
app.get('/about', (req, res) => {
  res.render('about');
} )
app.get('/contact', (req, res) => { 
  res.render('ko')
})



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});