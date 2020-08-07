const Yup = require("yup");

const User = require("../models/User");
const File = require("../models/File");

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(2).required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) return res.status(400).json({ error: "email in use" });

    const { name, email, provider } = await User.create(req.body);

    return res.json({ name, email, provider });
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().min(2).required(),
      email: Yup.string().email().required(),
      oldPassword: Yup.string()
        .min(6)
        .when("password", (password, field) =>
          password ? field.required() : field
        ),
      password: Yup.string().min(6),
      confirmPassword: Yup.string()
        .min(6)
        .when("password", (password, field) =>
          password ? field.required().oneOf([Yup.ref("password")]) : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }

    const { email, oldPassword, password } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) return res.json({ error: "Token expirated" });

    if (email && email != user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) return res.status(400).json({ error: "email in use" });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return res.status(400).json({ error: "password doesn't match" });

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: {
        model: File,
        as: "avatar",
        attributes: ["id", "url", "path"],
      },
    });
    return res.json({ id, name, email, avatar });
  }
  async delete(req, res) {
    const { id } = req.body;

    const user = await User.findOne({ where: { id } });

    if (!user) return res.status(401).json({ error: "user doesn't exist" });

    await user.destroy();

    const { name, email } = user;
    return res.json({ sucess: "deleted", name, email });
  }
}

module.exports = new UserController();
