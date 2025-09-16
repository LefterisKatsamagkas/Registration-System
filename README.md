# Registration System

A full-stack web application that allows users to **create events** and share them with others. Users can set event details such as **location, price**, and more. Other users can access the event link and **subscribe** to events, with optional **Stripe payments**. The system includes **authentication** for event creators, while attendees can subscribe without registering.  

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Setup](#setup)
4. [Environment Variables](#environment-variables)
5. [Usage](#usage)
6. [Screenshots / Demo](#screenshots--demo)
7. [Contributing](#contributing)
8. [License](#license)

---

## Features

- User registration and login with **email and password**  
- Event creation by authenticated users  
- Each user is admin of their own events  
- Event sharing via public links  
- Subscription to events by attendees without registration  
- Stripe integration for paid events  
- Image upload via **AWS S3**  
- Secure backend with **Node.js/Express** and **MongoDB** database  
- Responsive frontend with **React** and **Bootstrap**

---

## Tech Stack

- **Frontend:** React, Bootstrap  
- **Backend:** Node.js, Express  
- **Database:** MongoDB  
- **Authentication:** Email & password (JWT)  
- **Payments:** Stripe  
- **File Storage:** AWS S3  

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/LefterisKatsamagkas/Registration-System.git
cd registration-system
```

---

## Screenshots / Demo

Here are some screenshots of the Registration System:

### 1. Home Page
![Home Page](assets/Screenshot%202025-09-16%20113804.png)

### 2. Organizer's View (Event Management)
![Organizer View](assets/Screenshot%202025-09-16%20113804-2.png)

### 3. Client View (Event Details)
![Client View](assets/Screenshot%202025-09-16%20113804-3.png)

### 4. Client View (Payment with Stripe)
![Payment View](assets/Screenshot%202025-09-16%20113804-4.png)

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

