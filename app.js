import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import cron from "node-cron";
import { useAzureSocketIO } from "@azure/web-pubsub-socket.io";
import process from "process";
import path from "path";

// Import middleware
import jwtSocketMiddleware from "./middlewares/jwtSocketMiddleware.js";
import { connectDB } from "./db/connect.js";

// Import all routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import {
  handleEventBeforeInitialize,
  handleEventAfterInitialize,
} from "./modules/cornModule.js";

// Import game controllers
import {
  gameParity,
  spareParity,
  fastParity,
  easyParity,
} from "./controllers/gameController.js";
import { incrementCountById } from "./modules/dbModule.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;
const databaseUrl = process.env.DATABASE_URL;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

let ioGameParty = gameRoutes.setIoGame(server);

// Create an async function to perform the initialization
const initializeSocketIO = async () => {
  try {
    // Initialize ioSpareParty
    await useAzureSocketIO(ioGameParty, {
      hub: "game_hub",
      connectionString:
        process.argv[2] || process.env.WebPubSubConnectionString,
    });

    console.log("ioGameParty initialized successfully.");
  } catch (error) {
    console.error("Initialization error:", error);
  }
};

// Call the initialization function
// initializeSocketIO();

ioGameParty.use(jwtSocketMiddleware);

ioGameParty.on("connection", gameParity);

// Define namespaces for parties
const spareNamespace = ioGameParty.of("/spare");
const fastNamespace = ioGameParty.of("/fast");
const easyNamespace = ioGameParty.of("/easy");

spareNamespace.on("connection", spareParity);
fastNamespace.on("connection", fastParity);
easyNamespace.on("connection", easyParity);

// cron schedule events
// Handle Spare Parity schedule
cron.schedule("*/3 * * * *", async () => {
  try {
    const periodId = "6502c66ff3c8210a9981a723";
    // Execute the event before initializeArraysToZero
    const gameResult = await handleEventBeforeInitialize("spareParity");

    // After the promise is resolved
    handleEventAfterInitialize(
      "spareParity",
      spareNamespace,
      gameResult,
      periodId
    );
    incrementCountById(periodId);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Handle Fast Parity
cron.schedule("*/30 * * * * *", async () => {
  try {
    const periodId = "6502c686f3c8210a9981a728";
    // Execute the event before initializeArraysToZero
    const gameResult = await handleEventBeforeInitialize("fastParity");

    // After the promise is resolved
    handleEventAfterInitialize(
      "fastParity",
      fastNamespace,
      gameResult,
      periodId
    );
    incrementCountById(periodId);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Handle Easy Parity
cron.schedule("*/30 * * * * *", async () => {
  try {
    const periodId = "6502c6a4f3c8210a9981a72a";
    // Execute the event before initializeArraysToZero
    const gameResult = await handleEventBeforeInitialize("easyParity");
    // After the promise is resolved
    handleEventAfterInitialize(
      "easyParity",
      easyNamespace,
      gameResult,
      periodId
    );
    incrementCountById(periodId);
  } catch (error) {}
});

// app.use(express.static("./client/dist"));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
// });

const start = async () => {
  try {
    await connectDB(databaseUrl);
    server.listen(PORT, console.log("Server running at " + PORT));
  } catch (error) {
    console.log(error);
  }
};

start();
