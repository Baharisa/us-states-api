#  US States REST API

This is a full-featured **Node.js REST API** that provides data about all 50 US states, including static information (from a JSON file) and dynamic data (like fun facts) stored in **MongoDB**.

Built for the **INF653 Final Project – Spring 2025**  
Deployed using **Glitch** + GitHub

---

##  Project Features

- GET endpoints to retrieve state data (population, admission date, nickname, etc.)
- MongoDB-based storage for dynamic fun facts
- CRUD operations (POST, PATCH, DELETE) for state fun facts
- Case-insensitive routing for state codes (e.g. `/states/ks` = `/states/KS`)
- Query filtering with `?contig=true` or `?contig=false`
- Error handling with JSON or HTML 404s
- Fully tested with Netlify’s automated API test suite ( 70/70 Passed)

---

##  Project Structure

us-states-api/
│
├── config/                 # DB connection & custom config
│   └── dbConn.js
│
├── controllers/           # Route controller functions
│   └── stateController.js
│
├── middleware/            # Middleware like error handling, state validation
│   ├── errorHandler.js
│   ├── getStateName.js
│   ├── isValidStateCode.js
│   ├── jsonMessage.js
│   └── verifyState.js
│
├── models/                # Mongoose schema(s)
│   ├── State.js           # MongoDB schema
│   └── statesData.json    # Static base state data (from course)
│
├── routes/
│   ├── api/
│   │   └── states.js      # /states and nested routes
│   └── root.js            # Serves index.html and handles "/" route
│
├── views/                 # HTML for root and 404
│   ├── 404.html
│   └── index.html
│
├── public/                # (Optional) static assets if needed
│
├── seed.js                # (Optional) script to populate DB manually
│
├── .env                   # Environment variables (not uploaded to GitHub)
├── .gitignore             # Excludes node_modules, .env, etc.
├── package.json           # Project metadata and dependencies
├── server.js              # Entry point
└── README.md              # Project description and instructions


---

##  API Endpoints (Highlights)

| Method | Route                               | Description                              |
|--------|-------------------------------------|------------------------------------------|
| GET    | `/states`                           | All states with merged funfacts          |
| GET    | `/states?contig=true/false`         | Filter contiguous or non-contiguous      |
| GET    | `/states/:code`                     | Single state by code                     |
| GET    | `/states/:code/capital`             | Get capital of a state                   |
| GET    | `/states/:code/nickname`            | Get nickname of a state                  |
| GET    | `/states/:code/population`          | Get population                           |
| GET    | `/states/:code/admission`           | Get admission date                       |
| GET    | `/states/:code/funfact`             | Get random fun fact                      |
| POST   | `/states/:code/funfact`             | Add new funfacts                         |
| PATCH  | `/states/:code/funfact`             | Update a specific funfact                |
| DELETE | `/states/:code/funfact`             | Delete a specific funfact                |

---

##  Live Deployment

-  **Project URL**: [https://busy-gaudy-gosling.glitch.me](https://busy-gaudy-gosling.glitch.me)
-  **Tested with**: [Netlify INF653 Test Tool](https://netlify.app)

---

## 🛠 Technologies Used

- Node.js + Express.js
- MongoDB + Mongoose
- JavaScript (ES6+)
- HTML for views
- GitHub + Glitch deployment

---

##  How to Test Locally

```bash
git clone https://github.com/Baharisa/us-states-api.git
cd us-states-api
npm install


Create a .env file with your MongoDB URI:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/statesDB
PORT=3500

Then run:
npm start


Author
Mahani Baharisa
INF653 - Back End Web Development I


License
This project is for academic use under FHSU guidelines. Feel free to explore and learn!



