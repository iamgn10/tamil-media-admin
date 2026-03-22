"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniquePositions = void 0;
exports.getAdStatus = getAdStatus;
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
