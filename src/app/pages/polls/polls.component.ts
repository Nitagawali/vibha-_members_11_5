import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LayoutService } from '../../_metronic/core/';
import KTLayoutExamples from '../../../assets/js/layout/extended/examples';

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss'],
})
export class PollsComponent implements OnInit, AfterViewInit {
  model: any;
  constructor(private layout: LayoutService, private el: ElementRef) {}

  ngOnInit(): void {
    this.model = this.layout.getConfig();
  }


  ngAfterViewInit() {
    
  }
}
