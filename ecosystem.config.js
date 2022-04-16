const Sunucu = "Sorn";
module.exports = {
    apps: [
      {
        name: `${Sunucu}-Mainframe`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Moderation"
      },
      {
        name: `${Sunucu}-Requirements`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Requirements"
      },
      {
        name: `${Sunucu}-Statistics`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Statistics"
      },
      {
        name: `${Sunucu}-FW_ONE`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_ONE"
      },
      {
        name: `${Sunucu}-FW_TWO`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_TWO"
      },
      {
        name: `${Sunucu}-FW_THREE`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_THREE"
      },
      {
        name: `${Sunucu}-FW_FOUR`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./Firewall_FOUR"
      },
      {
        name: `${Sunucu}-FW_DIST`,
        namespace: "Passenger",
        script: 'passenger.js',
        watch: false,
        exec_mode: "cluster",
        max_memory_restart: "2G",
        cwd: "./FIREW_Distributors"
      },
    ]
  };
