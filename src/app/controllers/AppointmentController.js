const Yup = require("yup");
const {
  startOfHour,
  parseISO,
  isBefore,
  format,
  differenceInHours,
} = require("date-fns");
const brazilLocale = require("date-fns/locale/pt-BR");

const Appointment = require("../models/Appointment");
const Notification = require("../schemas/Notification");
const User = require("../models/User");
const File = require("../models/File");
const Queue = require("../../lib/Queue");
const CancellationMail = require("../jobs/CancellationMail");

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      attributes: ["id", "date", "past", "cancelable"],
      order: ["date"],
      offset: (page - 1) * 20,
      limit: 20,
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "avatar",
              attributes: ["name", "url", "path"],
            },
          ],
        },
      ],
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const { date, provider_id } = req.body;

    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "validation fails" });
    }
    if (req.userId == provider_id) {
      return res
        .status(401)
        .json({ error: "user can not appointment with yourself" });
    }

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });
    if (!isProvider) {
      return res
        .status(400)
        .json({ error: "You can only create appointments with providers" });
    }

    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past dates are not permitted" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        date: hourStart,
        provider_id,
        canceled_at: null,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: "Appointment date is not available" });
    }

    const appointment = await Appointment.create({
      date,
      provider_id,
      user_id: req.userId,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formatedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h' ",
      { locale: brazilLocale }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"],
        },
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
    });

    if (!appointment) {
      return res.status(400).json({ error: "appointment doesn't exist" });
    }

    if (req.userId != appointment.user_id) {
      return res.status(400).json({ error: "you don't have permition" });
    }
    const dateLimit = differenceInHours(appointment.date, new Date());
    if (dateLimit < 2) {
      return res
        .status(401)
        .json({
          erro: "you can only cancel the appointment two hours advanced",
        });
    }
    //  appointment.update({canceled_at: new Date()}) // funcionou
    appointment.canceled_at = new Date(); //alternativa
    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
