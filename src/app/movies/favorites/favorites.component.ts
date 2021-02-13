import {Component, OnDestroy, OnInit} from '@angular/core';
import {Movie} from '../models/movie';
import {AuthService} from '../../auth/services/auth.service';
import {User} from '../../auth/models/user';
import {Observable, Subscription} from 'rxjs';
import {MovieService} from '../services/movie.service';
import {catchError, mapTo, take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {

  favoriteMovies: Movie[];
  loggedUser: User;
  userSub: Subscription;

  constructor(private authService: AuthService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.loggedUser = user;
    });
    this.getFavoriteMovies();
  }

  getFavoriteMovies(): void {
    this.movieService.isLoading = true;
    this.movieService.getFavoriteMovies(this.loggedUser.id)
      .subscribe(data => {
        this.favoriteMovies = data;
        this.movieService.isLoading = false;
      }, error => {
        this.movieService.isLoading = false;
        console.log(error);
      });
  }

  remove(movieId: number): void {
    this.movieService.removeMovieFromFavorites(this.loggedUser.id, movieId)
      .subscribe(() =>
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId)
    );
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
