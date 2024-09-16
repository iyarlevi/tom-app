let codeBlockUsers = {};
let studentCounts = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", ({ blockId }) => {
      socket.join(blockId);

      if (!codeBlockUsers[blockId]) {
        codeBlockUsers[blockId] = [];
        studentCounts[blockId] = 0;
      }

      // Assign role to the user
      const usersInBlock = codeBlockUsers[blockId].length;
      const role = usersInBlock === 0 ? "mentor" : "student";
      codeBlockUsers[blockId].push(socket.id);

      socket.emit("role", role);

      if (role === "student") {
        studentCounts[blockId] += 1;
      }

      io.to(blockId).emit("studentCount", studentCounts[blockId]);

      socket.on("codeChange", ({ blockId, code }) => {
        socket.to(blockId).emit("codeUpdate", code);
      });

      socket.on("disconnect", () => {
        codeBlockUsers[blockId] = codeBlockUsers[blockId].filter(
          (id) => id !== socket.id
        );

        if (role === "student") {
          studentCounts[blockId] -= 1;
        }

        io.to(blockId).emit("studentCount", studentCounts[blockId]);

        if (role === "mentor") {
          io.to(blockId).emit("mentorLeft");
        }

        socket.leave(blockId);
      });
    });
  });
};
