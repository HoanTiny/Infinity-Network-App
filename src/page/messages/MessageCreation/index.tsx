/* eslint-disable @typescript-eslint/no-explicit-any */
import Send from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import {
  useMarkConversationAsSeenMutation,
  useSendMeassageMutation,
} from '@services/messagesApi';
import { useEffect, useState } from 'react';

const MessageCreation = ({ userId, ref }: any) => {
  const [newMessage, setNewMessage] = useState('');
  const [markConversationAsSeen] = useMarkConversationAsSeenMutation();

  const [sendMessage] = useSendMeassageMutation();

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      await sendMessage({
        message: newMessage.toString(),
        receiver: userId,
      })
        .unwrap()
        .then(() => {
          console.log('Message sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send message:', error);
        });
    }

    console.log('message sent:', newMessage, userId);
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    setNewMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && newMessage.trim() !== '') {
      event.preventDefault(); // Prevents the default action of adding a new line
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (userId) {
      markConversationAsSeen({ sender: userId });

      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [userId, markConversationAsSeen, ref]);
  return (
    <div className="flex items-center">
      <TextField
        variant="outlined"
        size="small"
        placeholder="Type a message..."
        className="flex-1 mr-2 rounded-lg "
        value={newMessage}
        onKeyDown={handleKeyDown}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button
        onClick={handleSendMessage}
        className={`${
          newMessage.trim() !== '' ? 'text-[#3096e0]' : 'cursor-not-allowed'
        } p-2 rounded-lg text-[#ccc]`}
        disabled={newMessage.trim() === ''}
      >
        <Send
          style={{ fontSize: 28 }}
          className={`${newMessage.trim() !== '' ? 'text-[#3096e0]' : ''}`}
        />
      </button>
    </div>
  );
};

export default MessageCreation;
