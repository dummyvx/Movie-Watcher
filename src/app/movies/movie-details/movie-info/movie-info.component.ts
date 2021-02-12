import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieDetails} from '../../models/movie-details';
import {MovieCredits} from '../../models/movie-credits';
import {environment} from '../../../../environments/environment';
import {Person} from '../../models/person';
import {AuthService} from '../../../auth/services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../../auth/models/user';
import {MovieService} from '../../services/movie.service';

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
  userSub: Subscription;
  watchlistSelected: Observable<boolean>;
  favoritesSelected: Observable<boolean>;

  constructor(private authService: AuthService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
    console.log(this.authService.loggedUser);
    console.log(this.movieDetails);
  }

  findCrewMembers(crew: Person[], job: string): Person[] {
    return crew.filter(crewMember => crewMember.job.toLowerCase() === job);
  }

  getUserMovies() {

  }

  onWatchlistSelected(event): void {
    // this.watchlistSelected = !this.watchlistSelected;
    this.handleEvent(event);
  }

  onFavoritesSelected(event): void {
    // this.favoritesSelected = !this.favoritesSelected;
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
