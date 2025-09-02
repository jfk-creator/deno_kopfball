import { defineConfig } from "vite";

export default defineConfig({
  // You can add other configurations here if needed

  // If you are experiencing issues with automatic refreshing,
  // particularly on certain operating systems or file systems,
  // enabling polling can sometimes help.
  server: {
    allowedHosts: [
      'server.nanohack.de',
      'localhost', // Often a good idea to include localhost
      '127.0.0.1' // And the loopback address
    ],
    watch: {
      usePolling: true,
    },
  },
});
