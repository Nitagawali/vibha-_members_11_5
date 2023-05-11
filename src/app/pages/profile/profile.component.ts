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
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

declare var $:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  model: any;
  userData: any;
  userPData: any;

  memberid
  memberdata
  area_of_interest = ''

  salutationArr = ['Mr ','Mrs ','Miss ','Dr ','Shri ','Prof ']
  genderArr = ['Male','Female','Other']
  interestList = [
    'Traditional Knowledge and Applications',
    'Environment',
    'Energy',
    'Health Sciences',
    'Engineering Sciences',
    'Literature',
    'Infrastructure, Technology and Communications',
    'Waste Management',
    'Woman Empowerment',
    'School Student Activities',
    'Agriculture and Veterinary Science',
    'Indic Science',
    'Others'
  ]

  countryArr = []
  stateArr = []
  districtArr = []
  prantArr = []

  todayDate:Date = new Date();
  userForm: FormGroup;
  hasFormErrors = false;
  disableform = true

  isloadedData = false


  constructor(private layout: LayoutService, 
    private el: ElementRef, private cd: ChangeDetectorRef,
    private apiService:ApiService) {
      this.userForm = new FormGroup({
        fullname: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        mobile: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required,Validators.pattern("[0-9 ]{10}")],
        }),
        postaladdress: new FormControl(null, {
          updateOn: 'blur',
        }),
        userBday: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        institute: new FormControl(null, {
          updateOn: 'blur',
        }),
        designation: new FormControl(null, {
          updateOn: 'blur',
        }),
        whatsappnumber: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.pattern("[0-9 ]{10}")],
        }),
        pincode: new FormControl(null, {
          updateOn: 'blur',
        }),
      })
    }

  ngOnInit(): void {
    this.model = this.layout.getConfig();

    let mD = new FormData();
    mD.append('data_param', this.apiService.encryptdata({"memberId":localStorage.getItem('memId')}));

    this.apiService.fetchMemberData(mD).subscribe(
      data => {
        if(data.response == "200") {
          this.memberdata = this.apiService.decryptdata(data.data)
          console.table(this.memberdata);

          this.userForm.patchValue({email: this.memberdata.email})
          this.userForm.patchValue({fullname: this.memberdata.full_name})
          this.userForm.patchValue({mobile: this.memberdata.mobile})
          this.userForm.patchValue({postaladdress: this.memberdata.postal_address})
          var d = new Date(this.memberdata.dob)
          console.log(d)
          this.userForm.patchValue({userBday: d})
          if(this.memberdata.area_of_interest)
          {
            this.area_of_interest = JSON.parse(this.memberdata.area_of_interest)
          }else{
            this.area_of_interest = ''
          }
          this.userForm.patchValue({institute: this.memberdata.institute})
          this.userForm.patchValue({designation: this.memberdata.designation})
          this.userForm.patchValue({whatsappnumber: this.memberdata.whatsapp_mobile})
          this.userForm.patchValue({pincode: this.memberdata.pincode})

          this.apiService.fetchcountry().subscribe(res=>{
            this.countryArr = this.apiService.decryptdata(res.data) 
            console.log(this.countryArr)
      
            this.apiService.fetchstate(this.memberdata.country_code).subscribe(res2=>{
              this.stateArr = this.apiService.decryptdata(res2.data) 
              console.log(this.stateArr)
                this.apiService.fetchdistrict(this.memberdata.state_id).subscribe(res3=>{
                  this.districtArr = this.apiService.decryptdata(res3.data) 
                  console.log(this.districtArr)

                    if(this.memberdata.district)
                    {
                      this.apiService.fetchprant(this.memberdata.district).subscribe(res4=>{
                        console.log('district is',this.memberdata.district)
                        this.prantArr = this.apiService.decryptdata(res4.data)
                        console.log(this.prantArr)
  
                        this.isloadedData = true
                        this.cd.detectChanges()
                        
                        setTimeout(()=>{
                          console.log(this.userForm.value)
                        },10000)
                      })
                    }else{
                      this.prantArr.push({
                        prant_name : 'NA',
                        prant_unit_name : 'NA'
                      })
                      
                      this.isloadedData = true
                      this.cd.detectChanges()
                      
                    }
                })
            })
          })
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

    // this.apiService.fetchPaymentDetails(mD).subscribe(
    //   data => {
    //     if(data.response == "200") {
    //       //console.table(this.apiService.decryptdata(data.data));
    //       this.userPData = this.apiService.decryptdata(data.data);
    //       this.cd.detectChanges();
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
    //   }
    // );
  }

  onupdate()
  {
    var dataobj = {
      "memberId": this.memberdata.id,
      "nameSalut": this.memberdata.Salutation,
      "fullName": this.userForm.value.fullname,
      "gender": this.memberdata.gender,
      "dob": this.apiService.timeformatter(this.userForm.value.userBday),
      "areaOfInterest": JSON.stringify(this.area_of_interest),
      "affliatedInstitute": this.userForm.value.institute || 'NA',
      "designation": this.userForm.value.designation || 'NA',
      "emailId": this.memberdata.email,
      "primaryNumberCode": this.memberdata.primary_number_code,
      "primaryNumber": this.userForm.value.mobile,
      "whatsappNumberCode": this.memberdata.whatsapp_number_code,
      "whatsappNumber": this.userForm.value.whatsappnumber,
      "country": this.memberdata.country,
      "state": this.memberdata.state_id,
      "district": this.memberdata.district,
      "prant":this.memberdata.prant,
      "pincode": this.userForm.value.pincode.toString() || 'NA',
      "address": this.userForm.value.postaladdress || 'NA',
      "subscribeNewsletter":'1'
    }

    console.log(dataobj)
    if(this.userForm.value.whatsappnumber && this.memberdata.whatsapp_number_code==null)
    {
      $('.agriModalWhatsappCode').modal('show');
      setTimeout(()=>{
        $('.agriModalWhatsappCode').modal('hide');
      },2000);
      return
    }

    if(this.userForm.valid && dataobj.nameSalut!=null && dataobj.gender!=null && dataobj.primaryNumberCode!=null && dataobj.district!=null)
    {
      this.apiService.editMemberData(dataobj).subscribe(res=>{
        console.log(res)
        if(res.response == '202')
        {
          this.disableform = true
          $('.agriModalSuccess').modal('show');
          setTimeout(()=>{
            $('.agriModalSuccess').modal('hide');
          },2000);
          this.ngOnInit()
        }else{
          $('.agriModalErr').modal('show');
          setTimeout(()=>{
            $('.agriModalErr').modal('hide');
          },2000);
        }
      })

    }else{
      console.log(this.userForm)

      this.hasFormErrors = true

      $('.agriModalErr').modal('show');
      setTimeout(()=>{
        $('.agriModalErr').modal('hide');
      },2000);
    }

  }

  fetchdistrict()
  {
    this.apiService.fetchdistrict(this.memberdata.state_id).subscribe(res3=>{
      this.districtArr = this.apiService.decryptdata(res3.data)
      console.log(this.districtArr)

      this.cd.detectChanges()
    })
  }

  fetchprant()
  {
    this.apiService.fetchprant(this.memberdata.district).subscribe(res4=>{
      this.prantArr = this.apiService.decryptdata(res4.data)
      console.log(this.prantArr)

      this.memberdata.prant = this.prantArr[0].prant_id

      this.cd.detectChanges()
    })
  }

  selectedBday()
  {

    console.log(this.userForm.value);
    console.log(this.memberdata);
  }

  editcontrols()
  {
    if(this.disableform)
    {
      this.disableform = false
      this.cd.detectChanges()
    }else{
      this.ngOnInit()
      this.disableform = true
      this.cd.detectChanges()
    }
  }

  getJson(x){
		return JSON.parse(x);
	}

  validatephone(event: any) {
    console.log(event)
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
