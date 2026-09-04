const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const validateOrder = require('../validators/orderValidator');

// validate payload before controller
router.post('/', validateOrder, orderController.createOrder);
router.get('/:id', orderController.getOrderById);

module.exports = router;
