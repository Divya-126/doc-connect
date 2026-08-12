//verification email template for user
export const sendVerificationMailTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body{
margin:0;
padding:0;
background:#f4f6f8;
font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
padding:40px 15px;
}

.container{
max-width:600px;
margin:auto;
background:#ffffff;
border-radius:12px;
overflow:hidden;
border:1px solid #e2e8f0;
box-shadow:0 6px 20px rgba(0,0,0,0.15);
text-align:center;
}

.header{
background:#60A5FA;
color:white;
padding:22px;
font-size:24px;
font-weight:bold;
}

.content{
padding:30px;
}

.title{
font-size:22px;
color:#1e293b;
margin-bottom:10px;
}

.text{
font-size:16px;
color:#475569;
line-height:1.6;
margin-top:10px;
}

.otp-box{
font-size:34px;
letter-spacing:6px;
font-weight:bold;
background:#eef2ff;
padding:18px 30px;
border-radius:8px;
display:inline-block;
margin:25px 0;
color:#1e3a8a;
}

.footer{
font-size:13px;
color:#94a3b8;
margin-top:20px;
padding-bottom:25px;
}

/* Mobile */

@media screen and (max-width:600px){

.wrapper{
padding:15px !important;
}

.content{
padding:22px !important;
}

.text{
font-size:15px;
text-align:justify;
}

.otp-box{
font-size:26px;
letter-spacing:4px;
padding:15px 22px;
}

}

/* DARK MODE SUPPORT */

@media (prefers-color-scheme: dark){

body{
background:#0f172a !important;
}

.container{
background:#1e293b !important;
}

.content{
background:#1e293b !important;
}

.title{
color:#ffffff !important;
}

.text{
color:#ffffff !important;
}

.otp-box{
background:#1e40af !important;
color:#ffffff !important;
}

.footer{
color:#94a3b8 !important;
}

}

/* Gmail / Outlook dark mode fix */

[data-ogsc] .text,
[data-ogsb] .text{
color:#ffffff !important;
}

[data-ogsc] .title,
[data-ogsb] .title{
color:#ffffff !important;
}

</style>
</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
Doc-Connect
</div>

<div class="content">

<div class="title">
Email Verification
</div>

<p class="text">
Use the verification code below to confirm your email address.
</p>

<div class="otp-box" >
{otp}
</div>

<p class="text">
This verification code will expire in <b>1 minutes</b>.
</p>

<p class="text">
If you did not request this verification, you can safely ignore this email.
</p>

<div class="footer">
© ${new Date().getFullYear()} Doc-Connect • All rights reserved
</div>

</div>

</div>

</div>

</body>
</html>
`;

//welcome emaile template for user
export const welcomeMailTemplate = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body{
margin:0;
padding:0;
background:#eef2ff;
font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
padding:40px 20px;
}

.container{
max-width:600px;
margin:auto;
background:#ffffff;
border-radius:12px;
border:1px solid #e2e8f0;
overflow:hidden;
box-shadow:0 6px 24px rgba(0,0,0,0.15);
}

.header{
background:#818CF8;
color:#ffffff;
padding:28px;
text-align:center;
font-size:26px;
font-weight:bold;
}

.content{
padding:35px;
text-align:center;
background:#ffffff;
}

.title{
font-size:24px;
margin-bottom:10px;
color:black;
}

.text{
font-size:16px;
line-height:1.6;
margin-top:10px;
color:black;
}

.feature{
margin-top:18px;
font-size:15px;
color:#A5B4FC;
text-align:center;
}

.button{
display:inline-block;
margin-top:25px;
padding:14px 28px;
background:#818CF8;
color:#ffffff !important;
text-decoration:none;
border-radius:6px;
font-weight:bold;
font-size:15px;
}

.footer{
font-size:13px;
color:#94a3b8;
margin-top:30px;
}

/* Mobile */

@media screen and (max-width:600px){

.wrapper{
padding:10px !important;
}

.content{
padding:20px !important;
}

.feature-con{
  margin:0 auto;
}
.title{
font-size:20px;
}

.text{
font-size:15px;
text-align:justify;
}

.feature{
text-align:start;
}

.button{
padding:12px 22px;
font-size:14px;
}

}

/* DARK MODE SUPPORT */

@media (prefers-color-scheme: dark){

body{
background:#0f172a !important;
}

.container{
background:#1e293b !important;
}

.content{
background:#1e293b !important;
}

.title{
color:#ffffff !important;
}

.text{
color:#ffffff !important;
}



.footer{
color:#94a3b8 !important;
}

}

/* Gmail & Outlook Dark Mode Fix */

[data-ogsc] .text,
[data-ogsb] .text{
color:#ffffff !important;
}

[data-ogsc] .title,
[data-ogsb] .title{
color:#ffffff !important;
}

[data-ogsc] .feature,
[data-ogsb] .feature{
color:#A5B4FC !important;
}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
Doc-Connect
</div>

<div class="content">

<div class="title">
Welcome to Doc-Connect 🎉
</div>

<p class="text" >
Hello <strong>{name}</strong>,
</p>

<p class="text" >
We're excited to welcome you to <strong>Doc-Connect</strong>, your healthcare platform where you can easily connect with doctors and book appointments online.
</p>


<div class="feature" >
✔ Book appointments with trusted doctors
</div>

<div class="feature" >
✔ Manage healthcare consultations easily
</div>

<div class="feature" >
✔ Access medical services quickly and conveniently
</div>


<a href="http://localhost:3000" class="button">
Book Your First Appointment
</a>

<p class="text" >
We're happy to have you with us. Your healthcare journey just became easier and more convenient.
</p>

<hr style="margin:30px 0;border:none;border-top:1px solid #e2e8f0">

<div class="footer">
© ${new Date().getFullYear()} Doc-Connect • All rights reserved
</div>

</div>

</div>

</div>

</body>
</html>
`;

