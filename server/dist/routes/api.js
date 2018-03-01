"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../lib/logger"));
const router = express_1.default.Router();
const wot_import_1 = require("../lib/wot-import");
const wot_get_1 = require("../lib/wot-get");
router.get('/clan', (req, res, next) => {
    let clanInfo = wot_get_1.getSingleObject("clan-info");
    res.json(clanInfo);
});
router.get('/tanks', (req, res, next) => {
    let tanksData = wot_get_1.getSingleObject("tanks");
    res.json(tanksData);
});
router.get('/dates', (req, res, next) => {
    let dates = wot_get_1.getStatDates();
    res.json(dates);
});
router.get('/clan-rating', (req, res, next) => {
    let stats = wot_get_1.getSingleObject("clan-rating");
    res.json(stats);
});
router.get('/personal-stats', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    let date = req.query.date;
    let baseDate = req.query.basedate;
    let stat = req.query.stat;
    if (!stat) {
        return next(new Error("Invalid Parameters"));
    }
    if (!date) {
        baseDate = undefined;
        date = Math.max.apply(null, wot_get_1.getStatDates());
    }
    let stats = wot_get_1.getPersonalStats(new Date(+date), baseDate ? new Date(+baseDate) : null, stat);
    res.json(stats);
}));
router.get('/updateStats/:force?', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    var force = req.params.force;
    try {
        let executionDate = null;
        try {
            executionDate = new Date(wot_get_1.getSingleObject("execution-time"));
        }
        catch (error) {
            logger_1.default.error(error);
        }
        if (!executionDate || executionDate.getDate() != new Date().getDate() || (force === 'true')) {
            try {
                let r = yield wot_import_1.importData();
                logger_1.default.info('/updateStats', { status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
                res.json({ status: 'UPDATED', lastUpdate: r.updateDate, executionTime: r.duration });
            }
            catch (err) {
                logger_1.default.error('/updateStats', err);
                res.json({ status: 'ERROR', error: err.toString() });
            }
        }
        else {
            logger_1.default.info('/updateStats', { status: 'NOTUPDATED', lastUpdate: executionDate });
            res.json({ status: 'NOTUPDATED', lastUpdate: executionDate });
        }
    }
    catch (error) {
        next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=api.js.map