const db = require("../models")
require('dotenv').config()
const User = db.User
const bcrypt = require('bcrypt')
const datatable = require('sequelize-datatables')

exports.findDataTale = async (req, res) => {
    // Mock Query
    req.body = {
        draw: "1",
        columns: [
          {
            data: "full_name",
            name: "",
            searchable: "true",
            orderable: "true",
            search: {
              value: "",
              regex: "false",
            },
          },
        ],
        order: [
          {
            column: "0",
            dir: "asc",
          },
        ],
        start: "0",
        length: "10",
        search: {
          value: "",
          regex: "false",
        },
        _: "1478912938246",
    }
    
    datatable(User, req.body)
        .then(data => {
            res.send({
                error: false,
                data,
                message: process.env.SUCCESS_RETRIEVE
            })
        })
}

// Create and Save a new User
exports.create = async (req, res) => {

    req.body.password = await bcrypt.hash(req.body.password, 10)
    
    User
        .create(req.body)
        .then(data => {
            User
                .findByPK(data.id, { include: ['created'] })
                .then(result => {
                    res.send({
                        error: false,
                        data: result,
                        message: process.env.SUCCESS_RETRIEVE
                    })
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
        .findAll({
            where: {
                status: 'Active'
            }
        })
        .then(data => {
            res.send({
                error: false,
                data
            })
        })
        .catch(err => {
            res.send({
                error: true,
                message: err.errors.map((e) => e.message)
            })
        })
}

// Find a single User with an id
exports.findOne = async (req, res) => {
    const id = req.params.id
    
    // SELECT BY ID
    User
        .findByPK(id)
        .then(data => {
            res.send({
                error: false,
                data,
                message: process.env.SUCCESS_RETRIEVE
            })
        })
        .catch(err => {
            res.send({
                error: true,
                data: [],
                message: err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG
            })
        })

    // SELECT-WHERE
    // User.findOne({ where: { first_name: "Aries" } })
    //   .then((data) => {
    //     res.send({
    //       error: false,
    //       data: data,
    //       message: [process.env.SUCCESS_RETRIEVED],
    //     })
    //   })
    //   .catch((err) => {
    //     res.status(500).send({
    //       error: true,
    //       data: [],
    //       message:
    //         err.errors.map((e) => e.message) || process.env.GENERAL_ERROR_MSG,
    //     })
    //   })

}

// Update a User by the id in the request
exports.update = async (req, res) => {
    const id = req.params.id
    req.body.full_name = ''
    
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    User
        .update(req.body, {
            where: {
                id
            }
        })
        .then(result => {
            console.log(result)
            if (result) {
                User
                    .findByPK(id)
                    .then(data => {
                        res.send({
                            error: false,
                            data,
                            message: process.env.SUCESS_UPDATE
                        })
                    })
            } else {
                res.send({
                    error: true,
                    data: [],
                    message: process.env.GENERAL_ERROR_MSG
                })
            }
        })
}

// Delete a User with the specified id in the request
exports.delete = async (req, res) => {
    const id = req.params.id

    const body = {status: 'Inactive'}

    User
        .update(body, {
            where: {
                id
            }
        })
        .then(result => {
            console.log(result)
            if (result) {
                User
                    .findByPK(id)
                    .then(data => {
                        res.send({
                            error: false,
                            data,
                            message: process.env.SUCESS_UPDATE
                        })
                    })
            } else {
                res.send({
                    error: true,
                    data: [],
                    message: process.env.GENERAL_ERROR_MSG
                })
            }
        })
}
