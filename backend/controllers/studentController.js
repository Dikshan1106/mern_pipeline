const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ createdBy: req.userId }).populate('createdBy', 'username email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'username email');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if (student.createdBy._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to view this student' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create student
exports.createStudent = async (req, res) => {
  try {
    const { rollNumber, firstName, lastName, email, phone, dateOfBirth, gender, address, class: studentClass, cgpa, status } = req.body;

    // Validation
    if (!rollNumber || !firstName || !lastName || !email || !phone || !dateOfBirth || !gender || !address || !studentClass) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ error: 'Roll number already exists' });
    }

    const student = new Student({
      rollNumber,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      class: studentClass,
      cgpa: cgpa || 0,
      status: status || 'Active',
      createdBy: req.userId,
    });

    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this student' });
    }

    const { rollNumber, firstName, lastName, email, phone, dateOfBirth, gender, address, class: studentClass, cgpa, status } = req.body;

    // Check if roll number is being changed and if new roll number already exists
    if (rollNumber && rollNumber !== student.rollNumber) {
      const existingStudent = await Student.findOne({ rollNumber });
      if (existingStudent) {
        return res.status(400).json({ error: 'Roll number already exists' });
      }
    }

    if (rollNumber) student.rollNumber = rollNumber;
    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (email) student.email = email;
    if (phone) student.phone = phone;
    if (dateOfBirth) student.dateOfBirth = dateOfBirth;
    if (gender) student.gender = gender;
    if (address) student.address = address;
    if (studentClass) student.class = studentClass;
    if (cgpa !== undefined) student.cgpa = cgpa;
    if (status) student.status = status;

    await student.save();
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (student.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this student' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
