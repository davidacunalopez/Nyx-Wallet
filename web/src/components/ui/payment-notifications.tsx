"use client";

import { useState } from 'react';
import { Bell, X, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePaymentNotifications } from '@/hooks/use-payment-notifications';

export function PaymentNotifications() {
  const { notifications, clearNotifications, markAsRead, hasNewNotifications } = usePaymentNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return timestamp.toLocaleDateString();
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-gray-400 hover:text-white"
        >
          <Bell className="h-5 w-5" />
          {hasNewNotifications && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-[#12132A] border-[#1F2037] text-white"
      >
        <div className="flex items-center justify-between p-3 border-b border-[#1F2037]">
          <h3 className="font-semibold text-sm">Notificaciones de Pagos</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="h-6 px-2 text-xs text-gray-400 hover:text-white"
            >
              Limpiar
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay notificaciones de pagos</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="p-3 border-b border-[#1F2037] last:border-b-0 focus:bg-[#1F2037] cursor-pointer"
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3 w-full">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-green-400">
                        +{notification.amount} {notification.asset}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTime(notification.timestamp)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-300 mb-1">
                      De: {formatAddress(notification.from)}
                    </p>
                    
                    <p className="text-xs text-gray-400">
                      Hash: {formatAddress(notification.hash)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-[#1F2037]" />
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="w-full text-xs text-gray-400 hover:text-white"
              >
                Limpiar todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
