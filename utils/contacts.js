const fs = require("fs");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const findContact = (phoneNumber) => {
  const contacts = loadContact();
  const contact = contacts.find(
    (contact) => contact.phoneNumber === phoneNumber
  );
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

const duplicateCheck = (phoneNumber) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.phoneNumber === phoneNumber);
};

const deleteContact = (phoneNumber) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter(
    (contact) => contact.phoneNumber !== phoneNumber
  );
  saveContacts(filteredContacts);
};

const updateContacts = (newContact) => {
  const contacts = loadContact();

  const filteredContacts = contacts.filter(
    (contact) => contact.phoneNumber !== newContact.oldPhoneNumber
  );

  delete newContact.oldPhoneNumber;

  filteredContacts.push(newContact);

  saveContacts(filteredContacts);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  duplicateCheck,
  deleteContact,
  updateContacts,
};
