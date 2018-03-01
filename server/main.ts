// Get dependencies
import express from 'express';
import path from 'path';
import http from 'http';
import morgan from 'morgan';
// Get our API routes
import api from './routes/api';

const app = express();
/* //Morgan logging
app.use(morgan('dev', {
    skip: function (req:Request, res:Response) {
        return res.status < 400
    }, stream: process.stderr
}));

app.use(morgan('dev', {
    skip: function (req:Request, res:Response) {
        return res.status >= 400
    }, stream: process.stdout
})); */

// Set our api routes
app.use('/api', api);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));