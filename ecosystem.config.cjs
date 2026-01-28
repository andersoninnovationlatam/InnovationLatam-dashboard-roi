module.exports = {
  apps: [
    {
      name: 'dashboard-roi-react',
      script: 'npx',
      args: 'serve dist -l 3000 -s',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
};
