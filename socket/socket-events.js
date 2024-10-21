const { ChatRoom, ChatMessage } = require("../config/database").db;
//const jwt = require('jsonwebtoken'); // Import JWT for token validation

module.exports = (socket, io) => {
  // Join a room based on user ids
  socket.on('joinRoom', async ({ referedBy, referedTo, patientId, token }) => {
    try {
      // Validate token
      //const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let room = await ChatRoom.findOne({
        where: { referedBy, referedTo, patientId },
        attributes: ['id']
      });
      // Create room if not exist
      if (!room) {
        room = await ChatRoom.create({
          referedBy, referedTo, patientId
        });
      }
      const roomId = room.id;

      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
      socket.emit('roomJoined', roomId);
    } catch (error) {
      console.error('Token validation failed', error);
      socket.emit('error', 'Authentication failed'); // Send error to client
    }
  });

  // Listen to messages sent to this room
  socket.on('chatMessage', async ({ message, senderId, roomId }) => {
    try {
      console.log('chatMessage', message, senderId, roomId);

      const chat = await ChatMessage.create({
        message,
        roomId,
        senderId,
      });

      io.to(roomId).emit('chatMessage', chat.dataValues); // Send to room
    } catch (error) {
      console.error('Error saving chat message', error);
      socket.emit('error', 'Could not send message'); // Send error to client
    }
  });
};
