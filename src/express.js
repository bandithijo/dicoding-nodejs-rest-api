const express = require('express');
const cors = require('cors');
const { getContacts, addContact, deleteContact } = require('./data');

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

// handle POST /contacts
app.post('/contacts', (request, response) => {
  const { name, email } = request.body;
  const id = addContact({ name, email });

  response.status(201).json({ success: true, data: id });
});

// handle GET /contacts
app.get('/contacts', (_, response) => {
  const contacts = getContacts();
  response.status(200).json({ success: true, data: { contacts } });
});

// handle DELETE /contacts/:id
app.delete('/contacts/:id', (request, response) => {
  const { id } = request.params;
  const deleted = deleteContact(id);
  if (deleted) {
    response.status(204).json({ success: true, data: id });
  } else {
    response.status(404).json({ success: false, error: 'Contact not found' });
  };
});

// handle 404
app.use((_, response) => {
  response.status(404).json({ success: false, error: 'Not Found' });
});

app.listen(PORT, () => {
  console.info(`Server listengin on http://localhost:${PORT}`);
});
