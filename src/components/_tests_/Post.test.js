import { render } from '@testing-library/react';
import { default as Post } from '@components/PostList/Post';

describe('Post component', () => {
  test('renders the post component', () => {
    const { getByText } = render(
      <Post fullName="Hoan Tiny" content="Test" createAt={Date.now()} />
    );

    expect(getByText('Hoan Tiny')).toBeInTheDocument();
  });

  test('displays the correctnumber of likes', () => {
    const likes = [1, 2, 4];
    const { getByText } = render(
      <Post
        fullName="Hoan Tiny"
        content="Test"
        createAt={Date.now()}
        likes={likes}
      />
    );

    expect(getByText('3')).toBeInTheDocument();
  });
});

// rafce
