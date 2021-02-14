import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { Genre } from 'src/app/movies/models/genre';
import { Movie } from 'src/app/movies/models/movie';
import { MovieService } from 'src/app/movies/services/movie.service';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, OnChanges {

  @Input()
  movies: Movie[];
  genres$: Observable<Genre[]>;
  noMoreMovies: boolean;
  currentUrl: string;
  @Output()
  toBeDeletedMovieId = new EventEmitter<number>();
  justified: boolean;

  constructor(public movieService: MovieService, private route: ActivatedRoute) { }

  ngOnChanges(): void {
    this.noMoreMovies = this.movieService.pageNumber === this.movieService.totalPages;
    this.movieService.searchMode.subscribe(mode => this.justified = mode);
  }

  ngOnInit(): void {
    this.genres$ = this.movieService.getGenres$();
    this.currentUrl = this.route.snapshot.routeConfig.path;
  }

  loadMore(): void {
    this.movieService.urlParams.pageNumber++;
    if (this.movieService.searchMode) {
      this.movieService.searchMovies(this.movieService.searchTerm.getValue());
    } else {
      this.movieService.getMovies();
    }
    console.log(this.movieService.urlParams);
  }

  remove(movieId: number): void {
    this.toBeDeletedMovieId.emit(movieId);
  }

}
