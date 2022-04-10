import { createRequire } from "module"
const require = createRequire(import.meta.url)

const mongoose = require("mongoose")


const users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    course: {
        type: Array
    }
})

const Users = mongoose.model('Users', users)

export default Users