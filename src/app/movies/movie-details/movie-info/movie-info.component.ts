import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieDetails} from '../../models/movie-details';
import {MovieCredits} from '../../models/movie-credits';
import {environment} from '../../../../environments/environment';
import {Person} from '../../models/person';
import {AuthService} from '../../../auth/services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../../auth/models/user';
import {MovieService} from '../../services/movie.service';
import {UserService} from '../../services/user-service';
import {UserData} from '../../models/user-data';
import {Movie} from '../../models/movie';

@Component({
  selector: 'app-movie-info',
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit, OnDestroy {

  @Input()
  movieDetails: MovieDetails;
  env: string = environment.tmdb_imagesUrl_w500;
  isAuthenticated: boolean;
  loggedUser: User;
  userSub: Subscription;
  watchlistSelected: boolean;
  favoritesSelected: boolean;
  userData: UserData;
  error = null;

  constructor(private authService: AuthService,
              private movieService: MovieService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.loggedUser = user;
    });
    this.getUserData();
  }

  findCrewMembers(crew: Person[], job: string): Person[] {
    return crew.filter(crewMember => crewMember.job.toLowerCase() === job);
  }

  getUserData(): void {
    if (this.loggedUser) {
      this.userService.getUserData(this.loggedUser.id)
        .subscribe(data => {
          this.userData = data;
          this.checkUserCollections(this.userData);
        });
    }
  }

  checkUserCollections(userData: UserData): void {
    this.watchlistSelected = userData.watchlist.map(movie => movie.id).includes(this.movieDetails.id);
    this.favoritesSelected = userData.favorites.map(movie => movie.id).includes(this.movieDetails.id);
  }

  onWatchlistSelected(event): void {
    if (this.watchlistSelected) {
      this.removeMovieFromWatchlist(event);
    } else {
      this.addMovieToWatchlist(event);
    }
  }

  onFavoritesSelected(event): void {
    if (this.favoritesSelected) {
      this.removeMovieFromFavorites(event);
    } else {
      this.addMovieToFavorites(event);
    }
  }

  handleEvent(event): void {
    if (event.target.classList.contains('selected')) {
      event.target.classList.add('no-hover');
    } else {
      event.target.classList.remove('no-hover');
    }
  }

  removeMovieFromWatchlist(event): void {
    this.error = null;
    this.movieService.removeMovieFromWatchlist(this.loggedUser.id, this.movieDetails.id)
      .subscribe(() => {
        console.log(`${this.movieDetails.title} removed from watchlist`);
        this.watchlistSelected = !this.watchlistSelected;
        this.handleEvent(event);
      }, error => {
        this.error = error;
        console.log('something went wrong', error);
      });
  }

  addMovieToWatchlist(event): void {
    this.error = null;
    const movie = this.createMovie();
    this.movieService.addMovieToWatchlist(this.loggedUser.id, movie)
      .subscribe(() => {
        this.watchlistSelected = !this.watchlistSelected;
        this.handleEvent(event);
        console.log(`${this.movieDetails.title} added to watchlist`);
      }, error => {
        this.error = error;
        console.log('something went wrong', error);
      });
  }

  removeMovieFromFavorites(event): void {
    this.error = null;
    this.movieService.removeMovieFromFavorites(this.loggedUser.id, this.movieDetails.id)
      .subscribe(() => {
        this.favoritesSelected = !this.favoritesSelected;
        this.handleEvent(event);
        console.log(`${this.movieDetails.title} removed from favorites`);
      }, error => {
        this.error = error;
        console.log('something went wrong', error);
      });
  }

  addMovieToFavorites(event: any): void {
    this.error = null;
    const movie = this.createMovie();
    this.movieService.addMovieToFavorites(this.loggedUser.id, movie)
      .subscribe(() => {
        this.favoritesSelected = !this.favoritesSelected;
        this.handleEvent(event);
        console.log(`${this.movieDetails.title} added to favorites`);
      }, error => {
        this.error = error;
        console.log('something went wrong', error);
      });
  }

  createMovie(): Movie {
    return {
      id: this.movieDetails.id,
      title: this.movieDetails.title,
      poster_path: this.movieDetails.poster_path,
      release_date: this.movieDetails.release_date,
      vote_average: this.movieDetails.vote_average
    };
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
