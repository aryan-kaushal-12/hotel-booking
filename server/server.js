import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./config/db.js"
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./config/cloudinary.js"
import roomRouter from "./routes/roomRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import { stripeWebhooks } from "./controllers/stripeWebhooks.js"

// import mongoose from "mongoose"

// mongoose.set('strictQuery', true);

// console.log("MONGO_URI:", process.env.MONGODB_URI);


// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.log('MongoDB connection error:', err));

connectDB();
connectCloudinary();

const app = express()
app.use(cors()) //Enable Cross Origin Resource Sharing

// API to listen to Stripe Webhooks
app.post('/api/strupe', express.raw({type: "application/json"}), stripeWebhooks)

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// API to listen Clerk Webhooks
app.use("/api/clerk", clerkWebhooks)

app.get('/', (req, res) => res.send("API is working"))
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));