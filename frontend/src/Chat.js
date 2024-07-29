// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { sendMessage, startNewThread } from './apiService';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Arial', sans-serif;
  margin: 0 auto; /* Center the container horizontally */
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background-color: #ffffff;
`;

const MessagesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px 8px 0 0;
  border: 1px solid #ced4da;
`;

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: flex-end;
  ${(props) => (props.role === 'user' ? 'flex-direction: row-reverse;' : 'flex-direction: row;')}
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin: 0 10px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: ${(props) => (props.role === 'user' ? '#007bff' : '#e9ecef')};
  color: ${(props) => (props.role === 'user' ? '#ffffff' : '#333333')};
  align-self: ${(props) => (props.role === 'user' ? 'flex-end' : 'flex-start')};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
  text-align: ${(props) => (props.role === 'user' ? 'right' : 'left')};
`;

const FormGroup = styled.div`
  display: flex;
  padding: 20px;
  background-color: #fff;
  border-top: 1px solid #ced4da;
  border-radius: 0 0 8px 8px;
`;

const FormControl = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  color: #495057;
  background-color: #ffffff;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SendButton = styled.button`
  padding: 12px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeThread = async () => {
      try {
        const data = await startNewThread();
        setThreadId(data.thread_id);
      } catch (error) {
        console.error('Error starting new thread:', error);
      }
    };

    initializeThread();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const userMessage = { role: 'user', content: input, timestamp: new Date().toLocaleString() };
      setMessages([...messages, userMessage]);

      const data = await sendMessage(input, threadId);
      const assistantMessage = { role: 'assistant', content: data.reply, timestamp: new Date().toLocaleString() };
      setMessages([...messages, userMessage, assistantMessage]);
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  return (
    <ChatContainer>
      <ChatArea>
        <MessagesList>
          {messages.map((msg, index) => (
            <MessageContainer key={index} role={msg.role}>
              <Avatar>{msg.role === 'user' ? 'U' : 'A'}</Avatar>
              <div>
                <MessageBubble role={msg.role}>{msg.content}</MessageBubble>
                <Timestamp role={msg.role}>{msg.timestamp}</Timestamp>
              </div>
            </MessageContainer>
          ))}
        </MessagesList>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <SendButton onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </SendButton>
        </FormGroup>
      </ChatArea>
    </ChatContainer>
  );
};

export default Chat;
