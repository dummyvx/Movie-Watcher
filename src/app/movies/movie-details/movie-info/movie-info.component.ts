import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieDetails} from '../../models/movie-details';
import {MovieCredits} from '../../models/movie-credits';
import {environment} from '../../../../environments/environment';
import {Person} from '../../models/person';
import {AuthService} from '../../../auth/services/auth.service';
import {Observable, Subscription} from 'rxjs';
import {User} from '../../../auth/models/user';

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

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.loggedUser.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  findCrewMembers(crew: Person[], job: string): Person[] {
    return crew.filter(crewMember => crewMember.job.toLowerCase() === job);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
