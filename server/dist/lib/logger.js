"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
const winston_1 = __importDefault(require("winston"));
winston_1.default.configure({
    transports: [
        new (winston_1.default.transports.Console)({ level: 'error' }),
        new (winston_1.default.transports.File)({ name: 'error-file', filename: 'error.log', level: 'error' }),
    ]
});
winston_1.default.cli();
module.exports = winston_1.default;
//# sourceMappingURL=logger.js.map