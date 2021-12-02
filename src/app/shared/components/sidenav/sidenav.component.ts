import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse } from '../../../auth/models/interfaces/login.interface';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  user: ILoginResponse;

  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(private router: Router, private authService: AuthService) { }

  async ngOnInit() {
    this.user = await this.authService.getUserSession();
  }

  navigate(url: string) {
    this.router.navigateByUrl(url);
  }

  public logout(): void {
    this.authService.logout();
  }

}
