const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

require("@testing-library/jest-dom");