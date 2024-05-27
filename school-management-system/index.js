const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/school', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => console.error(error));
mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

// Define Schemas and Models
const Schema = mongoose.Schema;

// Teacher Schema
const teacherSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: Boolean, default: true }
});
const Teacher = mongoose.model("Teacher", teacherSchema);

// Class Schema
const classSchema = new Schema({
    standard: { type: String, required: true },
    section: { type: String, required: true },
    status: { type: Boolean, default: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" }
});
const Class = mongoose.model("Class", classSchema);

// Student Schema
const studentSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    parentName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const Student = mongoose.model("Student", studentSchema);

// Middleware for authentication
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretkey');
        const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!teacher) {
            throw new Error();
        }

        req.token = token;
        req.teacher = teacher;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Teacher Registration
app.post("/register/teacher", async (req, res) => {
    try {
        const { name, email, password, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const teacher = new Teacher({ name, email, password: hashedPassword, address });
        await teacher.save();
        const token = jwt.sign({ _id: teacher._id.toString() }, 'secretkey');
        res.status(201).send({ teacher, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Teacher Login
app.post("/login/teacher", async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await Teacher.findOne({ email });

        if (!teacher || !await bcrypt.compare(password, teacher.password)) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: teacher._id.toString() }, 'secretkey');
        res.send({ teacher, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Student Registration
app.post("/register/student", async (req, res) => {
    try {
        const { firstName, lastName, email, password, parentName, address, city, classId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const student = new Student({ firstName, lastName, email, password: hashedPassword, parentName, address, city, class: classId });
        await student.save();
        const token = jwt.sign({ _id: student._id.toString() }, 'secretkey');
        res.status(201).send({ student, token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get All Students
app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().populate('class');
        res.send(students);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Get a Single Student
app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('class');
        if (!student) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.send(student);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Update a Student
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).populate('class');
        if (!updatedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.send({ updatedStudent, message: "Student updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Delete a Student
app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).send({ message: "Student not found" });
        }
        res.send({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Start the server
app.listen(7000, () => {
    console.log("Server is running on port 7000");
});
