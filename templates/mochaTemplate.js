module.exports = (name, capitalizedName) => {
  return `const { expect } = require('chai');
  const { get${capitalizedName} } = require('./${name}.server.mjs');
  
  describe('get${capitalizedName} Resolver', () => {
    it('should return "${capitalizedName}"', async () => {
      const result = await get${capitalizedName}();
      expect(result).to.equal('${capitalizedName}');
    });
  });`;
};
