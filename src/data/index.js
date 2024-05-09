const crypto = require('node:crypto');

const contacts = [];

const getContacts = () => {
  return contacts;
};

const addContact = ({ name, email }) => {
  const id = crypto.randomUUID();
  contacts.push({ id, name, email });
  return id;
};

const deleteContact = (id) => {
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  };

  contacts.splice(id, 1);
  return true;
};

module.exports = { getContacts, addContact, deleteContact };
