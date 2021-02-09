import {LoadingSpinnerComponent} from './spinner/loading-spinner/loading-spinner.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoundPipe} from './round.pipe';
import {AuthService} from '../auth/services/auth.service';

@NgModule({
  declarations: [LoadingSpinnerComponent, RoundPipe],
  providers: [],
  exports: [
    LoadingSpinnerComponent,
    CommonModule,
    RoundPipe
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
