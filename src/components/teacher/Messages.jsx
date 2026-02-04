import React, { useEffect, useState, useRef } from 'react';
import { Search, Send, FileText, MoreVertical, Phone, Video, Info, UserCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../lib/authStore';

const TeacherMessages = () => {
    const { user } = useAuthStore();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    // 1. Fetch Contacts (Students in my classes)
    useEffect(() => {
        const fetchContacts = async () => {
            if (!user?.id) return;
            try {
                // Get classes taught by teacher
                const { data: classes } = await supabase
                    .from('classes')
                    .select('id')
                    .eq('teacher_id', user.id);

                if (classes?.length > 0) {
                    const classIds = classes.map(c => c.id);
                    // Get students in those classes
                    const { data: students } = await supabase
                        .from('users')
                        .select('id, full_name, email, role')
                        .in('class_id', classIds)
                        .eq('role', 'student')
                        .order('full_name');

                    // Remove duplicates
                    const uniqueStudents = Array.from(new Map(students.map(item => [item.id, item])).values());
                    setContacts(uniqueStudents || []);
                }
            } catch (error) {
                console.error("Error fetching contacts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [user?.id]);

    // 2. Fetch Messages for Selected Contact
    useEffect(() => {
        if (!selectedContact || !user?.id) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('direct_messages')
                .select('*')
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.id}),and(sender_id.eq.${selectedContact.id},receiver_id.eq.${user.id})`)
                .order('created_at', { ascending: true });

            setMessages(data || []);
            scrollToBottom();
        };

        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel('chat_room')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'direct_messages',
                filter: `receiver_id=eq.${user.id}`,
            }, (payload) => {
                if (payload.new.sender_id === selectedContact.id) {
                    setMessages(prev => [...prev, payload.new]);
                    scrollToBottom();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedContact, user?.id]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        const payload = {
            sender_id: user.id,
            receiver_id: selectedContact.id,
            content: newMessage,
            read: false
        };

        // Optimistic Update
        const optimisticMsg = { ...payload, id: 'temp-' + Date.now(), created_at: new Date().toISOString() };
        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        scrollToBottom();

        const { error } = await supabase.from('direct_messages').insert(payload);
        if (error) {
            console.error("Error sending message:", error);
            // Revert on error (simplified)
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search interactions..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : contacts.map(contact => (
                        <button
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedContact?.id === contact.id
                                    ? 'bg-white shadow-md shadow-indigo-500/10 border border-indigo-100'
                                    : 'hover:bg-slate-100 hover:scale-[1.02]'
                                }`}
                        >
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                                {contact.full_name.charAt(0)}
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-slate-800 text-sm">{contact.full_name}</p>
                                <p className="text-xs text-slate-500 truncate">Click to chat</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                                    {selectedContact.full_name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{selectedContact.full_name}</h3>
                                    <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                                <Phone size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                                <Video size={20} className="hover:text-indigo-600 cursor-pointer transition-colors" />
                                <div className="w-px h-6 bg-slate-200"></div>
                                <MoreVertical size={20} className="hover:text-slate-600 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            <div className="flex justify-center">
                                <div className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full font-medium">
                                    Start of conversation with {selectedContact.full_name}
                                </div>
                            </div>

                            {messages.map(msg => {
                                const isMe = msg.sender_id === user.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] ${isMe
                                                ? 'bg-indigo-600 text-white rounded-[20px] rounded-br-[4px]'
                                                : 'bg-white text-slate-700 border border-slate-100 shadow-sm rounded-[20px] rounded-bl-[4px]'
                                            } px-5 py-3`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <p className={`text-[10px] mt-1 font-bold ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={scrollRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100">
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all">
                                <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                    <FileText size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 font-medium placeholder:text-slate-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className={`p-2 rounded-xl transition-all ${newMessage.trim()
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-100'
                                            : 'bg-slate-200 text-slate-400 scale-95'
                                        }`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <UserCircle size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Select a Contact</h3>
                        <p className="font-medium max-w-md">Choose a student from the sidebar to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherMessages;
