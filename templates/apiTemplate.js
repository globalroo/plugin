module.exports = (name, capitalizedName) => `
import { api } from "lib/graphql/api"
import { gql } from "@apollo/client"
import { query } from "lib/graphql/query"
import { mutate } from "lib/graphql/mutate"

export const get${capitalizedName}s = api(async function get${capitalizedName}s() {
    return query(
        gql\`
            query Get${capitalizedName}s {
                get${capitalizedName}s {
                    _id
                    name
                }
            }
        \`,
        {},
        { returns: "get${capitalizedName}s" }
    )
})

export const create${capitalizedName} = api(async function create${capitalizedName}({ name }) {
    return mutate(
        gql\`
            mutation Create${capitalizedName}($name: String!) {
                create${capitalizedName}(name: $name) {
                    _id
                    name
                }
            }
        \`,
        { name },
        { returns: "create${capitalizedName}" }
    )
})

export const update${capitalizedName} = api(async function update${capitalizedName}({ id, name }) {
    return mutate(
        gql\`
            mutation Update${capitalizedName}($id: String!, $name: String) {
                update${capitalizedName}(id: $id, name: $name) {
                    _id
                    name
                }
            }
        \`,
        { id, name },
        { returns: "update${capitalizedName}" }
    )
})

export const delete${capitalizedName} = api(async function delete${capitalizedName}({ id }) {
    return mutate(
        gql\`
            mutation Delete${capitalizedName}($id: String!) {
                delete${capitalizedName}(id: $id) {
                    _id
                    name
                }
            }
        \`,
        { id },
        { returns: "delete${capitalizedName}" }
    )
})
`
