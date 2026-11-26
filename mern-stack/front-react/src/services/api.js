
const API_URL = 'http://localhost:3001'

// GET - Get All Students
export async function getStudents() {
  const response = await fetch(`${API_URL}/students`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch students')
  }

  return data
}

// POST - Create Student
export async function createStudent(student) {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create student')
  }

  return data
}

// PUT - Update Student
export async function updateStudent(id, student) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update student')
  }

  return data
}

// DELETE - Delete Student
export async function deleteStudent(id) {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE'
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete student')
  }

  return data
}
