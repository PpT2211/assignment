import { createRequire } from "module"
const require = createRequire(import.meta.url)

const mongoose = require("mongoose")


const courses = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startdate: {
        type: String,
        required: true
    },
    enddate: {
        type: String,
        required: true
    },
    usersreg: {
        type: Array
    }
})

const Courses = mongoose.model('Courses', courses)

export default Courses