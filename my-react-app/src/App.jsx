import React, { useEffect, useState } from 'react';
import './index.css';

const App = () => {
  // React state variables:
  // - authors: the list of author objects fetched from the API
  // - form: current input form values (used for create and edit)
  // - error: used to store and display error messages
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ first: '', last: '', email: '', id: null });
  const [error, setError] = useState('');

  // API base URL for backend
  const apiUrl = 'http://localhost:3001/authors';


  // useEffect hook to load authors list from the API when the component mounts
  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => setAuthors(data));
  }, []);

  // Updates the form state when user types in the input fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  // Validates the form:
  // - ensures all fields are filled
  // - checks if the email format is valid
  const validateForm = () => {
    if (!form.first || !form.last || !form.email) {
      setError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format.');
      return false;
    }
    setError('');
    return true;
  };

  // Handles both Create and Update operations depending on whether form.id exists
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${apiUrl}/${form.id}` : apiUrl;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      // Handle duplicate email error
      if (res.status === 409) {
        setError('Email already exists.');
        return;
      } else if (!res.ok) {
        const result = await res.json();
        setError(result.error || 'Something went wrong.');
        return;
      }

      const updatedAuthor = await res.json();

      // Update local state depending on whether it was a create or update
      if (form.id) {
        setAuthors(authors.map(a => a.id === form.id ? updatedAuthor : a));
      } else {
        setAuthors([...authors, updatedAuthor]);
      }

      // Reset the form and error state
      setForm({ first: '', last: '', email: '', id: null });
      setError('');
    } catch (err) {
      setError('Failed to connect to server.');
    }
  };

  const handleEdit = (author) => {
    setForm(author);
  };

  // Deletes an author by ID using the DELETE method
  const handleDelete = async (id) => {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };

  // Renders the main UI:
  // - Form section for creating/editing authors
  // - Table that displays all authors with Edit/Delete actions
  return (
    <div className="container">
      <h2>Authors</h2>

      <div className="form-box">
        <label>First Name</label>
        <input name="first" value={form.first} onChange={handleChange} placeholder="First Name" />

        <label>Last Name</label>
        <input name="last" value={form.last} onChange={handleChange} placeholder="Last Name" />

        <label>Email address</label>
        <input name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />

        <button onClick={handleSubmit}>{form.id ? 'Update' : 'Create'}</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <table>
        <thead>
          <tr>
            <th>First Name</th><th>Last Name</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.first}</td>
              <td>{author.last}</td>
              <td>{author.email}</td>
              <td>
                <button onClick={() => handleEdit(author)}>Edit</button>
                <button onClick={() => handleDelete(author.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;


