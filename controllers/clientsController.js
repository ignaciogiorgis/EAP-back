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

module.exports = {
  createClient,
};
