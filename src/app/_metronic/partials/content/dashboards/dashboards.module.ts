import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { Dashboard3Component } from './dashboard3/dashboard3.component';
import { DashboardWrapperComponent } from './dashboard-wrapper/dashboard-wrapper.component';
import { WidgetsModule } from '../widgets/widgets.module';
import { OwlModule } from 'ngx-owl-carousel';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { CoreModule } from 'src/app/_metronic/core';

@NgModule({
  declarations: [Dashboard1Component, Dashboard2Component, DashboardWrapperComponent, Dashboard3Component],
  imports: [CommonModule, WidgetsModule, 
    OwlModule,
    NgxYoutubePlayerModule.forRoot(),
    CoreModule],
  exports: [DashboardWrapperComponent],
})
export class DashboardsModule { }
