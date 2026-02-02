import { useState, useEffect, useCallback } from "react";

type NotificationPermission = "default" | "granted" | "denied";

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        });

        // Auto-close after 5 seconds
        setTimeout(() => notification.close(), 5000);

        return notification;
      } catch (error) {
        console.error("Error sending notification:", error);
        return null;
      }
    },
    [isSupported, permission]
  );

  const notifyAnalysisComplete = useCallback(
    (status: "safe" | "warning" | "danger", fileName?: string) => {
      const statusMessages = {
        safe: "✅ Authentic - No manipulation detected",
        warning: "⚠️ Suspicious - Potential manipulation found",
        danger: "🚨 Likely Fake - AI manipulation detected",
      };

      const body = fileName
        ? `${fileName}: ${statusMessages[status]}`
        : statusMessages[status];

      return sendNotification("Guardaio Analysis Complete", {
        body,
        tag: "analysis-complete",
        requireInteraction: false,
      });
    },
    [sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    notifyAnalysisComplete,
  };
};
