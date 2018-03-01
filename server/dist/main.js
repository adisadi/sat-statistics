"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
// Get dependencies
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
// Get our API routes
const api_1 = __importDefault(require("./routes/api"));
const app = express_1.default();
app.use(morgan_1.default("dev"));
// Set our api routes
app.use('/api', api_1.default);
// Point static path to dist
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist')));
// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'dist/index.html'));
});
/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
//# sourceMappingURL=main.js.map