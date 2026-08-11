# VideoTube — YouTube Backend Clone

A backend service that replicates core YouTube functionality — user authentication, video uploads, subscriptions, playlists, likes/comments, and watch history — built to understand production-grade backend architecture (auth flows, file handling, and MongoDB aggregation pipelines).

> Built as a learning project to strengthen backend fundamentals, later applied in [SyncCode](#) and a custom [Rate Limiter](#).

---

## Features

- **Authentication** — JWT-based auth with access + refresh token rotation, secure httpOnly cookies
- **User Management** — register, login, logout, update profile, avatar/cover image upload
- **Video Management** — upload, publish/unpublish, update, delete videos with Cloudinary storage
- **Subscriptions** — subscribe/unsubscribe to channels, subscriber count via aggregation
- **Playlists** — create, update, add/remove videos from playlists
- **Engagement** — likes on videos/comments/tweets, comment CRUD
- **Watch History** — tracked per user, powered by MongoDB aggregation pipelines
- **Dashboard** — channel stats (total views, subscribers, videos, likes)

---

## Tech Stack

| Layer            | Technology                     |
|-------------------|--------------------------------|
| Runtime            | Node.js                        |
| Framework          | Express.js                     |
| Database           | MongoDB with Mongoose          |
| Authentication     | JWT (access + refresh tokens), bcrypt |
| File Storage       | Multer (local buffer) + Cloudinary |
| Environment Config | dotenv                         |

---

## Architecture Highlights

- **Refresh Token Rotation** — access tokens are short-lived; refresh tokens are stored (hashed) in the DB and rotated on each use to reduce replay-attack risk
- **Aggregation Pipelines** — used for computing subscriber/subscribed-to counts, joining watch history with video/user data, and channel statistics — avoids N+1 query patterns
- **Middleware-based File Upload** — Multer handles temp local storage before streaming to Cloudinary, then cleans up local files
- **Standardized Error/Response Handling** — custom `ApiError` and `ApiResponse` wrapper classes for consistent API contracts
- **Async Handler Wrapper** — avoids repetitive try/catch blocks across controllers

---

## API Endpoints

<details>
<summary><b>Auth & Users</b></summary>

| Method | Endpoint                        | Description               |
|--------|----------------------------------|----------------------------|
| POST   | `/api/v1/users/register`        | Register a new user        |
| POST   | `/api/v1/users/login`           | Login                       |
| POST   | `/api/v1/users/logout`          | Logout (requires auth)      |
| POST   | `/api/v1/users/refresh-token`   | Refresh access token        |
| PATCH  | `/api/v1/users/update-account`  | Update account details      |
| PATCH  | `/api/v1/users/avatar`          | Update avatar               |
| GET    | `/api/v1/users/channel/:username` | Get channel profile (with subscriber aggregation) |
| GET    | `/api/v1/users/history`         | Get watch history           |

</details>

<details>
<summary><b>Videos</b></summary>

| Method | Endpoint                     | Description          |
|--------|-------------------------------|------------------------|
| GET    | `/api/v1/videos`             | Get all videos (paginated) |
| POST   | `/api/v1/videos`             | Upload a video          |
| GET    | `/api/v1/videos/:videoId`    | Get video by ID         |
| PATCH  | `/api/v1/videos/:videoId`    | Update video details    |
| DELETE | `/api/v1/videos/:videoId`    | Delete a video          |

</details>

<details>
<summary><b>Subscriptions, Playlists, Likes, Comments</b></summary>

| Method | Endpoint                                | Description             |
|--------|-------------------------------------------|---------------------------|
| POST   | `/api/v1/subscriptions/c/:channelId`      | Toggle subscription        |
| POST   | `/api/v1/playlist`                        | Create playlist            |
| PATCH  | `/api/v1/playlist/add/:videoId/:playlistId` | Add video to playlist   |
| POST   | `/api/v1/likes/toggle/v/:videoId`         | Toggle like on video        |
| POST   | `/api/v1/comments/:videoId`               | Add comment                 |

</details>

---

## Project Structure

```
src/
├── controllers/     # Route logic
├── models/           # Mongoose schemas
├── routes/           # Express routers
├── middlewares/       # Auth, multer, error handling
├── utils/             # ApiError, ApiResponse, asyncHandler, cloudinary
├── db/                # MongoDB connection
└── app.js / index.js  # App entry point
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for file storage)

### Installation

```bash
git clone https://github.com/<your-username>/videotube-backend.git
cd videotube-backend
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run

```bash
npm run dev
```

Server runs at `http://localhost:8000`

---

## What I Learned

- Designing normalized MongoDB schemas for many-to-many relationships (subscriptions, playlists)
- Writing multi-stage aggregation pipelines (`$lookup`, `$addFields`, `$project`) instead of multiple queries
- Implementing secure JWT refresh token rotation
- Handling file uploads through a temp-storage → cloud-storage pipeline
- Structuring an Express app for maintainability (controllers/services/routes separation)

---

## Acknowledgements

Built while following [Chai aur Backend series by Hitesh Choudhary](https://www.youtube.com/@chaiaurcode) to learn backend fundamentals — used as a base to then design and build original projects like SyncCode and a custom rate limiter.

---

## License

MIT