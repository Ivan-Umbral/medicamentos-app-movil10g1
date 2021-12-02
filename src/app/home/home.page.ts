import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    /* this.authService.testOlv().subscribe(data => {
      console.log(data);
    });
    console.log('salv');
    const olv = await this.authService.getUserSession();
    console.log(olv.accesToken); */
  }

  /* async ionViewWillEnter() {
    this.authService.testOlv().subscribe(data => {
      console.log(data);
    });
    console.log('salv');
    const olv = await this.authService.getUserSession();
    console.log(olv.accesToken);
  } */

}
