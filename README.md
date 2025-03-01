can you create me a new project based of these
### 📌 **README.md for QuizMaster**

```md
# 📚 QuizMaster - Interactive Quiz Creation & Participation Platform


## 🚀 Overview
QuizMaster is a dynamic web application that enables users to create, share, and participate in interactive quizzes. Built with **Preact**, **Firebase**, and a modern UI framework, this platform offers a seamless experience for both quiz creators and participants.

## 🔧 Test the app
- https://quizmaster-amber.vercel.app/

## 🛠 Features
- ✅ **Authentication with Google**
- ✅ **Create & Manage Quizzes** (Multiple-choice, checkboxes, text input, conditional questions)
- ✅ **Dark/Light Mode Toggle**
- ✅ **Real-time Quiz Participation**
- ✅ **Quiz Response Analytics**
- ✅ **Export Quiz Results to Excel**
- ✅ **Responsive UI for Mobile & Desktop**

## 🏗️ Tech Stack
- **Frontend:** Preact, TailwindCSS, React Router
- **Backend:** Firebase Firestore (Real-time database), Firebase Authentication
- **Additional Libraries:** ExcelJS (for exporting responses), Lucide-react (icons)

## 🔧 Setup & Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/your-username/quizmaster.git
cd quizmaster
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Set Up Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up **Firebase Authentication** (Google Sign-In)
4. Enable **Firebase Firestore**
5. Get your Firebase config and add it to `.env` file:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ **Run the Development Server**
```sh
npm run dev
```
- Open **http://localhost:5173/** in your browser.

## 📁 Folder Structure
```
📂 quizmaster
 ├── 📂 src
 │   ├── 📂 components
 │   │   ├── Header.jsx
 │   │   ├── QuizCreator.jsx
 │   │   ├── QuizResponses.jsx
 │   │   ├── QuizHistory.jsx
 │   │   ├── QuizDisplay.jsx
 │   │   ├── ResponseTableComponents
 │   │   │   ├── Card.jsx
 │   │   │   ├── Badge.jsx
 │   │   │   ├── Button.jsx
 │   │   └── LightSwitch.jsx
 │   ├── 📂 firebase
 │   │   ├── firebaseConfig.js
 │   │   ├── database.js
 │   ├── 📂 context
 │   │   ├── UserContext.jsx
 │   ├── App.jsx
 │   ├── main.jsx
 ├── 📂 public
 ├── 📜 package.json
 ├── 📜 README.md
 ├── 📜 .gitignore
 ├── 📜 vite.config.js
```

## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Make changes & commit (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a pull request 🚀
this is my QuizMaster app, something like google forms, this is the link to the github 
https://github.com/Mohammed19J/QuizMaster/tree/main
and this is the link to website deployed on vercel
https://quizmaster-amber.vercel.app/
