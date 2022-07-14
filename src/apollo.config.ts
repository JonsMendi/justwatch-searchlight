module.exports = {
  client: {
    service: {
      name: "justwatch-searchlight",
      // URL to the GraphQL API
      url: "https://apis.justwatch.com/graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "src/**/*.js"],
  },
};
