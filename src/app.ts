import cors from 'cors';
import express, { Request, Response } from 'express';
import bot from './routes/bot/bot';

const app = express();
const port = 3008;

const allowedOrigins = ['*'];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
if (req.method === "OPTIONS") {
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  return res.status(200).json({});
}

next();
});
app.use(express.json());

app.listen(port, () => {
  console.log(`Started @ Port: ${port}.`);
});

app.use('/bot', bot);