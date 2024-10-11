give me a full detailed structure and professional code plase give me full code 
use typescript in both frontend and backend

create frontend using react+vite , typescript, formik,yup,axios,tanstackquery,usemutation

create backend using nodejs,express,sequelized mysql,typescript, use multer to store photos and resume in local storage my databse name is jobseeker password is Password123#@! and host is local host, root
use json webtoken password should we encrypted  using bcrypt express-validator,nodemailer to send email (host=gmail,vyasaryan786@gmail.com,smtp.gmail.com and pass is srshixgdtbttkbza)

and job seeker or agency can register using same email but after that the email cannot be used by other

the job seeker or agency can only view their own profile after login

1. Register the user with the below fields.
a. First name - input box
b. Last name - input box
c. Email - input box with type of email
d. Phone - input box will accept numbers only
e. Gender ( radio buttons )
f. User Type - Select box ( Job Seeker, Agency ) use dropdown on this basic form next input willchanges
g. Hobbies ( checkboxes ) Sports, Dance, Reading, Singing. create a different table for hobbies and use association with user details table
h. Profile image (PNG and JPEG only )
i. If the user types job seeker, show the option to upload the resume ( .docx
and.pdf ) 
j. If the user types job seeker, option to select the agency form the
dropdown that are stored in database
2. On registering the user will receive an email, with login details (auto generated
password).
3. If logged in with the Agency, show a list of all job seekers who selected this
agency while signing up.
4. If logged in with the Job seeker, show the agency details they chose while
signing up.
