const User = require("../models/user_models.js");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth.js");

const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = ""; 
var msg91 = require("msg91")("1", "1", "1");

async function login({ username, password }, callback) {
  const user = await User.findOne({ username });
  if (user != null) {
    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(username);
      return callback(null, { ...user.toJSON(), token });
    } else {
      return callback({
        message: "Geçersiz Kullancı Adı/Şifre!",
      });
    }
  } else {
    return callback({
      message: "Geçersiz Kullancı Adı/Şifre!",
    });
  }
}

async function register(params, callback) {
  if (params.username === undefined) {
    console.log(params.username);
    return callback(
      {
        message: "Kullanıcı Adı gerekli!",
      },
      ""
    );
  }

  const user = new User(params);
  user
    .save()
    .then((response) => {
      return callback(null, response);
    })
    .catch((error) => {
      return callback(error);
    });
}

async function createNewOTP(params, callback) {
  const otp = otpGenerator.generate(4, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const ttl = 5 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${params.phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
  const fullHash = `${hash}.${expires}`;

  console.log(`Tek kullanımlık şifreniz ${otp}. 5 dakika içinde sona erecek`);

  var otpMessage = `Sayın Müşterimiz, ${otp}, oturum açmanız için Tek Kullanımlık Şifreniz! (Tek kullanımlık şifreniz).`;

  msg91.send(`+90${params.phone}`, otpMessage, function (err, response) {
    console.log(response);
  });

  return callback(null, fullHash);
}

async function verifyOTP(params, callback) {
  let [hashValue, expires] = params.hash.split(".");
  let now = Date.now();
  if (now > parseInt(expires)) return callback("Tek kullanımlık şifrenizin Süresi Doldu");
  let data = `${params.phone}.${params.otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", key)
    .update(data)
    .digest("hex");
  if (newCalculatedHash === hashValue) {
    return callback(null, "Başarılı");
  }
  return callback("Geçersiz şifre");
}

module.exports = {
  login,
  register,
  createNewOTP,
  verifyOTP,
};
