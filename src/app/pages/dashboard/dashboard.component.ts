import { Component, OnInit } from '@angular/core';
import { ApiService, LayoutService } from '../../_metronic/core/';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    

    if(localStorage.getItem('tokenString') && localStorage.getItem('memId'))
    {
      // console.log('token ',localStorage.getItem('tokenString'));
      // console.log('mem id ',localStorage.getItem('memId'));

      let mD = new FormData();
      mD.append('data_param', this.apiService.encryptdata({"memberId":localStorage.getItem('memId')}));
  
      this.apiService.fetchMemberData(mD).subscribe(
        data => {
          if(data.response == "200") {
            this.apiService.userData = this.apiService.decryptdata(data.data)
            this.apiService.dataChanged$.emit(true)
          }
        })
    }else{
      //window.location.replace('http://15.206.72.196/vibha/#/login')
      window.open('/vibha/#/login','_self')
    }
  }

}
