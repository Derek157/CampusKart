# CampusKart

A simple student marketplace where students can buy and sell useful items within the campus.

## How it works

User
 ↓
Frontend (HTML, CSS, JavaScript)
 ↓
Express + Node.js Backend
 ↓
MongoDB Atlas

### Main flow

Register / Login
      ↓
Browse Listings
      ↓
Sell an Item ─────→ MongoDB
      ↓
Save ❤️ ──────────→ Wishlist
      ↓
My Listings
      ↓
View / Mark Sold / Delete

## Tech Stack

- HTML, CSS, JavaScript
- Node.js + Express
- MongoDB Atlas
- JWT authentication
- bcryptjs for password hashing

## Project Structure

CampusKart/
├── client/      # Frontend
├── server/      # Backend
└── README.md

## Running Locally

### Backend

cd server
npm install
node server.js

### Frontend

Open the `client` folder using Live Server in VS Code.

The frontend communicates with the backend through the API running on port `5001`.

## Deployment Flow

GitHub
  ↓
Railway → Backend
  ↓
MongoDB Atlas → Database

Vercel → Frontend

