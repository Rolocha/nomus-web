module.exports = {
  client: {
    service: {
      name: "rolocha-server",
      url: "http://localhost:3000/graphql",
    },
    includes: ["client/src/**/*.{ts,tsx,js,jsx,graphql}"],
  },
};
