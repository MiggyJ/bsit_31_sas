const db = require("../models")
const User = db.User
const bcrypt = require('bcrypt')

// Create and Save a new User
exports.create = async (req, res) => {

    req.body.password = await bcrypt.hash(req.body.password, 10)
    
    User
        .create(req.body)
        .then(data => {
            res.send({
                error: false,
                data
            })
        })
        .catch((err, data) => {
            res.send({
                error: true,
                data,
                message: err
            })
        })
}

// Retrieve all User from the database.
exports.findAll = async (req, res) => {
    User
        .findAll()
        .then(data => {
            res.send({
                error: false,
                data
            })
        })
        .catch(err => {
            res.send({
                error: true,
                message: err.errors.message
            })
        })
}

// Find a single User with an id
exports.findOne = async (req, res) => {}

// Update a User by the id in the request
exports.update = async (req, res) => {}

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {}
