const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/loginDB', { useNewUrlParser: true, useUnifiedTopology: true });

// User schema and model
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// Serve login page
// Serve login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Register route
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
        });

        await newUser.save(); // Use await to handle the save operation
        res.redirect('/incusense');
    } catch (err) {
        console.log(err);
        if (err.code === 11000) { // Duplicate username error
            res.send('Username already exists.');
        } else {
            res.send('Error registering user.');
        }
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.redirect('/incusense'); // Redirect to IncuSense page after successful login
        } else {
            res.send('Invalid username or password.');
        }
    } catch (err) {
        console.log(err);
        res.send('Error logging in.');
    }
});

// Serve IncuSense monitor page
app.get('/incusense', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'incusense.html'));
});
// `mongodb+srv://akshay:undr803hy4@aks.9adguzt.mongodb.net/?retryWrites=true&w=majority&appName=aks`
// 'mongodb+srv://cris969701:YGw4gR8UQ0SwdIC5@cluster.pg1kq.mongodb.net/?retryWrites=true&w=majority&appName=cluster'
// Start server
mongoose
  .connect(
    `mongodb+srv://cris969701:YGw4gR8UQ0SwdIC5@cluster.pg1kq.mongodb.net/?retryWrites=true&w=majority&appName=cluster`
  )
  .then(() =>
    app.listen(3000, () =>
      console.log("Connected To Database And Server is running")
    )
  )
  .catch((e) => console.log(e));