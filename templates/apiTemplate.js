module.exports = (name, capitalizedName) => {
  return `import { api } from "lib/graphql/api"
  import { gql } from "@apollo/client"
  import { query } from "lib/graphql/query"
  
  export const get${capitalizedName} = api(function get${capitalizedName}() {
      return query(
          gql\`
              query Get${capitalizedName} {
                  get${capitalizedName}
              }
          \`,
          {},
          { returns: "get${capitalizedName}" }
      )
  })`;
};
