'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Send, Phone, Video, MoreVertical, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function MessagesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      const interval = setInterval(() => fetchMessages(selectedUserId), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUserId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      try {
        const response = await axios.get(`${API_URL}/messages/conversations`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
          timeout: 10000
        });

        const convs = response.data.conversations || [];
        setConversations(convs);
        setHasAccess(convs.length > 0);

        if (convs.length > 0 && !selectedUserId) {
          setSelectedUserId(convs[0].otherUserId);
        }
      } catch (apiErr: any) {
        console.error('Conversations API error:', apiErr);
        setHasAccess(false);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setHasAccess(false);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const response = await axios.get(`${API_URL}/messages/${otherUserId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
        timeout: 10000
      });

      setMessages(response.data.messages || []);
    } catch (err: any) {
      console.error('Error fetching messages:', err);
      if (err.response?.status === 403) {
        toast.error('Unable to load messages');
      }
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedUserId) return;

    try {
      setIsSendingMessage(true);
      const token = localStorage.getItem('authToken');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      await axios.post(
        `${API_URL}/messages`,
        {
          receiverId: selectedUserId,
          message: messageText
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessageText('');
      await fetchMessages(selectedUserId);
      toast.success('Message sent');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.otherUserId === selectedUserId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/50 mb-6">
            <Lock size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Messaging Locked</h2>
          <p className="text-zinc-400 max-w-md mx-auto mb-8">
            Messaging is only available after a student books a session or takes a subscription. You currently have no active bookings.
          </p>
          <button
            onClick={() => router.push('/mentor-dashboard/bookings')}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            View Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-zinc-400 mt-2">Chat with your students</p>
      </div>

      {/* Main Chat Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <div className="lg:col-span-1 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-zinc-800">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition text-sm"
              />
            </div>
          </div>

          {/* Chat Items */}
          <div className="flex-1 overflow-y-auto space-y-2 p-4">
            {filteredConversations.length === 0 ? (
              <p className="text-zinc-400 text-sm p-4 text-center">No conversations yet</p>
            ) : (
              filteredConversations.map((conv) => {
                const initials = conv.otherUserName
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <button
                    key={conv.otherUserId}
                    onClick={() => setSelectedUserId(conv.otherUserId)}
                    className={`w-full p-3 rounded-lg transition flex items-start gap-3 ${
                      selectedUserId === conv.otherUserId
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : 'hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {initials}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-white truncate">{conv.otherUserName}</p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(conv.lastMessageTime).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat View */}
        {selectedConversation ? (
          <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {selectedConversation.otherUserName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-white">{selectedConversation.otherUserName}</p>
                  <p className="text-xs text-zinc-400">Active conversation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition">
                  <Video size={18} />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-zinc-400">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderType === 'mentor';
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-zinc-800 text-zinc-100 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-zinc-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isSendingMessage}
                  className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && messageText.trim() && !isSendingMessage) {
                      sendMessage();
                    }
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isSendingMessage || !messageText.trim()}
                  className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-black border border-zinc-800 rounded-2xl flex items-center justify-center">
            <p className="text-zinc-400">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
