import { fireEvent, render, screen } from '@testing-library/react';
import { default as Post } from '@components/PostList/Post';
import dayjs from 'dayjs';

describe('Post component', () => {
  test('renders the post component', () => {
    const { getByText } = render(
      <Post
        id="holetex123"
        fullName="Hoan Tiny"
        content="Test"
        createAt={Date.now()}
      />
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

  test('renders the correct number of comments', () => {
    const comments = [
      {
        _id: '1',
        comment: 'First comment',
        createdAt: dayjs().toISOString(),
        author: { _id: 'a1', fullName: 'John Doe' },
      },
      {
        _id: '2',
        comment: 'Second comment',
        createdAt: dayjs().toISOString(),
        author: { _id: 'a2', fullName: 'Jane Doe' },
      },
    ];
    render(
      <Post
        id="Hoantiny"
        fullName="Hoan Tiny"
        content="Test"
        createAt={Date.now()}
        comments={comments}
      />
    );

    expect(screen.getByText('2 Comments')).toBeInTheDocument();
  });
  test('toggles comment box when Comment button is clicked', () => {
    render(
      <Post
        fullName="Hoan Tiny"
        content="Test"
        createAt={Date.now()}
        comments={[]}
      />
    );

    expect(screen.queryByPlaceholderText('Write a comment...')).toBeNull();
    const commentButton = screen.getByText('Comments');
    fireEvent.click(commentButton);
    expect(
      screen.getByPlaceholderText('Write a comment...')
    ).toBeInTheDocument();
  });
});

describe('Comment section', () => {
  test('renders the correct number of comments', () => {
    const comments = [
      {
        _id: '1',
        comment: 'First comment',
        createdAt: dayjs().toISOString(),
        author: { _id: 'a1', fullName: 'John Doe' },
      },

      {
        _id: '2',
        comment: 'Second comment',
        createdAt: dayjs().toISOString(),
        author: { _id: 'a2', fullName: 'Jane Doe' },
      },
    ];
  });
});
