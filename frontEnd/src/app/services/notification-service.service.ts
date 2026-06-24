import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  
  constructor(private socket: Socket) {
    this.connect();
    
  }

  initializeSocket(adminId: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        this.authenticate(adminId);
        resolve();
      } else {
        this.socket.on('connect', () => {
          this.authenticate(adminId);
          resolve();
        });
        
        // Reconnection manuelle si nécessaire
        this.socket.connect();
      }
    });
  }
  
  private authenticate(adminId: string) {
    console.log('Authentification socket avec ID:', adminId);
    this.socket.emit('admin-auth', adminId);
    
    // Vérification après 1s
    setTimeout(() => {
      this.socket.emit('check-admin-auth', adminId);
    }, 1000);
  }
  
  private connect() {
    this.socket.on('connect', () => {
      console.log('✅ Socket connecté au serveur');
    });
  
    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du serveur');
    });

  }

  getNewNotification(): Observable<any> {
    return this.socket.fromEvent('admin-notification');
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string) {
    this.socket.emit('mark-notification-read', notificationId);
  }
}