import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApiService, LayoutService } from '../../_metronic/core/';
declare var $:any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  model: any;
  userData: any;
  userPData: any;

  constructor(private layout: LayoutService, 
    private el: ElementRef, private cd: ChangeDetectorRef,
    private apiService:ApiService) { }

  ngOnInit(): void {
    this.model = this.layout.getConfig();

    let mD = new FormData();
    mD.append('data_param', this.apiService.encryptdata({"memberId":localStorage.getItem('memId')}));

    this.apiService.fetchPaymentDetails(mD).subscribe(
      data => {
        if(data.response == "200") {
          
          this.userPData = this.apiService.decryptdata(data.data);
          console.table(this.userPData);
          
          this.cd.detectChanges();
        } else {
          $('.agriModalCorOTPErr').modal('show');
          setTimeout(()=>{
            $('.agriModalCorOTPErr').modal('hide');
          },2000);
        }  
      },
      err => {
        console.error(err);
        $('.agriModalCorOTPErr').modal('show');
        setTimeout(()=>{
          $('.agriModalCorOTPErr').modal('hide');
        },2000);
      }
    );

  }

}
