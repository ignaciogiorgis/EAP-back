const { check, validationResult } = require("express-validator");
const { generarId, generarJWT } = require("../helpers/tokens.js");
const { emailRegister, emailRecover } = require("../helpers/emails.js");
const Client = require("../models/Client.js");

const createClient = async (req, res) => {
  await check("firstName")
    .notEmpty()
    .withMessage("The firstName cannot be empty")
    .run(req);
  await check("lastName")
    .notEmpty()
    .withMessage("The lastName cannot be empty")
    .run(req);
  await check("email")
    .notEmpty()
    .isEmail()
    .withMessage("The email is not correct")
    .run(req);
  await check("address")
    .notEmpty()
    .withMessage("The address cannot be empty")
    .run(req);
  await check("birthday")
    .notEmpty()
    .withMessage("The birthday cannot be empty")
    .isDate()
    .run(req);
  await check("dni").notEmpty().withMessage("The dni cannot be empty").run(req);
  await check("phone")
    .notEmpty()
    .withMessage("The phone cannot be empty")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      error: result.array(),
      client: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        birthday: req.body.birthday,
        dni: req.body.dni,
        phone: req.body.phone,
      },
    });
  }

  const { firstName, lastName, email, address, birthday, dni, phone } =
    req.body;

  const { userId } = req.user;

  const clientExist = await Client.findOne({ where: { dni } });
  if (clientExist) {
    return res.status(400).json({
      error: "The client is already registered",
      user: { firstName, email },
    });
  }

  const client = await Client.create({
    firstName,
    lastName,
    email,
    address,
    birthday,
    dni,
    phone,
    usuarioId: userId,
  });

  // Enviar email de confirmación
  //  emailRegister({
  //    name: user.name,
  //    email: user.email,
  //    token: user.token,
  //  });

  return res.status(201).json({
    message: "Client created successfully.",
    client: {
      id: client.id,
      firstName: client.firstName,
      email: client.email,
      lastName: client.lastName,
      email: client.email,
      address: client.address,
      birthday: client.birthday,
      dni: client.dni,
      phone: client.phone,
    },
  });
};

const showClients = async (req, res) => {
  const { userId } = req.user;
  try {
    const clients = await Client.findAll({
      where: {
        isDeleted: false,
        usuarioId: userId,
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error obtaining clients:", error);
    res
      .status(500)
      .json({ error: "There was a problem obtaining the clients" });
  }
};

const editClient = async (req, res) => {
  await check("firstName")
    .notEmpty()
    .withMessage("The firstName cannot be empty")
    .run(req);
  await check("lastName")
    .notEmpty()
    .withMessage("The lastName cannot be empty")
    .run(req);
  await check("email")
    .notEmpty()
    .isEmail()
    .withMessage("The email is not correct")
    .run(req);
  await check("address")
    .notEmpty()
    .withMessage("The address cannot be empty")
    .run(req);
  await check("birthday")
    .notEmpty()
    .withMessage("The birthday cannot be empty")
    .isDate()
    .run(req);
  await check("dni").notEmpty().withMessage("The dni cannot be empty").run(req);
  await check("phone")
    .notEmpty()
    .withMessage("The phone cannot be empty")
    .run(req);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ error: result.array() });
  }

  const { id } = req.params;
  const { firstName, lastName, email, address, birthday, dni, phone } =
    req.body;
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: "Client not Found" });
    }
    if (Number(client?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to edit this Client" });
    }

    await client.update({
      firstName: firstName ?? client.firstName,
      email: email ?? client.email,
      lastName: lastName ?? client.lastName,
      email: email ?? client.email,
      address: address ?? client.address,
      birthday: birthday ?? client.birthday,
      dni: dni ?? client.dni,
      phone: phone ?? client.phone,
    });

    return res.status(200).json({
      message: "Client updated correctly",
      client,
    });
  } catch (error) {
    console.error("Error updating Client:", error);
    return res
      .status(500)
      .json({ error: "There was a problem updating the Client" });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca el gasto por su ID
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    if (Number(client?.dataValues?.usuarioId) !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this client" });
    }

    // Actualiza el campo `isDeleted` a true
    await client.update({ isDeleted: true });

    res.status(200).json({ message: "client deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createClient,
  showClients,
  deleteClient,
  editClient,
};
