# Welcome to the Quiz-A-Boo app!

Quiz-A-Boo is a quiz app for anime enthusiasts to test their anime knowledge in varying difficulties. Only the highest scores make the leaderboard!

This app was created using a JavaScript frontend and a Rails backend. The backend repo can be found here:

https://github.com/danielkwon89/js-rails-backend

The app utilizes an external API for quiz questions and answers and persists usernames/scores in the Rails backend.

# Instructions

Here are the steps to get the app up and running:

1. Clone the backend to your machine by typing the following into your terminal:

       git clone https://github.com/danielkwon89/js-rails-backend.git
       
2. Next, cd into the cloned repo and open it in your code editor:

       cd js-rails-backend
       code .
       
3. Next, we migrate the database:

       rails db:migrate
  
4. Then we run the Rails server:

       rails s
       
5. Almost done! Now we just need to clone our JS frontend. Open up a new terminal and run the following:

       git clone https://github.com/danielkwon89/js-rails-frontend.git
      
6. Next, we cd into the cloned frontend repo and open it in your code editor:

       cd js-rails-front-end
       code .
     
7. Last step! Right click the index.html file and open it in your browser to take the quizzes. Enjoy!

![quiz-a-boo gif](https://github.com/danielkwon89/js-rails-frontend/blob/1420fc178d7a37226b80ca9d43b566292a2a845f/quiz-a-boo%20gif.gif)
