const { Router } = require("express");
const multer = require("multer");

const UserController = require("./app/controllers/UserController");
const SessionController = require("./app/controllers/SessionController");
const FileController = require("./app/controllers/FileController");
const ProviderController = require("./app/controllers/ProviderController");
const NotificationController = require("./app/controllers/NotificationController");
const AvailableController = require("./app/controllers/AvailableController");

const authMiddleware = require("./app/middleware/auth");
const multerConfig = require("./config/multer");
const AppointmentController = require("./app/controllers/AppointmentController");
const ScheduleController = require("./app/controllers/ScheduleController");
const routes = new Router();
const upload = multer(multerConfig);

routes.get("/", (req, res) => {
  return res.json({
    Welcome: "It's the backend from GoBarber Aplication",
    visite: "https://gobarber.azurewebsites.net/",
  });
});

//Session
routes.post("/sessions", SessionController.store);

//User Crud
routes.post("/users", UserController.store);

routes.use(authMiddleware);

routes.put("/users", UserController.update);
routes.delete("/users", UserController.delete);

//File
routes.post("/files", upload.single("file"), FileController.store);

//Providers
routes.get("/providers", ProviderController.index);
routes.get("/providers/:providerId/available", AvailableController.index);

//Appointment
routes.get("/appointments", AppointmentController.index);
routes.post("/appointments", AppointmentController.store);
routes.delete("/appointments/:id", AppointmentController.delete);

//Schedule
routes.get("/schedule", ScheduleController.index);

/**
 * Notification
 */

routes.get("/notifications", NotificationController.index);
routes.put("/notifications/:id", NotificationController.update);

//test
routes.get("/dbTeste", async (req, res) => {
  const user = await User.create({
    name: "Joao",
    email: "jsao@jao.com",
    password_hash: "12345",
  });
  return res.json(user);
});

module.exports = routes;
