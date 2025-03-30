Draft Keeper - Frontend
A web application for managing and organizing drafts efficiently.

🚀 Live Demo
🔗 Draft Keeper (Frontend):-https://draft-keeper-frontend.vercel.app/

📌 Features
✅ User authentication (Signup/Login with Firebase)
✅ Create, update, and delete drafts
✅ Real-time syncing with backend
✅ Responsive UI for all devices

🛠️ Tech Stack
Technology	Usage
React	Frontend Framework
Tailwind CSS	Styling
Context API	State Management
Firebase	Authentication
Vercel	Deployment
🏗️ Setup & Installation
1️⃣ Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/draft-keeper-frontend.git
cd draft-keeper-frontend
2️⃣ Install Dependencies
bash
Copy
Edit
npm install


4️⃣ Run the App
bash
Copy
Edit
npm run dev
The app should now be running at http://localhost:5173.

🚀 Deployment
The frontend is deployed on Vercel. To deploy manually, run:

bash
Copy
Edit
npm run build
vercel deploy
🐛 Troubleshooting
🔹 Firebase Authentication Error
If you encounter this error:

plaintext
Copy
Edit
FirebaseError: Firebase: Error (auth/unauthorized-domain)
➡ Solution: Add your deployed domain (draft-keeper-frontend.vercel.app) to the Authorized Domains list in Firebase Console → Authentication → Settings.

🔹 CORS Issue
If requests to the backend are blocked:

plaintext
Copy
Edit
Access to fetch at 'https://draft-keeper-backend.onrender.com/api' has been blocked by CORS policy
➡ Solution: Update your backend's CORS settings to allow https://draft-keeper-frontend.vercel.app.

👥 Contributors
P. Sandeep Kalyan – https://github.com/sandeep2351

