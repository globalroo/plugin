module.exports = (name, capitalizedName) => `
import { registerAPI } from "library/api/index.js"
import { withPermissions } from "library/authorization/index.js"
import { NOT_DELETED } from "library/database/constants.js"
import { generate } from "library/guid/index.js"
import { registerInvalidations } from "library/graphql/client-invalidations.js"
import { defineTable } from "library/database/define-table.js"

// move to known-tables.js if it's not a self-contained feature
export const ${capitalizedName} = defineTable("${name}", { setClient: true })
${capitalizedName}.initialise().catch(console.error)

registerAPI(
    /* GraphQL */
    \`
        type ${capitalizedName} {
            _id: String
            name: String!
        }

        type Query {
            get${capitalizedName}s: [${capitalizedName}]
        }

        type Mutation {
            create${capitalizedName}(name: String!): ${capitalizedName}
            update${capitalizedName}(id: String!, name: String): ${capitalizedName}
            delete${capitalizedName}(id: String!): ${capitalizedName}
        }
    \`,
    {
        Query: {
            ...withPermissions("admin", {
                ...registerInvalidations(${capitalizedName}.source, {
                    get${capitalizedName}s,
                }),
            }),
        },
        Mutation: {
            ...withPermissions("admin", {
                create${capitalizedName},
                update${capitalizedName},
                delete${capitalizedName},
            }),
        },
    }
)

export async function get${capitalizedName}s() {
    return ${capitalizedName}.list(NOT_DELETED)
}

export async function create${capitalizedName}(_, { name }) {
    const new${capitalizedName} = {
        _id: \`\${generate()}:sfg20/${capitalizedName}}\`,
        name,
        // other fields here
    }
    
    try {
        return await ${capitalizedName}.put(new${capitalizedName})
    } catch (err) {
        throw new Error(\`Error creating ${name}: \${err.message}\`)
    }
}

export async function update${capitalizedName}(_, { id, name }) {
    const existing${capitalizedName} = await ${capitalizedName}.get(id)
    if (!existing${capitalizedName}) throw new Error("${capitalizedName} not found.")
    
    const updated${capitalizedName} = {
        ...existing${capitalizedName},
        name,
    }
    
    try {
        return await ${capitalizedName}.put(updated${capitalizedName})
    } catch (err) {
        throw new Error(\`Error updating ${name}: \${err.message}\`)
    }
}

export async function delete${capitalizedName}(_, { id }) {
    const existing${capitalizedName} = await ${capitalizedName}.get(id)
    if (!existing${capitalizedName}) throw new Error("Unknown ${name}.")
    
    try {
        return await ${capitalizedName}.put({ ...existing${capitalizedName}, deleted: 1, _deleted: 1 })
    } catch (err) {
        throw new Error(\`Error deleting ${name}: \${err.message}\`)
    }
}
`
