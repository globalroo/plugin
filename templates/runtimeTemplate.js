module.exports = (name, capitalizedName, safeName) => `
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import { get${capitalizedName}s, create${capitalizedName}, delete${capitalizedName} } from "./controller/${name}.api.js";
import { setFromEvent } from "lib/setFromEvent";
import { PageBreadcrumbContainer } from "lib/page-breadcrumb-container.js";
import { appRoute } from "routes/app/home.runtime.js";
import { Stack } from "@mui/material";
import { registerConditionalPageNavigation } from "lib/routes/register-conditional-page-navigation"
import { hasDemand } from "lib/authorization/has-demand"
import Iconify from "minimals-template/components/Iconify"

appRoute.register("${name}", <${capitalizedName} />);

registerConditionalPageNavigation(
    () => hasDemand("user") && hasDemand("!sharing"),
    "/app/${name}",
    "${capitalizedName}",
    <Iconify icon="mdi:unicorn" />,
    {
        group: "${capitalizedName}",
        subPaths: false,
        priority: 0,
    }
)

export function ${capitalizedName}() {
    const ${safeName} = get${capitalizedName}s.useResults();
    const [inputValue, setInputValue] = useState("");
    
    return (
        <PageBreadcrumbContainer>
            <Stack spacing={2} sx={{ mt: 2, flex: 1 }}>
                <List>
                    {${safeName} &&
                        ${safeName}.map((item) => (
                            <ListItem key={item._id}>
                                <ListItemText primary={item.name} secondary={item._id} />
                                <ListItemSecondaryAction>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                </List>
                <TextField
                    value={inputValue}
                    onChange={setFromEvent(setInputValue)}
                    label="Name"
                    variant="outlined"
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Create
                </Button>
            </Stack>
        </PageBreadcrumbContainer>
    );

    async function handleCreate() {
        await create${capitalizedName}({ name: inputValue });
    }

    async function handleDelete(id) {
        await delete${capitalizedName}({ id });
    }
}`
