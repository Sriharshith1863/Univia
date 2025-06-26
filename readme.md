# Univia

**Univia** is a full-stack event ticketing platform where users can browse, register, and manage events — while organizers can create, edit, and control participation seamlessly.

---

## 🚀 Features

- 🔐 **JWT Auth** for secure login/signup  
- 📩 **Email OTP verification** before registration  
- 🗓️ **Create & edit events** with datetime support  
- 📬 **Smart ticketing system** (tickets tied to event + user)  
- 🧾 **Ticket download** with printable view  
- 📥 **Event image uploads** (Cloudinary integration)  
- 👥 **Role-based access**: users vs organizers  

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Axios, React Hot Toast  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Auth:** JWT, bcrypt  
- **Media:** Cloudinary  
- **Email:** Nodemailer  

---

## 📌 Developer Notes

- OTP verification entries are stored in a separate collection with a 5-minute TTL.
- If a user enters the wrong OTP, no user account is created.
- Ticket records tied to deleted events are cleaned up automatically.
- Organizers can restrict registrations using max participant limits and email regex rules.
- Authenticated routes are protected with JWTs.
- Event images are stored on Cloudinary and old ones are deleted on update.

---
## Preview
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-2.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)

## 🧪 Running Locally

```bash
# Backend
cd eventBackend
npm install
npm run dev

# Frontend
cd eventFrontend
npm install
npm run dev

