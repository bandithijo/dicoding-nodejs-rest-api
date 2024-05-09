const hapi = require('@hapi/hapi');
const { getContacts, addContact, deleteContact } = require('./data');

const init = async () => {
  const server = hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([
    // handle POST /contacts
    {
      method: 'POST',
      path: '/contacts',
      handler: (request, h) => {
        const { name, email } = request.payload;
        const id = addContact({ name, email });
        return h.response({ success: true, data: id }).code(201);
      },
    },
    // handle GET /contacts
    {
      method: 'GET',
      path: '/contacts',
      handler: (_, h) => {
        const contacts = getContacts();
        return h.response({ success: true, data: { contacts } }).code(200);
      },
    },
    // handle DELETE /contacts/:id
    {
      method: 'DELETE',
      path: '/contacts/{id}',
      handler: (request, h) => {
        const { id } = request.params;
        const deleted = deleteContact(id);
        if (deleted) {
          return h.response({ success: true, data: id }).code(204);
        } else {
          return h.response({ success: false, error: 'Contact not found' });
        };
      },
    },
    // handle 404
    // automatic by hapi
  ])

  await server.start();
  console.info(`Server listening on ${server.info.uri}`);
};

init();
