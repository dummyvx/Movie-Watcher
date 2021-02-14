import { NgModule } from '@angular/core';
import {MovieBrowserComponent} from './movie-browser/movie-browser.component';
import {FilterPanelComponent} from './movie-browser/filter-panel/filter-panel.component';
import {MovieListComponent} from './movie-browser/movie-list/movie-list.component';
import {MovieCardComponent} from './movie-browser/movie-list/movie-card/movie-card.component';
import {MovieDetailsComponent} from './movie-details/movie-details.component';
import {MovieSearchComponent} from './movie-browser/movie-search/movie-search.component';
import {MovieInfoComponent} from './movie-details/movie-info/movie-info.component';
import {MovieCastComponent} from './movie-details/movie-cast/movie-cast.component';
import {MovieRatingComponent} from './movie-browser/movie-list/movie-card/movie-rating/movie-rating.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {MoviesRoutingModule} from './movies-routing.module';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import { WatchlistComponent } from './watchlist/watchlist.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FavoritesComponent } from './favorites/favorites.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SearchPageComponent } from './movie-browser/search-page/search-page.component';

@NgModule({
  declarations: [
    MovieBrowserComponent,
    FilterPanelComponent,
    MovieListComponent,
    MovieCardComponent,
    MovieDetailsComponent,
    MovieSearchComponent,
    MovieInfoComponent,
    MovieCastComponent,
    MovieRatingComponent,
    WatchlistComponent,
    FavoritesComponent,
    SearchPageComponent
  ],
  exports: [
    MovieSearchComponent,
    MovieListComponent
  ],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MoviesRoutingModule,
    SharedModule,
    RouterModule,
    MatSlideToggleModule,
    MatTooltipModule
  ]
})
export class MoviesModule { }
