import { render } from '@testing-library/react';
import { default as Post } from '@components/PostList/Post';

describe('Post component', () => {
  test('renders the post component', () => {
    const { getByText } = render(
      <Post fullName="Hoan Tiny" content="Test" createAt={Date.now()} />
    );

    expect(getByText('Hoan Tiny')).toBeInTheDocument();
  });
});
