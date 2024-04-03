// eslint-disable-next-line import/no-internal-modules
import cors from "cors";
import app from "./vercel";

app.use(cors());

const port = 21212;

app.listen(port, () => {
  console.log(`Server listening... http://localhost:${port}/`);
});
