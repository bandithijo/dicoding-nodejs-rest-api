const fastify = require('fastify');
const cors = require('@fastify/cors');
const { getContacts, addContact, deleteContact } = require('./data');

const PORT = 3000;

const app = fastify();
app.register(cors);

// handle POST /contacts
app.post('/contacts', (request, reply) => {
  const { name, email } = request.body;
  const id = addContact({ name, email });
  reply.send({ success: true, data: id }).code(201);
});

// handle GET /contacts
app.get('/contacts', (_, reply) => {
  const contacts = getContacts();
  reply.send({ success: true, data: { contacts } }).code(200);
});

// handle DELETE /contacts/:id
app.delete('/contacts/:id', (request, reply) => {
  const { id } = request.params;
  const deleted = deleteContact(id);
  if (deleted) {
    reply.send({ success: true, data: id }).code(204);
  } else {
    reply.send({ success: false, error: 'Contact not found' }).code(404);
  }
});

// handle 404
// automatic by hapi

app.listen({ port: PORT}, () => {
  console.info(`Server listening on http://localhost${PORT}`);
});
