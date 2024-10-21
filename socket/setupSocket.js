const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { colorizeText } = require("./others");

function setupSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {

    console.log(colorizeText("..........A user connected Successfuly............ :", "yellow"))

    //Handle all the events
    require('./socket-events')(socket, io);

    socket.on("sampletesting", (data) => {
      console.log(colors.cyan("data add Successfully", data));
      io.sockets.emit("gettingTesting", data);
      console.log(colors.cyan("data get Successfully", data));
    });

    socket.on('disconnect', () => {
      console.log(colorizeText("..........A user disconnected............ :", "blue"))
    });
  });
}

module.exports = setupSocket;
