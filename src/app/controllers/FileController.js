const File = require ('../models/File');
const User = require('../models/User');

class FileController {
  async store (req, res) {
    const {originalname: name, filename: path} = req.file;
     const file = await File.create({name, path})
     const user = await User.findByPk(req.userId);
     user.update({avatar_id: file.id});
    return res.json(file);
  }
}
module.exports = new FileController();