import { Component, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import { MovieService } from '../../services/movie.service';
import {UrlParameters} from '../../models/url-parameters';
import {FiltersService} from '../../services/filters.service';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {

  private searchTerm = new Subject<string>();
  value = '';

  constructor(private movieService: MovieService, private filtersService: FiltersService) {}

  ngOnInit(): void {
    this.value = this.movieService.searchTerm.getValue();
    if (this.movieService.searchTerm.getValue()) {
      this.movieService.searchMovies(this.value);
    }

    this.searchTerm.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(async (searchTerm) => {
          this.movieService.movies$.next([]);
          this.movieService.searchMovies(searchTerm);
        }
      )
    ).subscribe();
  }

  search(term: string): void {
    if (term.length > 1) {
      this.filtersService.allFiltersHiddenEmitter.next(true);
      this.movieService.searchTerm.next(term);
      this.movieService.urlParams.pageNumber = UrlParameters.DEFAULT_PAGE_NUMBER;
      this.searchTerm.next(term);
    } else if (term.length === 0) {
      this.movieService.movies$.next([]);
      this.filtersService.allFiltersHiddenEmitter.next(false);
      setTimeout(() => this.movieService.getMovies(), 700);
    }
  }

}
