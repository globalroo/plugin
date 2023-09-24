module.exports = (name, capitalizedName) => {
  return `const { registerAPI } = require("library/api")
  const { registerInvalidations } = require("library/graphql/client-invalidations")
  const { withPermissions } = require("library/authorization")
  
  registerAPI(
      \`
          type Query {
              get${capitalizedName}: String
          }
      \`,
      {
          Query: withPermissions("admin", {
                  get${capitalizedName},
          }),
      }
  )
  
  async function get${capitalizedName}() {
      return "${capitalizedName}"
  }`;
};
