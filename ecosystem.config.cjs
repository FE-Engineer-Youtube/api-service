module.exports = {
  apps: [
    {
      name: "express-api-cluster",
      script: "server.js",
      instances: 4,
      port: 3000,
      max_memory_restart: "500M",
      exec_mode: "cluster_mode",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
