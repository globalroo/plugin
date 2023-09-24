module.exports = (name, capitalizedName) => {
  return `import { get${capitalizedName} } from "./${name}/controller/${name}.api.js"
  
  function ${capitalizedName}() {
      const ${name} = get${capitalizedName}.useResults()
      
      return <div>{${name}}</div>
  }`;
};
