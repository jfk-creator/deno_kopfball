import { defineConfig } from "vite";

export default defineConfig({
  // You can add other configurations here if needed

  // If you are experiencing issues with automatic refreshing,
  // particularly on certain operating systems or file systems,
  // enabling polling can sometimes help.
  server: {
    watch: {
      usePolling: true, // Enable polling (use only if necessary)
    },
  },
});
