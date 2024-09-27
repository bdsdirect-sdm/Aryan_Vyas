# Aryan_Vyas
Following are the modules:
1.
2.
3.
4.
Signup Screen
Login Screen
Profile Screen
Update profile Screen
Description
Default page will be sign up Page, Use backend server(apis) and database to store the data. After signup,
redirect the user to the login page.
After login - store jwt in either cookie or local storage or in parent component state and redirect user to Profile
page.
After updating profile - redirect the user to profile page. After logout, the user redirects to the Sign Up screen and
clears the jwt token. Details:
Create a signup form
​

​
- First Name
- Last Name
- Email (add checks for email uniqueness in db and show alert to user in case email already exists in db)
- Password
- Confirm Password
- Submit Button and a Link to Login page
Login form
​
- Email
- Password
Submit Button and a Link to Sign up page
​
Profile Page - use jwt to protect this route - pass jwt in header
Show information captured on sign up page using api from backend, and a link on header to Logout..
Add a link to redirect to Update Profile page.
Create a Profile Update form
​
- First Name
- Last Name
- Email ( add checks for email uniqueness )
- Date of Birth
- Gender - radio button- male & female
- Phone Number
Submit Button



create frontend using vite+react and typescript
create backend using nodejs,express,sequelized mysql typescript 
