# Internship Tracker
## Overview

The Internship Tracker is a full-stack web application designed to help students organize, track, and manage their internship applications in one centralized platform.

This application replaces the need for spreadsheets by providing a structured and interactive dashboard where users can monitor their progress throughout the recruiting process.

### Features
Application Tracking

Create, update, and delete internship applications

Track application status (Applied, Interviewing, Rejected, Offer)

User Authentication

Secure registration and login

User-specific data storage

Persistent Data

Applications are saved in the database

Data reloads automatically upon login

Drag and Drop Interface

Move applications between stages using a Kanban-style board

Real-Time Updates

Changes are immediately reflected in the user interface

## Tech Stack
### Frontend

React

React Router

DnD Kit

### Backend

Node.js

Express

Database

MongoDB

# Project Structure
internship-tracker/
│
├── client/        # React frontend
├── server/        # Express backend
├── models/        # Database schemas
├── routes/        # API endpoints
└── README.md
Installation and Setup
Clone the Repository
git clone https://github.com/JMcKee03/internship-tracker.git
cd internship-tracker
Install Dependencies

# Backend:

cd server
npm install

# Frontend:

cd client
npm install
Environment Variables

Create a .env file in the server directory and include:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Running the Application

### Start the backend:

cd server
npm start

### Start the frontend:

cd client
npm start
Usage

Register for an account

Log in to access the dashboard

Add internship applications

Move applications between stages

Track progress throughout the hiring process

# Future Improvements

Calendar and deadline tracking

Notifications and reminders

Analytics and reporting features

Deployment to a live environment

# Contributing

Contributions are welcome. If you would like to improve the project, feel free to fork the repository and submit a pull request.
