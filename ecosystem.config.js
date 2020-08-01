module.exports = {
  apps: [
    {
      name: 'App Express',
      script: 'npm run serve:production',

      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
