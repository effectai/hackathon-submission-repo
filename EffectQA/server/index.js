import Fastify from "fastify";
import { join, dirname } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import fastifyCors from "fastify-cors";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

db.data = db.data || { campaigns: [] };

const fastify = Fastify({
  logger: true,
});
// CommonJs

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    cb(null, true); // * (restrict on production)
  },
});

// Declare a route
fastify.get("/campaigns", async (request, reply) => {
  const p = request.query;
  console.log("p", p);
  await db.read();
  if (p.address) {
    return db.data.campaigns.filter((r) => r.owner[1] === p.address);
  }
  return db.data.campaigns;
});

fastify.post("/campaign", async (request, reply) => {
  const body = request.body;
  console.log("post", body);
  const { campaigns } = db.data;
  campaigns.push(body);
  await db.write();

  reply.send(body);
});

// Run the server!
fastify.listen(3001, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening on ${address}`);
});
