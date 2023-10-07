require("dotenv/config");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mercadopago = require("mercadopago");
const connectDB = require('./database.js');
const ItemController = require('./controllers/ItemController.js');
const UserController = require("./controllers/UserController");
const LoginController = require("./controllers/LoginController");
const images = require("./configs/multer.js");

connectDB();

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "images")));

app.post("/configureMercadoPago", (req, res) => {
  const accessToken = req.body.accessToken;

  mercadopago.configure({
    access_token: accessToken,
  });

  res.sendStatus(200);
});
// Routes
app.get("/", (req, res)=> [res.send('Hello World!')]);
app.put("/updateuser/:username", UserController.editUser);
app.put("/updateitem/:id", ItemController.update);
app.delete("/deleteuser/:username", UserController.deleteUser);
app.delete("/deleteitem/:id", ItemController.destroy);
app.get("/user/:username", UserController.getUserByUsername);
app.get("/searchItem/:id", ItemController.searchItem);
app.get("/loaditems/", ItemController.index);
app.post("/login", LoginController.login);
app.post("/cadastro", UserController.createUser);
app.post("/createitem/:userId", images.single("file"), ItemController.create);
app.post("/createorder", (req, res) => {
    // Mandando para API
    let preference = {
      items: [
        {
          title: req.body.description,
          unit_price: Number(req.body.price),
          quantity: Number(req.body.quantity),
        },
      ],
      back_urls: {
        success: "https://backendbee.vercel.app/",
        failure: "https://tdiascontato.vercel.app",
        pending: "",
      },
      auto_return: "approved",
    };

    mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

// Canal Servidor
app.listen(process.env.PORT, () => {
    console.log(`Estamos rodando em https://backendbee.vercel.app:${process.env.PORT}/`);
});
