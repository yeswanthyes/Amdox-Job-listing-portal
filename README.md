# Job Listing Portal 🚀

A full-stack **Job Listing Portal** web application that connects **job seekers** and **employers**.  
Built using **React (Vite)**, **Supabase**, and **Google Authentication**, this platform allows employers to post jobs and job seekers to browse and apply seamlessly.

---

## ✨ Features

### 👤 Authentication
- Email & Password login
- Google OAuth login
- Secure authentication using Supabase Auth

### 🧑‍💼 User Roles
- **Job Seeker**
  - Create profile
  - Browse job listings
  - Apply for jobs
- **Employer**
  - Create company profile
  - Post job openings
  - View applicants

### 💼 Job Management
- Create, update, delete job postings
- View active job listings
- Salary range and job type filters

### 📄 Applications
- Apply to jobs
- Track application status
- Employers can review applications

### 🔐 Security
- Row Level Security (RLS) enabled
- Role-based access control
- Secure data access via Supabase policies

---

## 🛠 Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS

**Backend / Services**
- Supabase (PostgreSQL)
- Supabase Auth
- Google OAuth 2.0

---

## 📁 Project Structure

src/
│── components/
│── pages/
│── lib/
│ └── supabase.ts
│── App.tsx
│── main.tsx
│── index.css
.env


---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key

🔑 Supabase Setup

Create a project at https://supabase.com

Enable Authentication:

Email & Password

Google Provider

Add Google OAuth Redirect URL:
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback

Run the provided SQL schema to create:

profiles

jobs

applications

Enable Row Level Security (RLS)

▶️ Run the Project Locally
npm install
npm run dev


App will run at:

http://localhost:5173

🔐 Google Login (Supabase)
await supabase.auth.signInWithOAuth({
  provider: "google",
});


Supabase handles:

Client ID

Client Secret

Redirects

User creation

📦 Database Tables

profiles – user information (job seeker / employer)

jobs – job postings

applications – job applications

🧪 Testing Checklist

 User signup (Email / Google)

 Profile auto-created

 Employer can post jobs

 Job seeker can apply

 RLS policies working correctly

🚀 Future Enhancements

Resume upload

Job search filters

Email notifications

Admin dashboard

Deployment (Vercel / Netlify)

📄 License

This project is for educational and learning purposes.

👨‍💻 Author

Developed with ❤️ using React + Supabase
