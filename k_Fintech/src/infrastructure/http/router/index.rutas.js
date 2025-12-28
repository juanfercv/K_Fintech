const express = require("express");
const router = express.Router()

const { Mostrar } = require ('../controller/index.controller')

router.get('/', Mostrar)

module.exports = router