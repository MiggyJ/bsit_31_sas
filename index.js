// Import Modules
const express = require('express')
const dotenv = require('dotenv')
const db = require('./src/models')
const jwt = require('jsonwebtoken')


// Get config variables
dotenv.config()

db.sequelize
    .authenticate()
    .then(() => console.log('Connection has been established succesfully'))
    .catch(err => console.error('Unable to connect to database: ', err))

if(process.env.ALLOW_SYNC == 'true'){
    db.sequelize
        .sync({ alter: true })
        .then(() => console.log('Done updating database based on models'))
        .catch((err) => console.error(err))
}

// Initialize app
var app = express()

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Middleware
app.use((req, res, next) => {
    console.log('Request has been sent.')
    next()
})

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['Authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

// Routes
const userRoutes = require('./src/routes/user.routes')
const loginRoutes = require('./src/routes/login.routes')
app.use(`${process.env.API_VERSION}/user`, authenticateToken, userRoutes);
app.use(`${process.env.API_VERSION}/login`, loginRoutes);


app.get('/', (req, res) => {
    res.json({
        message: 'welcome to SAS API DEMO'
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})