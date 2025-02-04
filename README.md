# 📌 New Project - QuizBuilder

## 🚀 Overview
QuizBuilder is an advanced quiz creation and participation platform, inspired by **QuizMaster** but enhanced with additional features and a streamlined user experience. This project is designed for educators, trainers, and individuals looking to create interactive and engaging quizzes with real-time participation and analytics.

## 🛠 Features
- ✅ **Authentication with Google & GitHub**
- ✅ **Enhanced Quiz Creation** (Multiple-choice, checkboxes, text input, timed quizzes, and conditional logic)
- ✅ **Dark/Light Mode Toggle**
- ✅ **Real-time Quiz Participation with Live Leaderboards**
- ✅ **Detailed Quiz Response Analytics with Graphical Insights**
- ✅ **Export Quiz Results to CSV & PDF**
- ✅ **Customizable Themes for Quizzes**
- ✅ **Offline Mode for Quiz Taking**
- ✅ **AI-Powered Question Generation**
- ✅ **Mobile-Friendly, Progressive Web App (PWA) Support**

## 🏗️ Tech Stack
- **Frontend:** Preact, TailwindCSS, React Router, Zustand (for state management)
- **Backend:** Firebase Firestore (Real-time database), Firebase Authentication, Cloud Functions
- **Additional Libraries:** Chart.js (for analytics visualization), ExcelJS (for exporting responses), PDFKit (for PDF export), Lucide-react (icons)

## 🔧 Setup & Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/your-username/quizbuilder.git
cd quizbuilder
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Set Up Firebase**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up **Firebase Authentication** (Google & GitHub Sign-In)
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
📂 quizbuilder
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
 │   │   ├── LightSwitch.jsx
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

## 🌐 Live Demo & GitHub Repository
🔗 **GitHub Repository:** [QuizBuilder Repo](https://github.com/your-username/quizbuilder)
🌍 **Live Demo:** [QuizBuilder on Vercel](https://quizbuilder.vercel.app/)

## 🤝 Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`feature-branch`)
3. Make changes & commit (`git commit -m "Added new feature"`)
4. Push to your branch (`git push origin feature-branch`)
5. Open a pull request 🚀

