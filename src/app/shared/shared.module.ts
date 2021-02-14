import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoundPipe} from './round.pipe';

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
