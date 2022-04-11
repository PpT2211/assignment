import { fileURLToPath } from "url"
import { createRequire } from "module"
import Courses from "./models/courses.js"
import Users from "./models/users.js"
const require = createRequire(import.meta.url)

const express = require("express")
const mongoose = require("mongoose")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')

const app = express()
const port = 3000
const path = require("path")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => {
        console.log("DB connected")
    })
    .catch((err) => {
        console.log(err)
    })
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')))
app.use(methodOverride('_method'))

//apparently you need to use this when you want to parse through the data we get from post requests
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
    console.log(`You're on port ${port}`)
})

// users

app.get("/users", async (req, res) => {
    const data = await Users.find({})
    res.render("users/home", { data })
})

app.get("/users/get/:id", async (req, res) => {
    const { id } = req.params
    const data = await Users.findById(id)
    if (data) {
        res.render("users/show", { p: data })
    } else {
        res.send("Data doesn't exist :(")
    }
})

app.get("/users/addUser", async (req, res) => {
    res.render("users/new")
})

app.post("/users/addUser", async (req, res) => {
    const newUser = new Users(req.body)
    newUser.save()
    res.redirect("/users")
})

app.get("/users/editUser/:id", async (req, res) => {
    const { id } = req.params
    const data = await Users.findById(id)
    res.render('users/edit', { p: data })
})

app.put("/users/editUser/:id", async (req, res) => {
    const { id } = req.params
    const updatedData = req.body
    const p = await Users.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true })
    res.redirect(`/users/get/${p._id}`)
})

app.get("/users/addCourse/:id", async (req, res) => {
    const { id } = req.params
    const data = await Users.findById(id)
    res.render("users/regcourse", { p: data })
})
app.post("/users/addCourse/:id", async (req, res) => {
    const { id } = req.params
    const { test } = req.body
    let courses = test.split(" ")
    const user = await Users.findById(id)
    user.course = user.course.concat(courses)
    var coursesSet = new Set(user.course);
    user.course = Array.from(coursesSet)

    for (let c of courses) {
        var data = await Courses.findOne({ title: `${c}` })
        data.usersreg.push(user.name)
        var userSet = new Set(data.usersreg);
        data.usersreg = Array.from(userSet)
        const crs = await Courses.findByIdAndUpdate(data.id, data, { runValidators: true, new: true })
        console.log(data.usersreg)
        console.log(data)
    }


    const p = await Users.findByIdAndUpdate(id, user, { runValidators: true, new: true })
    res.redirect(`/users/get/${p._id}`)
})


// courses

app.get("/", (req, res) => {
    res.redirect("/courses")
})

app.get("/courses", async (req, res) => {
    const data = await Courses.find({})
    res.render("courses/home", { data })
})

app.get("/courses/get/:id", async (req, res) => {
    const { id } = req.params
    const data = await Courses.findById(id)
    if (data) {
        const userData = []
        for (let user of data.usersreg) {
            userData.push(await Users.findOne({ name: user }))
        }
        res.render("courses/show", { p: data })
    } else {
        res.send("Data doesn't exist :(")
    }
})


app.get("/courses/addCourse", (req, res) => {
    res.render('courses/new')
})

app.post("/courses/addCourse", (req, res) => {
    const newCourse = new Courses(req.body)
    newCourse.save()
    res.redirect("/courses")
})

app.get("/courses/editCourse/:id", async (req, res) => {
    const { id } = req.params
    const data = await Courses.findById(id)
    res.render('courses/edit', { p: data })
})

app.put("/courses/editCourse/:id", async (req, res) => {
    const { id } = req.params
    const updatedData = req.body
    const p = await Courses.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true })
    res.redirect(`/courses/get/${p._id}`)
})

app.get("/courses/addUsers/:id", async (req, res) => {
    const { id } = req.params
    const data = await Courses.findById(id)
    res.render("courses/reguser", { p: data })
})
app.post("/courses/addUsers/:id", async (req, res) => {
    const { id } = req.params
    const { test } = req.body
    let users = test.split(" ")
    const course = await Courses.findById(id)
    course.usersreg = course.usersreg.concat(users)
    var usersSet = new Set(course.usersreg);
    course.usersreg = Array.from(usersSet)

    for (let u of users) {
        var data = await Users.findOne({ name: u })
        data.course.push(course.title)
        var courseSet = new Set(data.course);
        data.course = Array.from(courseSet)
        const p = await Users.findByIdAndUpdate(data.id, data, { runValidators: true, new: true })
    }

    const p = await Courses.findByIdAndUpdate(id, course, { runValidators: true, new: true })
    res.redirect(`/courses/get/${p._id}`)
})
