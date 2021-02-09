import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MovieBrowserComponent} from './movie-browser/movie-browser.component';
import {MovieDetailsComponent} from './movie-details/movie-details.component';
import {WatchlistComponent} from './watchlist/watchlist.component';

const routes: Routes = [
  {
    path: 'movies',
    component: MovieBrowserComponent
  },
  {
    path: 'movies/:id',
    component: MovieDetailsComponent
  },
  {
    path: 'watchlist',
    component: WatchlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoviesRoutingModule {

}
