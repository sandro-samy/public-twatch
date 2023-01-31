import mongoose from "mongoose";
import type { Schema } from "mongoose";
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
// create new connection if it doesn't exist

const connection: { isConnected?: number } = {};

const connect = async () => {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }
  mongoose.set("strictQuery", true);
  const db = await mongoose.connect(process.env.MONGO_URI!);
  console.log("new connection");
  connection.isConnected = db.connections[0].readyState;
};

export const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = undefined;
    } else {
      console.log("disconnected");
    }
  }
};

const db = { connect, disconnect };
export default db;
