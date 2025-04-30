// Configuration data for the game service
module.exports = {
    port: process.env.PORT || 8001,
    time: 20,
    rounds: 3,
    hints: 3,
    modes: ["musician", "scientist", "actor", "painter", "writer"]
};