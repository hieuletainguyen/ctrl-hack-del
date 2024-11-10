import "dotenv/config";
import express from "express";
import cors from "cors";
import account_routes from "./routes/account_route.js";
import patient_routes from "./routes/patient_route.js";
import nurse_routes from "./routes/nurse_route.js";
import skill_routes from "./routes/skill_route.js";
import cookieParser from 'cookie-parser';

const app = express();

const port = 9897;

var corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(express.json());
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(account_routes)
app.use(patient_routes)
app.use(nurse_routes)
app.use(skill_routes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app;
