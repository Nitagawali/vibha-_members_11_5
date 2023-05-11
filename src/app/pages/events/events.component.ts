import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApiService, LayoutService } from '../../_metronic/core/';
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, AfterViewInit {
  ongoingevts = [
    
  ]
  upcommingevts = [
    
  ]
  completedevts = [
    
  ]
  evts = [
    
  ];
  model: any;
  @ViewChild('form', { static: true }) form: NgForm;
  activeTabId = 1;
  constructor(private layout: LayoutService, private el: ElementRef,private apiService:ApiService,private changedetect:ChangeDetectorRef) {}

  ngOnInit(): void {
    this.model = this.layout.getConfig();

    this.apiService.fetchprograms().subscribe(res=>{
      this.evts = this.apiService.decryptdata(res.data)

      this.changedetect.detectChanges()
    })

    this.apiService.fetchprogramschedule().subscribe(res=>{
      if(res.response == '200')
      {
        var list = this.apiService.decryptdata(res.data)
        this.upcommingevts = list.upcoming_programs
        this.ongoingevts = list.ongoing_programs
        this.completedevts = list.completed_programs
  
        console.log(this.upcommingevts)
        this.changedetect.detectChanges()
      }
    })
  }

  setActiveTab(tabId: number) {
    this.activeTabId = tabId;
  }

  getActiveTabCSSClass(tabId: number) {
    if (tabId !== this.activeTabId) {
      return '';
    }

    return 'active';
  }

  resetPreview(): void {
    this.layout.refreshConfigToDefault();
  }

  submitPreview(): void {
    this.layout.setConfig(this.model);
    location.reload();
  }

  ngAfterViewInit() {
    // init code preview examples
    // see /src/assets/js/layout/extended/examples.js
    const elements = this.el.nativeElement.querySelectorAll('.example');
    KTLayoutExamples.init(elements);
  }

  towebsite(w)
  {
    window.open(w)
  }
}
