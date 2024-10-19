import "dotenv-safe/config";
import Express from "express";

import { addTrpc } from "@api/app-router";
import { env } from "@api/env";
import { IS_PROD } from "@api/utils/constants";

function main() {
  const app = Express();

  if (IS_PROD) {
    app.set("trust proxy", 1);
  }

  addTrpc(app);

  app.listen(env.PORT, () => {
    console.log(`🚀 Server started at ${env.PORT}`);
  });
}

main();
