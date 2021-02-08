import {LoadingSpinnerComponent} from './spinner/loading-spinner/loading-spinner.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RoundPipe} from './round.pipe';

@NgModule({
  declarations: [LoadingSpinnerComponent, RoundPipe],
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
