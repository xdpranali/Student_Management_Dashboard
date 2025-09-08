import React, { useState, useEffect, useMemo } from "react";
import './App.css';

function App() {
  // Courses data - static list of available courses
  // useState initializes with hardcoded courses
  const [courses, setCourses] = useState([
    { id: 1, name: "HTML Basics" },
    { id: 2, name: "CSS Mastery" },
    { id: 3, name: "JavaScript Pro" },
    { id: 4, name: "React In Depth" },
  ]);

  // Students list state, initialized from localStorage if available
  // This allows data persistence across page reloads
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    return saved ? JSON.parse(saved) : [];
  });

  // useEffect to save students to localStorage whenever students state changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  // Form state to hold current input values for adding/editing a student
  const [form, setForm] = useState({
    id: null,           // null means adding new student; otherwise editing existing
    name: "",           // student name input
    email: "",          // student email input
    courseId: "",       // selected course id
    profileImage: "",   // URL string for profile image
  });

  // State to hold validation error messages for form fields
  const [formErrors, setFormErrors] = useState({});

  // Boolean flag to track if we are editing an existing student or adding new
  const [isEditing, setIsEditing] = useState(false);

  // Function to validate form inputs before submission
  // Returns an object with error messages for invalid fields
  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email.trim())
    ) {
      errors.email = "Invalid email address";
    }
    if (!form.courseId) errors.courseId = "Please select a course";
    if (form.profileImage.trim()) {
      // Optional: check if profileImage URL ends with a common image extension
      if (!/\.(jpeg|jpg|gif|png|bmp|webp|svg)$/i.test(form.profileImage.trim())) {
        errors.profileImage = "Profile image URL must end with an image extension";
      }
    }
    return errors;
  }

  // Handler for input changes in the form
  // Updates the corresponding field in form state
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handler for form submission (add or update student)
  function handleSubmit(e) {
    e.preventDefault();

    // Validate inputs and set errors if any
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return; // stop if errors exist

    if (isEditing) {
      // Update existing student in the list
      setStudents((prev) =>
        prev.map((stu) =>
          stu.id === form.id ? { ...form } : stu
        )
      );
    } else {
      // Add new student with a unique id (timestamp)
      setStudents((prev) => [
        ...prev,
        { ...form, id: Date.now() },
      ]);
    }

    // Reset form and editing state after submission
    setForm({ id: null, name: "", email: "", courseId: "", profileImage: "" });
    setIsEditing(false);
    setFormErrors({});
  }

  // Handler to populate form with existing student data for editing
  function handleEdit(student) {
    setForm(student);
    setIsEditing(true);
    setFormErrors({});
  }

  // Memoize the rendered list of students to optimize performance
  // Re-renders only when students or courses change
  const renderedStudents = useMemo(() => {
    return students.map((stu) => {
      // Find course name by matching courseId
      const courseName =
        courses.find((c) => c.id.toString() === stu.courseId.toString())
          ?.name || "Unknown";

      return (
        <article key={stu.id} className="student-card">
          {/* Display profile image or placeholder if missing */}
          <img
            src={
              stu.profileImage ||
              "https://via.placeholder.com/80?text=No+Image"
            }
            alt={`${stu.name}'s profile`}
            className="profile-image"
            onError={(e) => {
              // Fallback to placeholder if image URL is broken
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/80?text=No+Image";
            }}
          />
          <div className="student-info">
            <h3>{stu.name}</h3>
            <p>Email: {stu.email}</p>
            <p>Course: {courseName}</p>
            <button onClick={() => handleEdit(stu)}>Edit</button>
          </div>
        </article>
      );
    });
  }, [students, courses]);

  return (
    <div className="container">
      <header>
        <h1>Student Management Dashboard</h1>
      </header>

      <main>
        <section className="form-section">
          <h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
          <form onSubmit={handleSubmit} noValidate>
            {/* Name input */}
            <label htmlFor="name">
              Name<span aria-hidden="true">*</span>:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              aria-invalid={!!formErrors.name}
              aria-describedby="name-error"
              required
            />
            {formErrors.name && (
              <span id="name-error" className="error">
                {formErrors.name}
              </span>
            )}

            {/* Email input */}
            <label htmlFor="email">
              Email<span aria-hidden="true">*</span>:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!formErrors.email}
              aria-describedby="email-error"
              required
            />
            {formErrors.email && (
              <span id="email-error" className="error">
                {formErrors.email}
              </span>
            )}

            {/* Course selection */}
            <label htmlFor="courseId">
              Enrolled Course<span aria-hidden="true">*</span>:
            </label>
            <select
              id="courseId"
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              aria-invalid={!!formErrors.courseId}
              aria-describedby="course-error"
              required
            >
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            {formErrors.courseId && (
              <span id="course-error" className="error">
                {formErrors.courseId}
              </span>
            )}

            {/* Profile image URL input */}
            <label htmlFor="profileImage">Profile Image URL:</label>
            <input
              id="profileImage"
              name="profileImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.profileImage}
              onChange={handleChange}
              aria-invalid={!!formErrors.profileImage}
              aria-describedby="profileImage-error"
            />
            {formErrors.profileImage && (
              <span id="profileImage-error" className="error">
                {formErrors.profileImage}
              </span>
            )}

            {/* Submit button */}
            <button type="submit">{isEditing ? "Update" : "Add"} Student</button>

            {/* Cancel button shown only when editing */}
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  // Reset form and editing state on cancel
                  setIsEditing(false);
                  setForm({ id: null, name: "", email: "", courseId: "", profileImage: "" });
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        {/* Students list section */}
        <section className="list-section">
          <h2>Students List</h2>
          {students.length === 0 ? (
            <p>No students added yet.</p>
          ) : (
            <div className="students-grid">{renderedStudents}</div>
          )}
        </section>
      </main>

      <footer>
        <p>© 2025 Student Management Dashboard</p>
      </footer>
    </div>
  );
}

export default App;
