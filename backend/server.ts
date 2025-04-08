import * as http from "http";
import app from "./app";
import dotenv from "dotenv";
dotenv.config({ path: "./token.env" });
const server = http.createServer(app);
const normalizePort = (val: string): number | string | false => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || "4000");

app.set("port", port);

const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const address = server.address();

  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");

      process.exit(1);

      break;

    case "EADDRINUSE":
      console.error(bind + " is already in use.");

      process.exit(1);

      break;

    default:
      throw error;
  }
};

server.on("error", errorHandler);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
