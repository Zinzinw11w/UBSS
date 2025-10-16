import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Auto-reply messages configuration
const AUTO_REPLY_MESSAGES = [
  "Thank you for your message! We'll get back to you shortly.",
  "Hello! Thanks for reaching out. Our support team will respond soon.",
  "Hi there! We've received your message and will reply as soon as possible.",
  "Thank you for contacting us! We're here to help and will respond shortly.",
  "Hello! We appreciate your message. Our team will get back to you soon."
];

// Auto-reply function
export const sendAutoReply = async (userId) => {
  try {
    // Get a random auto-reply message
    const randomMessage = AUTO_REPLY_MESSAGES[Math.floor(Math.random() * AUTO_REPLY_MESSAGES.length)];
    
    // Send the auto-reply as an admin message
    const autoReplyData = {
      userId, // This should be the Firestore user document ID
      message: randomMessage,
      isAdmin: true,
      adminId: 'auto-reply-system',
      createdAt: serverTimestamp(),
      read: false,
      conversationId: userId,
      isAutoReply: true // Mark as auto-reply for identification
    };

    const docRef = await addDoc(collection(db, 'chatMessages'), autoReplyData);
    return { id: docRef.id, ...autoReplyData };
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    throw error;
  }
};

// Chat Management
export const sendMessage = async (userId, message, isAdmin = false, adminId = null) => {
  try {
    const messageData = {
      userId, // This should be the Firestore user document ID
      message,
      isAdmin,
      adminId: adminId || null,
      createdAt: serverTimestamp(),
      read: false,
      conversationId: userId // Use userId as conversation identifier
    };

    const docRef = await addDoc(collection(db, 'chatMessages'), messageData);
    const newMessage = { id: docRef.id, ...messageData };
    
    // If this is a user message (not admin), send auto-reply
    if (!isAdmin) {
      try {
        // Add a small delay to make it feel more natural
        setTimeout(async () => {
          await sendAutoReply(userId);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
      } catch (autoReplyError) {
        console.error('Error sending auto-reply:', autoReplyError);
        // Don't throw error here, as the main message was sent successfully
      }
    }
    
    return newMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Send message as admin to specific user
export const sendAdminMessage = async (userId, message, adminId = 'admin') => {
  try {
    const messageData = {
      userId, // This should be the Firestore user document ID
      message,
      isAdmin: true,
      adminId,
      createdAt: serverTimestamp(),
      read: false,
      conversationId: userId
    };

    const docRef = await addDoc(collection(db, 'chatMessages'), messageData);
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error('Error sending admin message:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const messageRef = doc(db, 'chatMessages', messageId);
    await updateDoc(messageRef, {
      read: true,
      readAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const getChatHistory = async (userId) => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort messages by createdAt in ascending order (oldest first) for proper chat flow
    return messages.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return timeA - timeB; // Ascending order (oldest first)
    });
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

export const getAllChatMessages = async () => {
  try {
    const q = query(collection(db, 'chatMessages'));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort messages by createdAt on the client side
    return messages.sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return timeB - timeA; // Descending order
    });
  } catch (error) {
    console.error('Error getting all chat messages:', error);
    throw error;
  }
};

export const subscribeToChatMessages = (userId, callback) => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId)
    );
    
    return onSnapshot(q, callback, (error) => {
      console.error('Error in subscribeToChatMessages:', error);
    });
  } catch (error) {
    console.error('Error setting up subscribeToChatMessages:', error);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

export const subscribeToAllChatMessages = (callback) => {
  try {
    const q = query(collection(db, 'chatMessages'));
    return onSnapshot(q, callback, (error) => {
      console.error('Error in subscribeToAllChatMessages:', error);
    });
  } catch (error) {
    console.error('Error setting up subscribeToAllChatMessages:', error);
    return () => {};
  }
};

// Get all unique conversations (users who have chatted)
export const getConversations = async () => {
  try {
    const q = query(collection(db, 'chatMessages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    // Group messages by userId to get unique conversations
    const conversations = {};
    querySnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (!data.userId) return; // Skip if no userId
      
      if (!conversations[data.userId]) {
        conversations[data.userId] = {
          userId: data.userId,
          lastMessage: data.message || '',
          lastMessageTime: data.createdAt || null,
          isAdmin: data.isAdmin || false,
          unreadCount: 0
        };
      }
      
      // Count unread messages from users (not admin)
      if (!data.isAdmin && !data.read) {
        conversations[data.userId].unreadCount++;
      }
    });
    
    return Object.values(conversations).sort((a, b) => {
      const timeA = a.lastMessageTime?.toDate ? a.lastMessageTime.toDate() : new Date(a.lastMessageTime || 0);
      const timeB = b.lastMessageTime?.toDate ? b.lastMessageTime.toDate() : new Date(b.lastMessageTime || 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

// Subscribe to conversations for admin panel
export const subscribeToConversations = (callback) => {
  try {
    const q = query(collection(db, 'chatMessages'));
    
    return onSnapshot(q, (snapshot) => {
      const conversations = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (!data.userId) return; // Skip if no userId
        
        const userId = data.userId;
        if (!conversations[userId]) {
          conversations[userId] = {
            userId: userId,
            lastMessage: '',
            lastMessageTime: null,
            unreadCount: 0,
            isAdmin: false
          };
        }
        
        // Update with latest message info
        if (!data.isAdmin) {
          conversations[userId].lastMessage = data.message;
          conversations[userId].lastMessageTime = data.createdAt;
          conversations[userId].isAdmin = false;
        } else {
          conversations[userId].isAdmin = true;
        }
        
        // Count unread messages (non-admin messages that are unread)
        if (!data.isAdmin && !data.read) {
          conversations[userId].unreadCount++;
        }
      });
      
      // Convert to array and sort by last message time
      const conversationList = Object.values(conversations).filter(conv => conv.lastMessage);
      conversationList.sort((a, b) => {
        const timeA = a.lastMessageTime?.toDate ? a.lastMessageTime.toDate() : new Date(a.lastMessageTime || 0);
        const timeB = b.lastMessageTime?.toDate ? b.lastMessageTime.toDate() : new Date(b.lastMessageTime || 0);
        return timeB - timeA;
      });
      
      callback(conversationList);
    }, (error) => {
      console.error('Error in subscribeToConversations:', error);
    });
  } catch (error) {
    console.error('Error setting up subscribeToConversations:', error);
    return () => {};
  }
};

// Get user information by ID for display purposes
export const getUserInfo = async (userId) => {
  try {
    const userQuery = query(
      collection(db, 'users'),
      where('__name__', '==', userId)
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Mark all messages in a conversation as read
export const markConversationAsRead = async (userId) => {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { 
        read: true, 
        readAt: serverTimestamp() 
      })
    );
    
    await Promise.all(updatePromises);
    return true;
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    throw error;
  }
};
