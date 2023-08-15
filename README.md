# Project Name
Ami Coding Pari na

# IDE
  ---> Visual Studio Code
  
# Installation 
  -- Install Node on your computer and assure that it has been installed successfully. After extracting the zip file open it on the IDE.
  
  -- Open the terminal and run the below installation command:
          -> npm install nodemon
          -> npm install express ejs mongoose jsonwebtoken body-parser
          
  -- You need to install MongoDB Compass from the website (https://www.mongodb.com/try/download/shell)
  # Run the Program 
   - After successfully installing the commands you can run the code by giving this command in the terminal
         -> nodemon src/Index.js (If it does not run then try with - nodemon Index.js)
         -> In the browser type (http://localhost:5000), and it will redirect to the login page.
# Pages & Features
  -> Login (http://localhost:5000)
      - If you don't have an account you can click on the "signupnow" button 
      - After successfully registering or signup, it will redirect it to the login page and then you can give proper information to go to the "KHOJ the search" page
  
  -> Signup ( http://localhost:5000/signup) 
      - Create an account with proper information and it will redirect to the login page
      - Your given information will add to the database server(MongoDB)
  -> Home (Khoj The Search) [http://localhost:5000/home]
      - Here you go after the authentication part. Here you can give me array values and the random search values to implement whether it is working or not
      - If the given search value exists then it will show "true" otherwise it will show "false"
      - Your given array is stored in the database in descending order
      
  -> API: 
      - Here, one API endpoint has been implemented and after passing the parameters of the user it will show the object which contains user_id, timestamp, and input values.
      - You can use Postman for validation.
  --> Error Handling: 
      - In the code, various types of error for the login,signup, token,API has been implemented
# Bonus:
  -> Creative Design for frontend has been implemented
  -> Tokenization has been implemented. After successful login, you can see the token in the visual studio code terminal
  
