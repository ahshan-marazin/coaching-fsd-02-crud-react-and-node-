import { useEffect, useState } from 'react'
import {getStudents,createStudent,updateStudent, deleteStudent} from './services/api'
import './App.css'

function App() {
  // States
  const [students, setStudents] = useState([])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [course, setCourse] = useState('')

  const [editId, setEditId] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // GET Students
  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    try {
      setLoading(true)

      const data = await getStudents()

      setStudents(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Add / Update Student
  async function handleSubmit(e) {
    e.preventDefault()

    const student = {
      name,
      email,
      course
    }

    try {
      setSaving(true)
      setError('')

      if (editId) {
        await updateStudent(editId, student)
      } else {
        await createStudent(student)
      }

      // Clear Form
      setName('')
      setEmail('')
      setCourse('')
      setEditId(null)

      // Refresh Student List
      await loadStudents()
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // Edit Student
  function handleEdit(student) {
    setEditId(student._id)

    setName(student.name)
    setEmail(student.email)
    setCourse(student.course)

    setError('')
  }

  // Cancel Edit
  function handleCancel() {
    setEditId(null)

    setName('')
    setEmail('')
    setCourse('')

    setError('')
  }

  // Delete Student
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this student?'
    )

    if (!confirmDelete) return

    try {
      setError('')

      await deleteStudent(id)

      setStudents(current => current.filter(student => student._id !== id))

      if (editId === id) {
        handleCancel()
      }
    } catch (error) {
      setError(error.message)
    }
  }

  // UI
  return (
    <main className='container'>
      <header className='header'>
        <h1>Student Management System</h1>
        <p>Manage your student records</p>
      </header>

      {/* Error Message */}

      {error && <div className='error'>{error}</div>}

      {/* Student Form */}

      <section className='card'>
        <h2>{editId ? 'Update Student' : 'Add New Student'}</h2>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Name</label>

            <input
              type='text'
              placeholder='Enter student name'
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label>Email</label>

            <input
              type='email'
              placeholder='Enter student email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label>Course</label>

            <input
              type='text'
              placeholder='Enter course name'
              value={course}
              onChange={e => setCourse(e.target.value)}
              required
            />
          </div>

          <div className='form-actions'>
            <button type='submit' className='primary-btn' disabled={saving}>
              {saving ? 'Saving...' : editId ? 'Update Student' : 'Add Student'}
            </button>

            {editId && (
              <button
                type='button'
                className='cancel-btn'
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Student List */}

      <section className='card'>
        <div className='list-header'>
          <h2>Student List</h2>

          <span>{students.length} Students</span>
        </div>

        {loading ? (
          <p className='message'>Loading students...</p>
        ) : students.length === 0 ? (
          <p className='message'>No students found.</p>
        ) : (
          <div className='table-container'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>

                    <td>{student.email}</td>

                    <td>{student.course}</td>

                    <td>
                      <div className='actions'>
                        <button
                          className='edit-btn'
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className='delete-btn'
                          onClick={() => handleDelete(student._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
