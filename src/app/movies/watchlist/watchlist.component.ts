import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../models/movie';
import {User} from '../../auth/models/user';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';
import {MovieService} from '../services/movie.service';
import {catchError, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private movieService: MovieService) {}

  watchlistMovies: Movie[];
  loggedUser: User;
  userSub: Subscription;

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    });
    this.getWatchlistMovies();
  }

  getWatchlistMovies(): void {
    this.movieService.isLoading = true;
    this.movieService.getWatchlistMovies(this.loggedUser.id)
      .subscribe(data => {
        this.watchlistMovies = data;
        this.movieService.isLoading = false;
      }, error => {
        this.movieService.isLoading = false;
        console.log(error.message);
      });
  }

  remove(movieId: number): void {
    this.movieService.removeMovieFromWatchlist(this.loggedUser.id, movieId)
      .subscribe(() =>
        this.watchlistMovies = this.watchlistMovies.filter(movie => movie.id !== movieId)
      );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
