// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { sendMessage, startNewThread } from './apiService';
import { Button, Container, Form, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [threadId, setThreadId] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            const userMessage = { role: 'user', content: input };
            setMessages([...messages, userMessage]);

            const data = await sendMessage(input, threadId);
            const assistantMessage = { role: 'assistant', content: data.reply };
            setMessages([...messages, userMessage, assistantMessage]);
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
        setLoading(false);
    };

    return (
        <Container>
            <h2>Chat with Virtual Assistant</h2>
            
            <ListGroup>
                {messages.map((msg, index) => (
                    <ListGroup.Item key={index}>
                        <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <Form.Group className="mt-3">
                <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
            </Form.Group>
            <Button className="mt-2" onClick={handleSendMessage} disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
            </Button>
            <br></br>
            <Button variant="secondary" className="ml-3" onClick={() => navigate('/')}>Back to Main Menu</Button>
            
        </Container>
    );
};

export default Chat;
