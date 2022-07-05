# Surge.Global - Vindya Siriwardane - Software Engineering Internship - 2022 September
#Author - Vindya Siriwardane
#Resources - https://reactjs.org/tutorial/tutorial.html
             https://www.mongodb.com/docs/develop-applications/
             
Hello,
This application is intended to register users via email and a temporary password.
Then, email should be verified using the given link and temporary password.
After successfully logged in, a form will be given to users to enter some data and reset password.
Then, users will be redirected to the login page.
According to the user type, users will redirected to respective pages after logged in.(student -> Notes page, admin -> User List page)
Admins can view user data list.
Students can add notes, edit notes and delete notes.

HOW TO RUN
==========
**Prerequisite
 - MongoDB installed.
 - Node js installed.

1. Clone the project and go to project folder.
2. Open the project using prferrable IDE.
3. Go to 'frontend' folder and type 'npm i'.
4. To start frontend, type 'npm start'.
5. Go to 'backend' folder and type 'npm i'.
6. .env file is ommitted here since it includes secrets.
7. So, you need to create .env file in backend folder with following values.

    DB = your DB url
    JWTPRIVATEKEY = any value
    SALT = 10
    BASE_URL = your frontend url
    HOST = smtp.gmail.com
    SERVICE = gmail
    EMAIL_PORT = 587
    SECURE = true
    USER = your email
    PASS = email app password
 
8. To start backend, type 'npm start'.

That's all!
Have fun!
