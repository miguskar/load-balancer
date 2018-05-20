import express from 'express';
import expressValidator from 'express-validator';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(expressValidator());

// add routes
app.use(routes);

export default app;