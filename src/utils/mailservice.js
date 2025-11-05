// const nodemailer = require('nodemailer');
       

// const user_mail = process.env.MAIL_USER;
// const mail_pass_key = process.env.MAIL_PASS_KEY;

// const transaport = nodemailer.createTransport({  //inoru mail ku sent panuthu
//     service:"gmail",      
//     auth:{
//         user: user_mail,       //nama create panathu
//         pass: mail_pass_key
//     }
// });                                      

// const mailOptions = {
//     from:user_mail,
//     to:"remoskani@gmail.com",    
//     subject:"testing",
//     text:"Hi"   
// }                         

// const mail = () => transaport.sendMail(mailOptions,(err, info) =>{   //  trans port use pani mail sent mail vanthu mail option vachi sent panrim /result -show panarthuku callback
//     if(err){
//         console.log("err", err)
//     }
//     console.log("info", info)   //    call back la vangure 
// })

// module.exports = mail;       



const nodemailer = require('nodemailer');
require('dotenv').config();
console.log("✅ MAIL_USER:", process.env.MAIL_USER);
console.log("✅ MAIL_PASS_KEY:", process.env.MAIL_PASS_KEY ? "Loaded" : "Missing");

const user_mail = process.env.MAIL_USER;
const mail_pass_key = process.env.MAIL_PASS_KEY;


const transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: user_mail,    
        pass: mail_pass_key
    }
});

    
const mail = async(userEmail, otp) => {
    const mailOptions  = {
    from:user_mail,
    to:userEmail,
    subject:"OTP Verification",
    text:`To verify enter the below otp:${otp}`
}
  

await transport.sendMail(mailOptions,(err, info) =>{            
    if(err){
        console.log("err", err)              
    }    
    console.log("info", info.response)
})
}         

module.exports = mail;