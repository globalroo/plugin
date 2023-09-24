module.exports = (name, capitalizedName) => {
  return `import { render } from '@testing-library/react';
  import ${capitalizedName} from './${name}.runtime.js';
  
  test('${capitalizedName} component renders correctly', () => {
    const { getByText } = render(<${capitalizedName} />);
    expect(getByText('${capitalizedName}')).toBeInTheDocument();
  });`;
};
