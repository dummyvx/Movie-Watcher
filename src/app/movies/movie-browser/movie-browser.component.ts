import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';
import { Dates } from '../models/dates';
import { UrlParameters } from '../models/url-parameters';
import { FiltersService } from '../services/filters.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-movie-browser',
  templateUrl: './movie-browser.component.html',
  styleUrls: ['./movie-browser.component.css']
})
export class MovieBrowserComponent implements OnInit {

  selectedCategory: string = UrlParameters.POPULARITY_DESC;
  fromDate: string;
  toDate: string;
  voteCount: number;
  selectedButton: string;
  movies$: Observable<Movie[]>;
  nowPlayingDates: Dates;
  upcomingDates: Dates;
  releaseType: string;
  sortExpanded: boolean;
  filterExpanded: boolean;
  eCategory = Category;

  constructor(public movieService: MovieService, private filterService: FiltersService) {
    this.releaseType = this.movieService.urlParams.withReleaseType;
    this.fromDate = this.movieService.urlParams.releaseDateGte;
    this.toDate = this.movieService.urlParams.releaseDateLte;
    this.voteCount = this.movieService.urlParams.voteCountGte;
    this.selectedCategory = this.movieService.urlParams.sortCategory;
    // this.sortExpanded = this.filterService.sortingActivatedEmitter(next);
    // this.filterExpanded = this.filterService.filteringActivatedEmitter ? this.filterService.filteringActivatedEmitter : false;
    // this.selectedButton = this.filterService.categoryEmitter ? this.filterService.categoryEmitter : Category.Popular;
  }

  ngOnInit(): void {
    this.movies$ = this.movieService.getMovies$();
    this.filterService.sortingActivatedEmitter.subscribe(activated => this.sortExpanded = activated);
    this.filterService.filteringActivatedEmitter.subscribe(activated => this.filterExpanded = activated);
    this.filterService.categoryEmitter.subscribe(category => this.selectedButton = category);
    this.movieService.getNowPlayingDates$().subscribe(data => this.nowPlayingDates = data);
    this.movieService.getUpcomingDates$().subscribe(data => this.upcomingDates = data);
    this.movieService.movies$.next([]);
    this.movieService.getMovies();
  }

  onButtonClicked(category: string): void {
    if (this.selectedButton !== category) {
      this.movieService.resetUrlParams();
    }
    if (category === this.eCategory.Popular && this.selectedButton !== category) {
      this.movieService.getPopularMovies();
    } else if (category === this.eCategory.TopRated && this.selectedButton !== category) {
      this.movieService.getTopRatedMovies();
    } else if (category === this.eCategory.NowPlaying && this.selectedButton !== category) {
      this.movieService.getNowPlayingMovies(this.nowPlayingDates.minimum, this.nowPlayingDates.maximum);
    } else if (category === this.eCategory.Upcoming && this.selectedButton !== category) {
      this.movieService.getUpcomingMovies(this.upcomingDates.minimum, this.upcomingDates.maximum);
    }
    this.selectedButton = category;
    this.filterService.categoryEmitter.next(category);
    this.selectedCategory = this.movieService.urlParams.sortCategory;
    this.fromDate = this.movieService.urlParams.releaseDateGte;
    this.toDate = this.movieService.urlParams.releaseDateLte;
    this.voteCount = this.movieService.urlParams.voteCountGte;
  }
}
