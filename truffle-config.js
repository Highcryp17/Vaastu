module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Port used by Ganache GUI
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
      evmVersion: "paris"
    },
  },
};
