const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const {
  loadContact,
  findContact,
  addContact,
  duplicateCheck,
  deleteContact,
  updateContacts,
} = require("./utils/contacts");
const { redirect } = require("express/lib/response");
const { body, validationResult, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

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
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Tambah Kontak",
    layout: "layouts/main-layout",
    errors: [],
  });
});

app.post(
  "/contact",
  [
    body("phoneNumber").custom((value) => {
      const duplicate = duplicateCheck(value);
      if (duplicate) {
        throw new Error("Nomor HP sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("phoneNumber", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Tambah Kontak",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash("msg", "Kontak berhasil disimpan");
      res.redirect("/contact");
    }
  }
);

app.get("/contact/delete/:phoneNumber", (req, res) => {
  const contact = findContact(req.params.phoneNumber);

  if (!contact) {
    return res.status(404).send("Kontak tidak ditemukan");
  } else {
    deleteContact(req.params.phoneNumber);
    req.flash("msg", "Kontak berhasil dihapus");
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:phoneNumber", (req, res) => {
  const contact = findContact(req.params.phoneNumber);

  res.render("edit-contact", {
    title: "Ubah Kontak",
    layout: "layouts/main-layout",
    contact,
    errors: [],
  });
});

app.post(
  "/contact/update",
  [
    body("phoneNumber").custom((value, { req }) => {
      const duplicate = duplicateCheck(value);
      if (value !== req.body.oldPhoneNumber && duplicate) {
        throw new Error("Nomor HP sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid").isEmail(),
    check("phoneNumber", "Nomor HP tidak valid").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Ubah Kontak",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash("msg", "Kontak berhasil diubah");
      res.redirect("/contact");
    }
  }
);

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
