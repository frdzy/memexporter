import { render } from '@redwoodjs/testing/web';

import ImportPage from './ImportPage';

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ImportPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImportPage />);
    }).not.toThrow();
  });
});
