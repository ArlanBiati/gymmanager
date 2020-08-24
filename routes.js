const express = require("express")
const routes = express.Router()




routes.get("/", function(req, res) {
    return res.redirect("instructors")
})

routes.get("/instructors", function(req, res) {
    return res.render("instructors/instructors")
})

routes.get("/instructors/create", function(req, res) {
    return res.render("instructors/createInstructors")
})

routes.post("/instructors", function(req, res) {

    

    return res.send("recebido")
})

routes.get("/members", function(req, res) {
    return res.render("members")
})




module.exports = routes