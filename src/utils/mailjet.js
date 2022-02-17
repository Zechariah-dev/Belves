const mailjet = require ('node-mailjet').connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

exports.resetPasswordMail = (user, token) => {
    const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "omoladesunday221@gmail.com",
        "Name": "no-reply@belves.com"
      },
      "To": [
        {
          "Email": user.email,
          "Name": `${user.firstname} ${user.lastname}`
        }
      ],
      "Subject": "Reset Your Password",
      "TextPart": "Reset your password",
      "HTMLPart": `<a href='https://belves.com/reset-password/${token}'>Password Reset</a>`,
      "CustomID": "ResetPassword"
    }
  ]
})
request
  .then((result) => {
    global.logger.info(result.body)
  })
  .catch((err) => {
    global.logger.error(err.statusCode)
  })
}