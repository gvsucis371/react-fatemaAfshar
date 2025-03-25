const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Add this to avoid favicon.ico 404
app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// In-memory data
let authors = [
  { id: 1, first: 'Sam', last: 'Iam', email: 'sam@aol.com' },
  { id: 2, first: 'Jane', last: 'Doe', email: 'jane@aol.com' },
];

const isValidEmail = (email) => /^[^@]+@[^@]+\.[^@]+$/.test(email);

app.get('/authors', (req, res) => {
  res.json(authors);
});

app.post('/authors', (req, res) => {
  const { first, last, email } = req.body;

  // Server-side validation
  if (!first || !last || !email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'All fields are required and email must be valid.' });
  }

  const exists = authors.find(a => a.email === email);
  if (exists) {
    return res.status(409).json({ error: 'Email already exists.' });
  }

  const newAuthor = { id: Date.now(), first, last, email };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

app.delete('/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  authors = authors.filter(a => a.id !== id);
  res.sendStatus(204);
});

app.put('/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { first, last, email } = req.body;

  if (!first || !last || !email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const index = authors.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Author not found' });

  // Check for duplicate email (excluding self)
  const duplicate = authors.find(a => a.email === email && a.id !== id);
  if (duplicate) return res.status(409).json({ error: 'Email already exists' });

  authors[index] = { id, first, last, email };
  res.json(authors[index]);
});

app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
