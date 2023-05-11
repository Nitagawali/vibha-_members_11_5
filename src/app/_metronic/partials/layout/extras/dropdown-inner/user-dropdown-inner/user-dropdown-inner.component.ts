import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, LayoutService } from '../../../../../core';
import { UserModel } from '../../../../../../modules/auth/_models/user.model';
import { AuthService } from '../../../../../../modules/auth/_services/auth.service';
declare var $:any;
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<UserModel>;

  userData

  constructor(private layout: LayoutService, private auth: AuthService, 
    private apiService: ApiService, private cd:ChangeDetectorRef) {
    let mD = new FormData();
    mD.append('data_param', this.apiService.encryptdata({"memberId":localStorage.getItem('memId')}));

    // this.apiService.fetchMemberData(mD).subscribe(
    //   data => {
    //     if(data.response == "200") {
    //       console.table(this.userName);
    //       this.userName = {fullname :this.apiService.decryptdata(data.data).full_name};
    //       this.cd.detectChanges();
    //       //console.table(this.userName);
    //     } else {
    //       $('.agriModalCorOTPErr').modal('show');
    //       setTimeout(()=>{
    //         $('.agriModalCorOTPErr').modal('hide');
    //       },2000);
    //     }  
    //   },
    //   err => {
    //     console.error(err);
    //     $('.agriModalCorOTPErr').modal('show');
    //     setTimeout(()=>{
    //       $('.agriModalCorOTPErr').modal('hide');
    //     },2000);
    //   });

      

  }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.auth.currentUserSubject.asObservable();

    this.apiService.dataChanged$.subscribe(obs=>{
      if(obs)
      {
        this.userData = this.apiService.userData
        console.log(this.userData)

        this.cd.detectChanges()
      }
    })
  }

  /* logout() {
    this.auth.logout();
    document.location.reload();
  } */

  logout() {
    console.log(localStorage.getItem('tokenString'));
    console.log(localStorage.getItem('memId'));

    localStorage.clear()

    //window.location.replace(window.location.href.split('vibha')[0] + '/vibha');
    window.open('/vibha/#/login','_self')
  }
}
