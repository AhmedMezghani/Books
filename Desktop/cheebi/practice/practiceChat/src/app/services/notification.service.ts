import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar
    ) {}
    showSnackbarCssStyles(content:string, action:string, duration:number,style:string) {
      let sb = this.snackBar.open(content, action, {
        duration: duration,
        verticalPosition:"top",
        horizontalPosition:"center",
        panelClass: [style]
      });
      sb.onAction().subscribe(() => {
        sb.dismiss();
      });
    }
    openSuccessSnackBar(content:string, action:string, duration:number) {
      this.showSnackbarCssStyles(content,action,duration,'success-snackbar');
    }
    openFailureSnackBar(content:string, action:string, duration:number) {
      this.showSnackbarCssStyles(content,action,duration,'failed-snackbar');
    }
}
