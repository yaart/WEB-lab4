import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title = 'Лабораторная работа №4';
  @Input() showLogout = false;

  studentName = 'Ясаков Артем Андреевич';
  groupNumber = 'P3213';
  variant = '1747';

  currentUsername = '';

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUsername = user?.username || '';
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
