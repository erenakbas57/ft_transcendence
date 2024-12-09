# 🎮 **Matrix Themed Ping-Pong Web Application** 🚀

Welcome to **Matrix Themed Ping-Pong**, a sleek and immersive web experience built using **Python Django** and **Pure JavaScript**. 
This Single Page Application (SPA) brings you a futuristic blend of **Matrix-style** aesthetics and exciting gameplay. 
Whether you're challenging friends or climbing the ranks, you'll enjoy a modern and dynamic interface.

---
## Technologies Used 💻

- **Backend**: Python, Django
- **Frontend**: Pure JavaScript, HTML5, CSS3, Bootstrap
- **Authentication**: Ecole42 API, Custom Login
- **Database**: SQLite3

---

## Features 🌟

### 🔐 **User Authentication**
- **Sign up & Log in**: Seamlessly register with your credentials or use the power of the **Ecole42 API** for secure and easy login.
- **Profile Management**: Manage your profile effortlessly. Customize your settings, update your information, and change your password anytime.

### 🏓 **Engaging Gameplay**
- **Matrix-themed Ping-Pong**: Step into the digital world with our **Matrix-inspired Ping-Pong game**, where every match feels like an action-packed cyber adventure.
  * local 2 player game
  * local game with AI
  * local 4 player tournament game
  * local 2 player **advanced** game
    
- **Matrix-themed Rock-Paper-Scissors**: Challenge your friends to the iconic **Rock-Paper-Scissors** game with a **Matrix twist** — who will dominate the digital battlefield?
  * local game
  * local **advanced** game

### 📊 **User Stats & Interaction**
- **Game Statistics**: Track your performance and see detailed statistics for each game you play, including win/loss records and more.
- **Follow Players**: Discover other players, follow them, and keep an eye on their stats.

### 🔍 **Search & Discover**
- **Search for Players**: Find other players by name and start following their games stats.

---


## Future Enhancements 🚧
- Leaderboards: A global leaderboard to show the top-ranked players in various games.
- Database: Transitioning to PostgreSQL database
- Docker: Restart the entire project with a single line command


---

## How to Get Started 🚀

1. **Clone the repository**:

   ```bash
     git clone https://github.com/erenakbas57/ft_transcendence

2. **Navigate into the project directory**:

   ```bash
     cd your-repo-name

3. **Set up your environment**:
   - Install dependencies:
     ```bash
       pip install -r req.txt

  - Create a .env file and configure the necessary environment variables (e.g., database settings, secret keys).
    ```bash
      OAUTH2_TOKEN_URL = '...'
      OAUTH2_AUTHORIZE_URL = '...'
      OAUTH2_API_URL = '...'
      CLIENT_ID = "..."
      CLIENT_SECRET = "..."
      DJANGO_SECRET_KEY = "..."

2. **Run the Django development server**:

   ```bash
     python manage.py runserver

