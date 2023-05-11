import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_metronic/core';
import * as _ from 'lodash';
import { routes } from 'src/app/app-routing.module';
import { Router } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
})
export class Dashboard2Component implements OnInit,OnDestroy {

  player: YT.Player;
  ytEvent;

  userData: any;
  certData: any;

  isCert = false;

  videoItem = {
    video_desc: '',
    video_id: '',
    video_title: '',
    video_url: '',
    link: '',
    thumb: ''
  };

  sliderArray1 = [];

  sliderArray2 = [
    {
      image: 'assets/media/stock-600x600/img-16.jpg'
    },
    {
      image: 'assets/media/stock-600x600/img-9.jpg'
    },
    {
      image: 'assets/media/stock-600x600/img-8.jpg'
    },
    {
      image: 'assets/media/stock-600x600/img-2.jpg'
    },
    {
      image: 'assets/media/stock-600x600/img-1.jpg'
    }
  ];

  sliderArray3 = [];

  carouselOptions1 = {
    loop:true,
    autoplay: true,
    margin:0,
    smartSpeed: 1500,
    nav:false,
    dots: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: false,
    items: 1,
    touchDrag  : false,
    mouseDrag  : false,
    navText : ["",""],
    responsive:{
      0:{
        items:1
      },
      600:{
        items:1
      },
      1000:{
        items:1
      }
    }
  }

  carouselOptions2 = {
    loop:true,
    autoplay: true,
    margin:0,
    nav:false,
    dots: true,
    smartSpeed: 1500,
    autoplayTimeout: 4000,
    autoplayHoverPause: false,
    items: 1,
    touchDrag  : false,
    mouseDrag  : false,
    navText : ["",""],
    responsive:{
      0:{
        items:1
      },
      600:{
        items:1
      },
      1000:{
        items:1
      }
    }
  }

  carouselOptions3 = {
    loop:true,
    autoplay: true,
    margin:0,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav:false,
    dots: false,
    smartSpeed: 1500,
    autoplayTimeout: 6000,
    autoplayHoverPause: true,
    touchDrag  : false,
    mouseDrag  : false,
    items: 1,
    navText : ["",""],
    responsive:{
      0:{
        items:1
      },
      600:{
        items:1
      },
      1000:{
        items:1
      }
    },
    onTranslate: function(event) {

      var currentSlide, player, command;
  
      currentSlide = $('.owl-item.active');
  
      player = currentSlide.find("iframe").get(0);
  
      command = {
        "event": "command",
        "func": "pauseVideo"
      };
  
      if (player != undefined) {
        player.contentWindow.postMessage(JSON.stringify(command), "*");
  
      }
    }
  }

  constructor(private cd: ChangeDetectorRef, private apiService: ApiService,private router:Router) { }

  ngOnInit() { 
    let mD = new FormData();
    mD.append('data_param', this.apiService.encryptdata({"memberId":localStorage.getItem('memId')}));
    
    this.apiService.fetchMemberData(mD).subscribe(
      data => {
        if(data.response == "200") {
          this.userData = this.apiService.decryptdata(data.data)
          this.certData = this.apiService.encryptdata({
            'name':this.userData.full_name,
            'state': this.userData.state_name,
            'prant':this.userData.prant_name,
            'gender': this.userData.gender,
            'designation': this.userData.designation
          });
          this.apiService.userData = this.userData
          this.apiService.dataChanged$.emit(true)
          this.isCert = true;
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

    this.apiService.fetchBanner().subscribe(
      data => {
        if(data.response == "200") {
          this.sliderArray1 = this.apiService.decryptdata(data.data);
          this.cd.detectChanges();
        } else {
          console.log('Invalid response');
        }
      },
      err => {
        console.error(err);
      }
    );

    this.apiService.fetchVideo().subscribe(
      data => {
        if(data.response == "200") {
          //console.log(this.apiService.decryptdata(data.data));
          let vArr = this.apiService.decryptdata(data.data);
          this.sliderArray3 = _.map(vArr, (v, k) => {
            return {
              video_desc: v.video_desc,
              video_id: v.video_id,
              video_title: v.video_title,
              video_url: v.video_url,
              link: 'https://www.youtube.com/embed/' + (v.video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/))[1] + '?enablejsapi=1',
              thumb: 'http://img.youtube.com/vi/' + (v.video_url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/))[1] + '/mqdefault.jpg'
            }
          });
          console.log(this.sliderArray3);
          this.cd.detectChanges();
        } else {
          console.log('Invalid response');
        }
      },
      err => {
        console.error(err);
      }
    );

    /* this.apiService.fetchAlbum().subscribe(
      data => {
        if(data.response == "200") {
          console.log(this.apiService.decryptdata(data.data))
          this.sliderArray2 = this.apiService.decryptdata(data.data);
          this.cd.detectChanges();
        } else {
          console.log('Invalid response');
        }
      },
      err => {
        console.error(err);
      }
    ); */
  }

  closeVideo(item) {
    $('#ontalkVid' + item.video_id).modal('hide');
    $('#ontalkVid' + item.video_id).on('hidden.bs.modal', function () {
      var video = $('#onytVid' + item.video_id).attr("src");
      $('#onytVid' + item.video_id).attr("src","");
      $('#onytVid' + item.video_id).attr("src",video);
    });
    
  }

  viewVideo(item) {
    this.videoItem = item;
    this.cd.detectChanges();
  }

  onStateChange(event) {
    this.ytEvent = event.data;
  }

  savePlayer(player, i) {
    for(let j=0; j<this.sliderArray3.length; j++) {
      if(i === this.sliderArray3[j].id){
        this.player = player;
      }
    }
  }
  
  playVideo() {
    this.player.playVideo();
  }
  
  pauseVideo() {
    this.player.pauseVideo();
  }

  getCertificate() {  
    
  }

  toevents()
  {
    this.router.navigate(['/programs'])
  }
  toprofile()
  {
    this.router.navigate(['/profile'])
  }
  topayment()
  {
    this.router.navigate(['/payment'])
  }
  tocontact()
  {
    this.router.navigate(['/contact'])
  }

  ngOnDestroy()
  {
    this.apiService.dataChanged$.complete()
  }
}
