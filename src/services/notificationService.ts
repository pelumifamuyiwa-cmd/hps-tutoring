import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  email?: string;
  phone?: string;
}

export const sendNotification = async (data: NotificationData) => {
  try {
    // 1. Save to Firestore for in-app notification
    await addDoc(collection(db, 'notifications'), {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type,
      link: data.link || '',
      read: false,
      createdAt: new Date().toISOString()
    });

    // 2. Trigger External Notification (Email/WhatsApp) via Backend
    // This calls our Express server endpoint
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        email: data.email,
        phone: data.phone
      })
    });

    console.log(`Notification sent to ${data.userId}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
