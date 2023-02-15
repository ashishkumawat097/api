const httpStatus = require("http-status-codes");
const responseManagement = require("../lib/responseManagement");
const messages = require("../helper/message.json");
const User = require("../models/users");

// User Register
module.exports.registerUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      responseManagement.sendResponse(
        res,
        httpStatus.BAD_REQUEST,
        messages.user_already_exsists
      );
    } else {
      var password = req.body.password;
      delete req.body.password;
      const users = await User(req.body).save();
      users.setPassword(password);
      // console.log(users);return
      await User.updateOne({ _id: users._id }, users);
      responseManagement.sendMail(
        req.body.email,
        req.body.first_name,
        "Dear " + req.body.first_name + req.body.last_name + "",

        "Dear " + "Hello ✔",
        `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title></title>
                <style></style>
            </head>
            <body>
        
            <table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer">
                <tr>
                    <td align="center" valign="top">
                        <table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailHeader">
                            <tr>
                                <td align="center" valign="top">
                                Your Registration has been Successfully Please ignore if you have already recieved mail.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td align="center" valign="top">
                        <table border="0" cellpadding="20" cellspacing="0" width="100%" id="emailBody">
                            <tr>
                                <td align="center" valign="top">
                                <p>User ID :` +
          req.body.email +
          `</p>
                                <p>Password :` +
          password +
          `</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            </body>
        </html>`
      );
    }
    responseManagement.sendResponse(res, httpStatus.OK, messages.user_created);
  } catch (error) {
    responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      messages.internal_server_error
    );
  }
};

// User Login

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.hash && user.salt) {
      if (user.validatePassword(password)) {
        const token = await user.generateJWT();
        const user_data = {
          _id: user._id,
          name: user.first_name,
          email: user.email,
          user_type: user.usertype,
          status: user.status,
        };

        responseManagement.sendResponse(
          res,
          httpStatus.OK,
          messages.login_success,
          { token: token, user_data }
        );
      } else {
        responseManagement.sendResponse(
          res,
          httpStatus.UNAUTHORIZED,
          messages.user_login_fail
        );
      }
    } else {
      responseManagement.sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        messages.user_login_fail
      );
    }
  } catch {
    responseManagement.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      messages.internal_server_error
    );
  }
};
