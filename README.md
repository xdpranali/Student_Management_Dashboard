# 📚 Student Management Dashboard

A **React-based single-page application (SPA)** for managing students.  
The app allows adding, editing, and viewing student details such as **name, email, enrolled course, and profile image**.  
It demonstrates **React fundamentals, async/await, event loop behavior, and responsive UI design**.

---

##  Live Demo

Access the live demo here:  
[🎬 Student Management Dashboard – Live on Vercel](https://student-management-dashboard-two.vercel.app/)

---

## 🚀 Features

- **Add Students** – via a form with validation (name, email, course, optional profile image).
- **Edit Students** – update existing student details.
- **Responsive UI** – works smoothly on both desktop and mobile.
- **Course Selection** – fetches a list of available courses from a mock API.
- **Form Validation** – required fields and proper email format.
- **Profile Image Support** – paste an image URL (fallback avatar if invalid).
- **Data Persistence** – students saved in `localStorage`.
- **Event Loop Demonstration** – included example with `setTimeout` + async/await.
- **Optimized Rendering** – uses `useMemo` to prevent unnecessary re-renders.

---

## 🛠️ Tech Stack

- **Frontend:** React (functional components + hooks)
- **Styling:** Custom CSS (responsive, mobile-first design)
- **Data Persistence:** LocalStorage
- **API Calls:** Mock API with async/await
- **Tooling:** Vite + React

---

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/xdpranali/Student_Management_Dashboard.git
   cd Student_Management_Dashboard
   npm install
   npm run dev
