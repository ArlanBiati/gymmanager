const express = require('express')
const routes = express.Router()

const instructors = require('./instructors')

routes.get('/', function (req, res) {
  return res.redirect('instructors')
})

routes.get('/instructors', function (req, res) {
  return res.render('instructors/instructors')
})

routes.get('/instructors/create', function (req, res) {
  return res.render('instructors/createInstructors')
})

routes.get('/instructors/:id', instructors.show)

routes.get('/instructors/:id/edit', instructors.edit)

routes.post('/instructors', instructors.post)

routes.put('/instructors', instructors.put)

routes.delete('/instructors', instructors.delete)

routes.get('/members', function (req, res) {
  return res.render('members/members')
})

module.exports = routes
