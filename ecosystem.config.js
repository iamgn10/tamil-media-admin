module.exports = {
  apps: [
    {
      name: 'tamilmedia-api',
      script: './dist/app.js', // or './src/index.js' or 'npm' for npm start
      instances: 2, // Number of instances (use 'max' for CPU cores)
      exec_mode: 'cluster', // or 'fork' for single instance
      autorestart: true,
      watch: false, // Set to true for development
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add your environment variables here
      },
      error_file: '/var/log/tamilmedialk-api/err.log',
      out_file: '/var/log/tamilmedialk-api/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Restart delay
      // restart_delay: 4000,
      // Kill timeout
      // kill_timeout: 5000,
      // Listen timeout
      // listen_timeout: 10000,
      // Exponential backoff restart delay
      // exp_backoff_restart_delay: 100,
    },
    // Example: Another application
    // {
    //   name: 'api-service',
    //   script: './dist/server.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 4000,
    //   },
    // },
    // Example: Using npm script
    // {
    //   name: 'frontend-app',
    //   script: 'npm',
    //   args: 'start',
    //   cwd: '/var/www/frontend-app',
    //   instances: 1,
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 5000,
    //   },
    // },
  ],
};