const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const registerRoute = require('./routes/regst'); 
const loginRoute = require('./routes/login');
const subscribeRoute = require('./routes/subscribe'); // Subscribe route
const usersubscribeRoute = require('./routes/usersubscriber');
const donationRoute = require('./routes/donationr'); // Include donation route
const userdonationRoute = require('./routes/userdonationRoute'); // Include donation route

app.use(session({
    secret: '2f8d5c4b8b4eaa68c5b8c3b5a7e4d7f4b2e1e5c8f5f8e9f6a2e8e9f4b3c4a2e1',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    if (req.session.Name) {
        res.redirect('/userindex');
    } else {
        res.redirect('/index');
    }
});
app.get('/s', (req, res) => {
    if (req.session.Name) {
        res.redirect('/usersubscriber');
    } else {
        res.redirect('/subscribe');
    }
});

app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/s', subscribeRoute); // Updated
app.use('/user', usersubscribeRoute);
app.use('/d', donationRoute); // New donation route
app.use('/duser', userdonationRoute); // New donation route

const loadUsers = () => {
    const dataPath = path.join(__dirname, 'data', 'users.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        req.session.Name = user.name;
        res.redirect('/userindex');
    } else {
        res.status(401).send('Invalid email or password');
    }
});

app.get('/index', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/visit', (req, res) => {
    res.render('visit');
});

app.get('/job', (req, res) => {
    res.render('job');
});

app.get('/contact', (req, res) => {
    res.render('cont');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/reg', (req, res) => {
    res.render('reg');
});

app.get('/donation', (req, res) => {
    res.render('donation');  
});

app.get('/userindex', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/userindex', { name });
});

app.get('/usersubscriber', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session?.Name || 'Guest';
    res.render('user/userindex', { name });
});

app.get('/usercontact', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/usercont', { name });
});

app.get('/userjob', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/userjob', { name });
});
app.get('/userdonation', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/userdonation', { name });
});

app.get('/userabout', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/userabout', { name });
});

app.get('/dashboard', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }

    const users = loadUsers();
    const user = users.find(u => u.name === req.session.Name); 

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Pass user details to the Pug template
    res.render('user/dashboard', { user });
});

app.get('/uservisit', (req, res) => {
    if (!req.session.Name) {
        return res.redirect('/login');
    }
    const name = req.session.Name;
    res.render('user/uservisit', { name });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/userindex');
        }
        res.redirect('/index');
    });
});

app.listen(4747, () => {
    console.log('Server is running on port 4747 link:http://localhost:4747');
});
