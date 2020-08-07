const jwt = require("jsonwebtoken");
const Yup = require("yup");

const User = require("../models/User");
const authConfig = require("../../config/auth");
const File = require("../models/File");

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.json({ error: "validation fails" });

    const { email, password } = req.body;
    
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: "email or password don't match!" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "email or password don't match!" });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expires,
      }),
    });
  }
}

module.exports = new SessionController();
