const http = require('node:http');
const { getContacts, addContact, deleteContact } = require('./data');

const PORT = 3000;

function requestListener(request, response) {
  const { method, url } = request;

  const headers = {
    'Content-Type': 'application/json',
    // enable CORS
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*',
  };

  // handle preflight request
  if (method === 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  };

  // handle POST /contacts
  if (method === 'POST' && url === '/contacts') {
    let body = '';
    // collect request body
    request.on('data', (chunk) => {
      body += chunk.toString();
    });

    //parse request body and add contact
    request.on('end', () => {
      const { name, email } = JSON.parse(body);
      const id = addContact({ name, email });
      response.writeHead(201, headers);
      response.end(JSON.stringify({ success: true, data: id }));
    });

    return;
  };

  // handle GET /contacts
  if (method === 'GET' && url === '/contacts') {
    const contacts = getContacts();
    response.writeHead(200, headers);
    response.end(JSON.stringify({ success: true, data: { contacts } }));
    return;
  };

  // handle DELETE /contacts/:id
  if (method === 'DELETE' && url.startsWith('/contacts/')) {
    const id = url.replace('/contacts/', '');
    const deleted = deleteContact(id);
    if (deleted) {
      response.writeHead(204, headers);
      response.end(JSON.stringify({ success: true, data: id }));
    } else {
      response.writeHead(404, headers);
      response.end(JSON.stringify({ success: false, error: 'Contact not found' }));
    };

    return;
  };

  // handle 404
  response.writeHead(404, headers);
  response.end(JSON.stringify({ success: false, error: 'Not found' }));
};

const server = http.createServer(requestListener);

server.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`);
});
