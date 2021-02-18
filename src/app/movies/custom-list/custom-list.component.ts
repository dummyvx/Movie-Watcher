import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Movie} from '../models/movie';
import {Observable} from 'rxjs';
import {Genre} from '../models/genre';
import {MovieService} from '../services/movie.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.component.html',
  styleUrls: ['../movie-browser/movie-list/movie-list.component.css', './custom-list.component.css']
})
export class CustomListComponent implements OnInit {

  @Input()
  movies: Movie[];
  genres$: Observable<Genre[]>;
  currentUrl: string;
  @Output()
  toBeDeletedMovie = new EventEmitter<Movie>();

  constructor(public movieService: MovieService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.genres$ = this.movieService.getGenres$();
    this.currentUrl = this.route.snapshot.routeConfig.path;
  }

  remove(toBeDeletedMovie: Movie): void {
    this.toBeDeletedMovie.emit(toBeDeletedMovie);
  }

  getPage(page: number): void {
    this.movieService.urlParams.pageNumber = page;
    if (this.movieService.searchMode.getValue()) {
      this.movieService.searchMovies(this.movieService.searchTerm.getValue());
    } else {
      this.movieService.getMovies();
    }
  }

  justify(): boolean {
    if (this.currentUrl === 'movies/:id') {
      return true;
    }
  }
}
