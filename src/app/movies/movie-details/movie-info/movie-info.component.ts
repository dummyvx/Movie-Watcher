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

  constructor(private authService: AuthService,
              private movieService: MovieService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
      this.loggedUser = user;
    });
    this.getUserData();
    console.log('in ngOnInit:', this.userData);
  }

  findCrewMembers(crew: Person[], job: string): Person[] {
    return crew.filter(crewMember => crewMember.job.toLowerCase() === job);
  }

  getUserData(): void {
    this.userService.getUserData(this.loggedUser.id)
      .subscribe(data => {
        this.userData = data;
        this.checkUserCollections(this.userData);
      });
  }

  checkUserCollections(userData: UserData): void {
    this.watchlistSelected = userData.watchlist.map(movie => movie.id).includes(this.movieDetails.id);
    this.favoritesSelected = userData.favorites.map(movie => movie.id).includes(this.movieDetails.id);
  }

  onWatchlistSelected(event): void {
    this.watchlistSelected = !this.watchlistSelected;
    this.handleEvent(event);
  }

  onFavoritesSelected(event): void {
    this.favoritesSelected = !this.favoritesSelected;
    this.handleEvent(event);
  }

  handleEvent(event): void {
    if (event.target.classList.contains('selected')) {
      event.target.classList.add('no-hover');
    } else {
      event.target.classList.remove('no-hover');
    }
  }

  addMovieToFavorites() {

  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
