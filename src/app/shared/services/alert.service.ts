import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private loadingController: LoadingController, private alertController: AlertController) { }

  public async showLoading(message: string): Promise<void> {
    const loading = await this.loadingController.create({
      message
    });
    await loading.present();
  }

  public async dismissLoading(): Promise<void> {
    const overlay = await this.loadingController.getTop();
    if (overlay) {
      await this.loadingController.dismiss();
    }
  }

  public async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  public async presentAlertConfirm(header: string, message: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Aceptar',
          role: 'accept'
        }
      ]
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role && role === 'accept';
  }
}