//doctor email and password template
export const doctorAccountTemplate = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<style>

body{
margin:0;
padding:0;
background:#eff6ff;
font-family:Arial, Helvetica, sans-serif;
}

.wrapper{
padding:40px 20px;
}

.container{
max-width:600px;
margin:auto;
background:#ffffff;
border-radius:12px;
border:1px solid #e2e8f0;
overflow:hidden;
box-shadow:0 4px 20px rgba(0,0,0,0.15);
}

.header{
background:#60A5FA;
color:white;
padding:25px;
text-align:center;
font-size:26px;
font-weight:bold;
}

.content{
padding:35px;
text-align:center;
background:#ffffff;
}

.text{
font-size:16px;
color:#334155; /* fixed for light mode */
line-height:1.6;
margin-top:10px;
}

.credentials{
margin-top:25px;
background:#60A5FA;
color:white;
padding:20px;
border-radius:8px;
font-size:16px;
line-height:1.8;
}

.button{
display:inline-block;
margin-top:25px;
padding:14px 28px;
background:#3B82F6;
color:white !important;
text-decoration:none;
border-radius:6px;
font-weight:bold;
font-size:15px;
}

.footer{
font-size:13px;
color:#94a3b8;
margin-top:30px;
}

/* Mobile */

@media screen and (max-width:600px){

.wrapper{
padding:15px !important;
}

.content{
padding:25px !important;
}

.text{
text-align:justify;
font-size:15px;
}

.credentials{
font-size:15px;
padding:18px;
}

.button{
padding:12px 22px;
font-size:14px;
}

}

/* DARK MODE SUPPORT */

@media (prefers-color-scheme: dark){

body{
background:#0f172a !important;
}

.container{
background:#1e293b !important;
}

.content{
background:#1e293b !important;
}

.text{
color:#ffffff !important;
}

.footer{
color:#94a3b8 !important;
}

}

/* Gmail / Outlook dark mode fix */

[data-ogsc] .text,
[data-ogsb] .text{
color:#ffffff !important;
}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">
Doc-Connect
</div>

<div class="content">

<h2 >Doctor Account Created</h2>

<p class="text" >
Your doctor account has been successfully created on <strong>Doc-Connect</strong>.  
You can now log in to manage your appointments and connect with patients.
</p>

<div class="credentials">

<strong>Login Email:</strong><p>{email}</p> 

<strong>Temporary Password:</strong> <p>{password}</p>

</div>

<p class="text" >
For security reasons, please log in and change your password immediately.
</p>

<a href="http://localhost:3000/login" class="button">
Login & Reset Password
</a>

<p class="text" >
If you did not expect this account, please contact the administrator.
</p>

<div class="footer">
© ${new Date().getFullYear()} Doc-Connect • All rights reserved
</div>

</div>

</div>

</div>

</body>
</html>
`;
