import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Hash, 
  Lock, 
  Plus, 
  Search, 
  MoreVertical,
  Smile,
  Paperclip,
  AtSign,
  Link as LinkIcon,
  Users,
  Bell,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
  taskLink?: { id: string; title: string };
  thread?: number;
}

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  unread: number;
  members: number;
}

const mockChannels: Channel[] = [
  { id: "1", name: "general", isPrivate: false, unread: 0, members: 12 },
  { id: "2", name: "development", isPrivate: false, unread: 3, members: 8 },
  { id: "3", name: "design", isPrivate: false, unread: 0, members: 5 },
  { id: "4", name: "security-team", isPrivate: true, unread: 1, members: 4 },
  { id: "5", name: "sprint-14", isPrivate: false, unread: 7, members: 6 },
];

const mockMessages: Message[] = [
  {
    id: "1",
    user: "Alice Chen",
    avatar: "AC",
    content: "Just pushed the new authentication module. Ready for code review! 🚀",
    timestamp: new Date(Date.now() - 3600000),
    reactions: [{ emoji: "👍", count: 3 }, { emoji: "🎉", count: 2 }],
    taskLink: { id: "TASK-142", title: "Implement OAuth 2.0" },
  },
  {
    id: "2",
    user: "Bob Martinez",
    avatar: "BM",
    content: "Looking at it now. The TDD approach looks solid. Nice work on the edge cases.",
    timestamp: new Date(Date.now() - 3000000),
    thread: 4,
  },
  {
    id: "3",
    user: "Carol Davis",
    avatar: "CD",
    content: "Reminder: Sprint retrospective at 3pm. Please add your notes to the board beforehand.",
    timestamp: new Date(Date.now() - 1800000),
    reactions: [{ emoji: "✅", count: 5 }],
  },
  {
    id: "4",
    user: "David Kim",
    avatar: "DK",
    content: "The energy consumption metrics from Scaphandre look great - we've reduced server load by 23% this sprint! 🌱",
    timestamp: new Date(Date.now() - 900000),
    reactions: [{ emoji: "🌱", count: 4 }, { emoji: "💚", count: 3 }],
  },
];

const TeamChat = () => {
  const [selectedChannel, setSelectedChannel] = useState(mockChannels[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      user: "You",
      avatar: "YO",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="grid lg:grid-cols-[280px_1fr_280px] gap-4 h-[600px]">
      {/* Channels Sidebar */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Channels</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[450px] px-2">
            {mockChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                  selectedChannel.id === channel.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/50"
                }`}
              >
                {channel.isPrivate ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Hash className="w-4 h-4 text-muted-foreground" />
                )}
                <span className="flex-1 text-left text-sm">{channel.name}</span>
                {channel.unread > 0 && (
                  <Badge variant="default" className="h-5 min-w-5 justify-center">
                    {channel.unread}
                  </Badge>
                )}
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="glass border-border/50 flex flex-col">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{selectedChannel.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedChannel.members} members
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 group"
                >
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {msg.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{msg.user}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(msg.timestamp)}
                      </span>
                      {msg.thread && (
                        <Badge variant="secondary" className="text-xs">
                          {msg.thread} replies
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground/90">{msg.content}</p>
                    
                    {msg.taskLink && (
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/50 border border-border/50">
                        <LinkIcon className="w-3 h-3 text-primary" />
                        <span className="text-xs font-mono text-primary">{msg.taskLink.id}</span>
                        <span className="text-xs text-muted-foreground">{msg.taskLink.title}</span>
                      </div>
                    )}
                    
                    {msg.reactions && (
                      <div className="flex gap-1 mt-2">
                        {msg.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 hover:bg-secondary text-xs transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-muted-foreground">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder={`Message #${selectedChannel.name}`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <AtSign className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button onClick={sendMessage} size="icon" className="h-9 w-9 shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Members Sidebar */}
      <Card className="glass border-border/50 hidden lg:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            Online Now
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px] px-4">
            <div className="space-y-3">
              {["Alice Chen", "Bob Martinez", "Carol Davis", "David Kim", "Eva Wilson"].map((name, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3">Offline — 7</p>
                {["Frank Moore", "Grace Lee", "Henry Brown"].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3 opacity-50 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary text-muted-foreground text-xs">
                        {name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm truncate">{name}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamChat;
