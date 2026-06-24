import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { NotificationServiceService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{

  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;
  private notificationSub!: Subscription;

  constructor(
    private notificationService: NotificationServiceService,
    private authService: AuthServiceService,private socket:Socket
  ) {}

  ngOnInit() {
   /* const savedAdminId = localStorage.getItem('adminId');
  if (savedAdminId) {
    this.socket.emit('admin-auth', savedAdminId);
  }*/
    this.loadNotifications();
    
    this.notificationSub = this.notificationService.getNewNotification().subscribe({
      next: (notification) => {
        this.notifications.unshift(notification);
        this.unreadCount++;
        console.log('New notification received:', notification); // Debug
      },
      error: (err) => console.error('Notification error:', err)
    });
  }

  async loadNotifications() {
    try {
      const notifs = await this.authService.getNotifications().toPromise();
      this.notifications = notifs || [];
      this.unreadCount = this.notifications.filter(n => !n.read).length;
    } catch (err) {
      console.error('Error loading notifications', err);
    }
  }

  ngOnDestroy() {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.markAllAsRead();
    }
  }

  markAllAsRead() {
    const unreadIds = this.notifications
      .filter(n => !n.read)
      .map(n => n._id);
    
    if (unreadIds.length > 0) {
      this.authService.markNotificationsAsRead(unreadIds).subscribe({
        next: () => {
          this.notifications.forEach(n => n.read = true);
          this.unreadCount = 0;
        },
        error: (err) => console.error('Error marking as read', err)
      });
    }
  }


  clearAllNotifications() {
    // Vide le tableau local
    this.notifications = [];
    this.unreadCount = 0;
  
    // Appel à l’API pour supprimer côté backend (si nécessaire)
    this.authService.clearNotifications().subscribe({
      next: () => {
        console.log('Historique des notifications supprimé');
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l’historique', err);
      }
    });
  }

}
