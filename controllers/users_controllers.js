const bcrypt = require("bcryptjs");
const userServices = require("../services/users_services.js");

exports.register = (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  userServices.register(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Başarılı",
      data: results,
    });
  });
};
exports.register = (req, res, next) => {
  const { password } = req.body;

  const salt = bcrypt.genSaltSync(10);

  req.body.password = bcrypt.hashSync(password, salt);

  userServices.register(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Başarılı",
      data: results,
    });
  });
};

exports.login = (req, res, next) => {
  const { username, password } = req.body;

  userServices.login({ username, password }, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Başarılı",
      data: results,
    });
  });
};

exports.userProfile = (req, res, next) => {
  return res.status(401).json({ message: "Yetkili!!" });
};


exports.otpLogin = (req, res, next) => {
  userServices.createNewOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Başarılı",
      data: results,
    });
  });
};

exports.verifyOTP = (req, res, next) => {
  userServices.verifyOTP(req.body, (error, results) => {
    if (error) {
      return next(error);
    }
    return res.status(200).send({
      message: "Başarılı",
      data: results,
    });
  });
};