require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const cookies = require("cookie-parser");
const login = require("./routes/login");
const user = require("./routes/users");
const message  = require("./routes/message");
const convo = require("./routes/conversation");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const convoModel = require("./models/convo")
const newUser = require("./models/user");
const app = express();
app.use(express.json());
app.use(cookies());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});
const onlineUsers = new Map();

const AWAY_TIMEOUT = 5 * 60 * 1000;

 async function markAway (userId) {
    const user = onlineUsers.get(String(userId));
    if (!user || user.sockets.size === 0) return;


     await updatePresence(userId, "away");
}

function resetAwayTimer(userId) {
    const user = onlineUsers.get(String(userId));
    if (!user) return;

    clearTimeout(user.timer);

    user.timer = setTimeout(() => {
        markAway(userId);
    }, AWAY_TIMEOUT);
}
async function updatePresence(userId, status) {
    await newUser.findByIdAndUpdate(userId, {
        Status: status
    });

    io.emit("presenceUpdate", {
        userId: String(userId),
        status
    });
}

async function markOnline(userId) {
    const user = onlineUsers.get(String(userId));

    if (!user || user.sockets.size === 0) return;

    clearTimeout(user.timer);

    await updatePresence(userId, "online");

    resetAwayTimer(userId);
}

app.set("io", io);


io.use((socket, next) => {
    try {
      const parsedCookies = cookie.parse(
    socket.handshake.headers.cookie || ""
);

const token = parsedCookies.jwtToken;
        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.userId = decode.userId;

        next();
    } catch (error) {
           console.error("Socket auth failed:", error.name, error.message);
        next(new Error("Invalid authentication"));
    }
});



io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // 1. Identify the authenticated user
    const userId = String(socket.userId);

    // 2. Get or create their presence entry
    let userState = onlineUsers.get(userId);

    if (!userState) {
        userState = {
            sockets: new Set(),
            timer: null
        };

        onlineUsers.set(userId, userState);
    }

    // 3. Track this connection
    userState.sockets.add(socket.id);

    // 4. Mark the user online and start their inactivity timer
    markOnline(userId);

    // 5. Handle authorized conversation room joining
    socket.on("joinConversation", async (conversationId) => {
        try {
            const conversation = await convoModel.findOne({
                _id: conversationId,
                participents: socket.userId
            });

            if (!conversation) {
                socket.emit(
                    "joinConversationError",
                    "Access denied"
                );
                return;
            }

            socket.join(String(conversationId));

            console.log(
                `User joined conversation: ${conversationId}`
            );
        } catch (error) {
            console.error("Room join failed:", error.message);

            socket.emit(
                "joinConversationError",
                "Could not join conversation"
            );
        }
    });

    // 6. Handle disconnection in ONE place
    socket.on("disconnect", async () => {
        const currentUser = onlineUsers.get(userId);

        if (!currentUser) return;

        currentUser.sockets.delete(socket.id);

        console.log("User disconnected:", socket.id);

        // Only mark offline when the final connection closes
        if (currentUser.sockets.size === 0) {
            clearTimeout(currentUser.timer);
            onlineUsers.delete(userId);

            try {
                await updatePresence(userId, "offline");
            } catch (error) {
                console.error(
                    "Failed to update offline status:",
                    error.message
                );
            }
        }
    });

    socket.on("activity", () => {
  markOnline(userId);
});


});




database();

const port = 3000;


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))



app.use("/api/auth",login);
app.use("/api/conversation",convo);
app.use("/api",message);
app.use("/api/users",user)


server.listen(port, () => {
  console.log("Server running on port 3000");
});

