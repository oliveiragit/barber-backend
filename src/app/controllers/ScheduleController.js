const { startOfDay, parseISO, endOfDay } = require("date-fns");
const appointments = require("../models/Appointment");
const User = require("../models/User");
const { Op } = require("sequelize");

class ScheduleController {
  async index(req, res) {
    const provider_id = req.userId;
    const checkUserProvider = await User.findOne({
      where: {
        provider: true,
        id: provider_id,
      },
    });
    const { date } = req.query;
    const parsedDate = parseISO(date);

    if (!checkUserProvider) {
      return res.status(401).json({ error: "User is not a provider" });
    }

    const list = await appointments.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    return res.json(list);
  }
}

module.exports = new ScheduleController();
