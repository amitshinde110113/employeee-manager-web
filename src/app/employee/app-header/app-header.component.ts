import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  currentUser: any;

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currenUser'));

  }

}
