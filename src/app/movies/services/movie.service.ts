import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, pipe} from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Genre } from '../models/genre';
import { Movie } from '../models/movie';
import { MovieDetails } from '../models/movie-details';
import { Dates } from '../models/dates';
import { UrlParameters } from '../models/url-parameters';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  urlParamsNames: string[] = [
    'sort_by', 'page', 'primary_release_date.gte', 'primary_release_date.lte', 'with_release_type', 'vote_count.gte', 'with_genres'
  ];

  urlParams = {
    sortCategory: UrlParameters.POPULARITY_DESC,
    pageNumber: UrlParameters.DEFAULT_PAGE_NUMBER,
    releaseDateGte: '',
    releaseDateLte: '',
    withReleaseType: '',
    voteCountGte: UrlParameters.DEFAULT_VOTE_COUNT,
    withGenres: ''
  };

  movies$ = new BehaviorSubject<Movie[]>([]);
  genres$: Observable<Genre[]>;
  nowPlayingDates$: Observable<Dates>;
  upcomingDates$: Observable<Dates>;
  pageNumber: number;
  totalPages: number;
  genresUrl = `${environment.tmdb_base_url}/genre/movie/list?api_key=${environment.api_key}`;
  moviesDiscoverUrl = `${environment.tmdb_base_url}/discover/movie?`;
  moviesSearchUrl = `${environment.tmdb_base_url}/search/movie?api_key=${environment.api_key}`;
  nowPlayingMoviesUrl = `${environment.tmdb_base_url}/movie/now_playing?api_key=${environment.api_key}`;
  upcomingMoviesUrl = `${environment.tmdb_base_url}/movie/upcoming?api_key=${environment.api_key}`;
  movieDetailsUrl = `${environment.tmdb_base_url}/movie`;
  searchMode: boolean;
  isLoading = false;
  searchTerm: string;

  constructor(private http: HttpClient) { }

  getMovies(): void {
    this.searchMode = false;
    this.isLoading = true;
    this.http.get<any>(`${this.moviesDiscoverUrl}${this.buildUrlParams()}`)
      .pipe(
        tap(data => {
          this.handleData(data);
        })
      ).subscribe();
  }

  searchMovies(searchTerm: string): void {
    this.searchMode = true;
    this.isLoading = true;
    this.http.get<any>(`${this.moviesSearchUrl}&query=${searchTerm}&page=${this.urlParams.pageNumber}`)
      .pipe(
        tap(data => {
          this.handleData(data);
        })
      ).subscribe();
  }

  handleData(data: any): void {
    this.pageNumber = data.page;
    this.totalPages = data.total_pages;
    if (this.pageNumber === 1) {
      this.movies$.next(data.results);
    } else {
      this.movies$.next([...this.movies$.getValue(), ...data.results]);
    }
    this.isLoading = false;
  }

  getMovies$(): Observable<Movie[]> {
    return this.movies$.asObservable();
  }

  resetUrlParams(): void {
    this.urlParams.pageNumber = 1;
    this.urlParams.sortCategory = UrlParameters.POPULARITY_DESC;
    this.urlParams.releaseDateGte = '';
    this.urlParams.releaseDateLte = '';
    this.urlParams.withReleaseType = '';
    this.urlParams.voteCountGte = 0;
  }

  buildUrlParams(): string {
    let i = 0;
    let queryParams = '';

    for (const param of Object.keys(this.urlParams)) {
      if (this.urlParams[param] !== '') {
        queryParams += `${this.urlParamsNames[i]}=${this.urlParams[param]}&`;
      }
      i++;
    }
    return queryParams + `api_key=${environment.api_key}`;
  }

  getNowPlayingDates$(): Observable<Dates> {
    if (!this.nowPlayingDates$) {
      this.nowPlayingDates$ = this.http.get<any>(this.nowPlayingMoviesUrl)
        .pipe(
          map(response => response.dates),
          shareReplay()
        );
    }
    return this.nowPlayingDates$;
  }

  getUpcomingDates$(): Observable<Dates> {
    if (!this.upcomingDates$) {
      this.upcomingDates$ = this.http.get<any>(this.upcomingMoviesUrl)
        .pipe(
          map(response => response.dates),
          shareReplay()
        );
    }
    return this.upcomingDates$;
  }

  getPopularMovies(): void {
    this.movies$.next([]);
    this.getMovies();
    console.log('inside get popular movies');
    console.log(this.urlParams);
  }

  getTopRatedMovies(): void {
    this.movies$.next([]);
    this.urlParams.sortCategory = UrlParameters.VOTE_AVG_DESC;
    this.urlParams.voteCountGte = UrlParameters.MINIMUM_VOTE_COUNT;
    this.getMovies();
    console.log('inside get top rated movies');
    console.log(this.urlParams);
  }

  getNowPlayingMovies(fromDate: string, toDate: string): void  {
    this.movies$.next([]);
    this.urlParams.releaseDateGte = fromDate;
    this.urlParams.releaseDateLte = toDate;
    this.urlParams.withReleaseType = UrlParameters.THEATRICAL_RELEASE;
    this.getMovies();
    console.log('inside get top now playing movies');
    console.log(this.urlParams);
  }

  getUpcomingMovies(fromDate: string, toDate: string): void {
    this.movies$.next([]);
    this.urlParams.releaseDateGte = fromDate;
    this.urlParams.releaseDateLte = toDate;
    this.urlParams.withReleaseType = UrlParameters.THEATRICAL_RELEASE;
    this.getMovies();
    console.log('inside get top upcoming movies');
    console.log(this.urlParams);
  }

  getGenres$(): Observable<Genre[]> {
    if (!this.genres$) {
      this.genres$ = this.http.get<any>(this.genresUrl)
        .pipe(
          map(result => result.genres),
          shareReplay()
        );
    }
    return this.genres$;
  }

  getMovieDetails$(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.movieDetailsUrl}/${id}?api_key=${environment.api_key}&append_to_response=credits,similar`);
  }

  getFavoriteMovies(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.backend_base_url}/users/${userId}/favorites`);
  }

  removeMovieFromFavorites(userId: number, movieId: number): Observable<Movie> {
    return this.http.delete<Movie>(`${environment.backend_base_url}/users/${userId}/favorites/${movieId}`);
  }

  getWatchlistMovies(userId: number): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.backend_base_url}/users/${userId}/watchlist`);
  }

  removeMovieFromWatchlist(userId: number, movieId: number): Observable<Movie> {
    return this.http.delete<Movie>(`${environment.backend_base_url}/users/${userId}/watchlist/${movieId}`);
  }
}
