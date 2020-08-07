const User = require("../models/User");
const Notification = require("../schemas/Notification"); 

class NotificationController{
  async index(req,res){
    
    const checkUserProvider = await User.findOne({where:{ id: req.userId, provider: true}, attributes: ['name']});
    if(!checkUserProvider){
      return res.status(401).json({error: 'It only providers can load notification'});
    }

    const notifications = await Notification.find({
      user: req.userId,
    }).sort({createdAt: 'desc'}).limit(20);
    res.json(notifications);
  }
  async update(req, res){
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      {read: true},
      {new: true},
    );
    return res.json(notification);
  }
}
module.exports = new NotificationController();
