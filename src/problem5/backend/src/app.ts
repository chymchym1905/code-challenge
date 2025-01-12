import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import routes from './routes';

const port = config.get('server.port');

const app = express();
app.set('port', port);
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.options('*', [cors({ credentials: true })]);

routes(app);

export default app;
