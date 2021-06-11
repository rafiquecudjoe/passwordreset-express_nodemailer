const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");
const { promisify } = require("util");

const readFile= promisify(fs.readFile)

const sendEmail = async(options)  => {

  const transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
          user: 'd161ea2776db22',
          pass: '34493077e673bb'
      }
  })
 

  const html = await  readFile('./utils/Email/template/resetPassword.handlebars', 'utf8')
  const template = await  handlebars.compile(html)

  let name = {
    username:"toto"
  }

  let htmlToSend = template(name)
    
  
  const mailOptions = {
      from:options.fromemail,
      to:options.toemail,
      subject:options.subject,
    text: options.text,
      html:htmlToSend
     
  }

  await transporter.sendMail(mailOptions )
      .then((response) => console.log(response))
      .catch(err=>console.log(err))
  

}


//   try {
//     // create reusable transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//       host: "smtp.mailtrap.io",
//       port: 2525,
//       auth: {
//         user:"d161ea2776db22",
//         pass:"34493077e673bb", // naturally, replace both with your real credentials or an application-specific password
//       },
//     });

//  
//     const options  = {
    
//         from: "rasgalazy5@gmail.com",
//         to: "meinaccra@gmail.com",
//       subject: 'Hiiiiiiiiii',
//         text: 'How are you'
      //  html: ,
//       }
   
//     // Send email
//     transporter.sendMail(options, (error, info) => {
//       if (error) {
//         return error;
//       } else {
//         return res.status(200).json({
//           success: true,
//         });
//       }
//     });
//   } catch (error) {
//     return error;
//   }
// };

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

module.exports = sendEmail;