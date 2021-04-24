const router = require('express').Router()
const userController = require('../controllers/user.controller')

router.post('/', userController.create)
router.get('/datatable', userController.findDataTale)
router.get('/', userController.findAll)
router.get('/:id', userController.findOne)
router.put('/:id', userController.update)
router.delete('/:id', userController.delete)

module.exports = router