import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
const cryptLib = require('@skavinvarnan/cryptlib');

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 
    baseUrl = 'https://vibhaindia.org/vibhaApiTest/index.php/';

    decKey = 'vibhaindia2021';

    userData
    dataChanged$:EventEmitter<boolean>
  
    constructor(private httpclient:HttpClient) {
      this.dataChanged$ = new EventEmitter()
      
     }

    fetchprogramschedule()
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.post<{response:any,data:any}>(this.baseUrl+'/fetch_programs_schedule','',{headers: header})
    }
    fetchprograms()
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      var frm = new FormData()
      frm.append('data_param',this.encryptdata({'count':'0'}))

      return this.httpclient.post<{response:any,data:any}>(this.baseUrl+'/fetch_programs',frm,{headers: header})
    }

    fetchcountry()
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.get<{response:string,data:any}>(this.baseUrl+'/fetchCountry',{headers: header})
    }
    fetchstate(c_code)
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );        
      var frm = new FormData()
        frm.append('data_param',this.encryptdata({'country':c_code}))

        return this.httpclient.post<{response:string,data:any}>(this.baseUrl+'/fetchState',frm,{headers: header})

    }
    fetchdistrict(d_id)
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );        
      var frm = new FormData()
        frm.append('data_param',this.encryptdata({'stateId':d_id}))

        return this.httpclient.post<{response:string,data:any}>(this.baseUrl+'/fetchDistrict',frm,{headers: header})

    }
    fetchprant(d_id)
    {
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );        
      var frm = new FormData()
        frm.append('data_param',this.encryptdata({'distId':d_id}))
        console.log(this.encryptdata({'distId':d_id}))

        return this.httpclient.post<{response:string,data:any}>(this.baseUrl+'/fetchPrant',frm,{headers: header})

    }

    fetchBanner(){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.get<{response:any,data:any}>(this.baseUrl+"fetchBanner",{headers: header});
    }

    fetchAlbum(){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.get<{response:any,data:any}>(this.baseUrl+"fetchAlbum",{headers: header});
    }

    fetchVideo(){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.get<{response:any,data:any}>(this.baseUrl+"fetchVideo",{headers: header});
    }

    fetchMemberData(userD){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.post<{response:String,data:any}>(this.baseUrl+"fetchMemberData",userD,{headers: header});
    }

    showCertificate(userD){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.post<{response:String,data:any}>(this.baseUrl+"showCertificate",userD,{headers: header});
    }

    fetchPaymentDetails(userD){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      return this.httpclient.post<{response:String,data:any}>(this.baseUrl+"fetchPaymentDetails",userD,{headers: header});
    }

    editMemberData(userD){
      let header = new HttpHeaders().set(
        "Token", localStorage.getItem('tokenString')
      );
      var frm = new FormData()
      frm.append('data_param',this.encryptdata(userD))
      console.log(this.encryptdata(userD))

      return this.httpclient.post<{response:String,data:any}>(this.baseUrl+"editMemberData",frm,{headers: header});
    }

    timeformatter(time) {
      var tm = time.getFullYear()+"-"+(time.getMonth() + 1)+"-"+time.getDate()
      return tm
    }

    decryptdata(d) {
      const decryptedString = cryptLib.decryptCipherTextWithRandomIV(d, this.decKey);
      return JSON.parse(decryptedString);
    }

    encryptdata(d) {
      let cipherText = cryptLib.encryptPlainTextWithRandomIV(JSON.stringify(d), this.decKey);
      return cipherText.replace(/(\r\n|\n|\r)/gm, "");
    }

}
