const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { loadContact, findContact } = require("./utils/contacts");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home", layout: "layouts/main-layout" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", layout: "layouts/main-layout" });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: "Contact",
    layout: "layouts/main-layout",
    contacts,
  });
});

app.get("/contact/:phoneNumber", (req, res) => {
  const contact = findContact(req.params.phoneNumber);
  res.render("detail", {
    title: "Contact Detail",
    layout: "layouts/main-layout",
    contact,
  });
});

app.use((req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`example app listening at https://localhost:${port}`);
});
