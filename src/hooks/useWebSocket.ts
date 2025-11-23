import { useEffect, useRef, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

type MessageHandler = (data: any) => void;

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const messageHandlers = useRef<Map<string, MessageHandler[]>>(new Map());
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<number | null>(null);
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        // Resubscribe to all previous topics
        messageHandlers.current.forEach((_, topic) => {
          ws.current?.send(JSON.stringify({ type: 'subscribe', topic }));
        });
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const handlers = messageHandlers.current.get(message.topic) || [];
          handlers.forEach(handler => handler(message.data));
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        if (!isMounted.current) return;
        
        // Exponential backoff for reconnection
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        
        reconnectTimeout.current = window.setTimeout(() => {
          if (isMounted.current) {
            console.log(`Attempting to reconnect... (attempt ${reconnectAttempts.current})`);
            connect();
          }
        }, delay);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error. Attempting to reconnect...');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  }, []);

  const subscribe = useCallback((topic: string, handler: MessageHandler) => {
    if (!messageHandlers.current.has(topic)) {
      messageHandlers.current.set(topic, []);
    }
    const handlers = messageHandlers.current.get(topic) || [];
    handlers.push(handler);
    messageHandlers.current.set(topic, handlers);

    // If connected, send subscribe message
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'subscribe', topic }));
    }

    // Return unsubscribe function
    return () => {
      const handlers = messageHandlers.current.get(topic) || [];
      const newHandlers = handlers.filter(h => h !== handler);
      if (newHandlers.length > 0) {
        messageHandlers.current.set(topic, newHandlers);
      } else {
        messageHandlers.current.delete(topic);
        // If connected, send unsubscribe message
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ type: 'unsubscribe', topic }));
        }
      }
    };
  }, []);

  const send = useCallback((topic: string, data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ topic, data }));
      return true;
    }
    console.warn('WebSocket not connected');
    return false;
  }, []);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      disconnect();
    };
  }, [connect, disconnect]);

  return useMemo(() => ({
    isConnected: () => ws.current?.readyState === WebSocket.OPEN,
    subscribe,
    send,
    disconnect,
    reconnect: connect,
  }), [subscribe, send, disconnect, connect]);
};
