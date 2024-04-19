import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// this is a middleware that will validate the access token sent by the client
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// this is a public endpoint because it doesn't have the requireAuth middleware
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.get("/api/groups", async (req, res) => {
  const groups = await prisma.group.findMany();
  res.json(groups);
});

app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/api/users/auth0/:auth0Id", async (req, res) => {
  const auth0Id = req.params.auth0Id;
  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });
  res.json(user);
});

app.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const { fullname, gender, college, cohort, phone } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id),
      },
      data: {
        fullname,
        gender,
        college,
        cohort,
        phone,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user information" });
  }
});

// Get a user by user ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Get groups of a user
app.get("/api/users/:userId/groups", async (req, res) => {
  const { userId } = req.params;
  const records = await prisma.User_Group.findMany({
    where: {
      userId: parseInt(userId),
    },
  });
  const groupIds = records.map((record) => record.groupId);
  const groups = await prisma.group.findMany({
    where: {
      id: {
        in: groupIds,
      },
    },
  });
  res.json(groups);
});

app.get("/api/groups/:id", async (req, res) => {
  const { id } = req.params;
  const group = await prisma.group.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(group);
});

// Add a user to a group
app.post("/api/users/:userId/groups/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;
  const { role } = req.body;

  // Check if a record with the same userId and groupId already exists
  const existingRecord = await prisma.User_Group.findFirst({
    where: {
      userId: parseInt(userId),
      groupId: parseInt(groupId),
    },
  });

  if (existingRecord) {
    // If a record already exists, return an error response
    return res.status(400).json({
      error: "A record with the same userId and groupId already exists",
    });
  }

  // If no record exists, create a new one
  const record = await prisma.User_Group.create({
    data: {
      userId: parseInt(userId),
      groupId: parseInt(groupId),
      role,
    },
  });

  res.json(record);
});

// Remove a user from a group
app.delete("/api/users/:userId/groups/:groupId", async (req, res) => {
  const { userId, groupId } = req.params;

  const record = await prisma.user_Group.delete({
    where: {
      userId_groupId: {
        userId: parseInt(userId),
        groupId: parseInt(groupId),
      },
    },
  });

  res.json(record);
});

// create a group
app.post("/api/groups/:userId", async (req, res) => {
  const { name, description } = req.body;
  const { userId } = req.params;

  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        userId: parseInt(userId),
      },
    });

    res.json(group);
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// delete a group
app.delete("/api/groups/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user_Group.deleteMany({
      where: {
        groupId: parseInt(id),
      },
    });

    await prisma.group.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
});

// get Profile information of authenticated user
app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// this endpoint is used by the client to verify the user status and to make sure the user is registered in our database once they signup with Auth0
// if not registered in our database we will create it.
// if the user is already registered we will return the user information
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

// get posts of a group
app.get("/api/groups/:groupId/posts", async (req, res) => {
  const { groupId } = req.params;
  const posts = await prisma.post.findMany({
    where: {
      groupId: parseInt(groupId),
    },
  });
  res.json(posts);
});

// get latest post
app.get("/api/post", async (req, res) => {
  const post = await prisma.post.findFirst({
    orderBy: {
      postDate: "desc",
    },
  });
  res.json(post);
});

// create a post in a group
app.post("/api/groups/:groupId/:userId/posts", async (req, res) => {
  const { groupId, userId } = req.params;
  const { content } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        userId: parseInt(userId),
        groupId: parseInt(groupId),
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// delete a post by id
app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

const PORT = parseInt(process.env.PORT) || 8080;

app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT} 🎉 🚀");
});
