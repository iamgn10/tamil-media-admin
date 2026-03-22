"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdStatus = exports.uniquePositions = void 0;
exports.uniquePositions = [
    "Billboard",
    "Large Leaderboard",
    "Leaderboard",
    "Large Mobile Banner"
];
function getAdStatus(start, end) {
    const now = new Date();
    if (now < start)
        return "toPublish";
    if (now > end)
        return "expired";
    return "published";
}
exports.getAdStatus = getAdStatus;
