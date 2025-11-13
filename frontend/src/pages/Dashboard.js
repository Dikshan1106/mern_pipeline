import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../api/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    class: '',
    cgpa: '0',
    status: 'Active',
  });

  const navigate = useNavigate();
  const { token, logout, user } = useAuth();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents(token);
      setStudents(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch students');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStudent(editingId, formData, token);
        setError('');
      } else {
        await createStudent(formData, token, token);
        setError('');
      }
      resetForm();
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      rollNumber: student.rollNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth.split('T')[0],
      gender: student.gender,
      address: student.address,
      class: student.class,
      cgpa: student.cgpa,
      status: student.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id, token);
        fetchStudents();
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete student');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'Male',
      address: '',
      class: '',
      cgpa: '0',
      status: 'Active',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Student Management System</h1>
          <div className="nav-items">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Students</h2>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Add Student'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="form-container">
            <h3>{editingId ? 'Edit Student' : 'Add New Student'}</h3>
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-row">
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="Roll Number"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="class"
                  placeholder="Class"
                  value={formData.class}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="number"
                  name="cgpa"
                  placeholder="CGPA"
                  step="0.01"
                  min="0"
                  max="4"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Add'} Student
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="students-list">
          {students.length === 0 ? (
            <p>No students found. Add one to get started!</p>
          ) : (
            <table className="students-table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.rollNumber}</td>
                    <td>
                      {student.firstName} {student.lastName}
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.class}</td>
                    <td>{student.cgpa.toFixed(2)}</td>
                    <td>
                      <span className={`status ${student.status.toLowerCase()}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(student)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
