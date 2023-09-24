
# Plugin

Plugin is a Node.js package designed to automate the creation of a plugin with a specific file structure and predefined content. The package is highly customizable, allowing users to define the plugin name and tailor the content to meet their requirements.

## Installation

To install Plugin using [npm](https://npmjs.com), run the following command:

```sh
npm install -g cymru@plugin
```
````

## Usage

Navigate to the directory where you want to create the new plugin and execute the following command:

```sh
npx plugin <PluginName>
```

Replace `<PluginName>` with the desired name for your plugin. The package will then create a directory with the specified name and populate it with the appropriate file structure and content.

Upon completion, the script will automatically execute `npm run scan` at the level of the nearest package.json

## Features

- Customizable plugin structure generation
- Predefined file content for quick setup, with easy modification options
- Automatic execution of `npm run scan` post-creation

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).
