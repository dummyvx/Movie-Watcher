import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Genre } from 'src/app/movies/models/genre';
import { Movie } from 'src/app/movies/models/movie';
import { environment } from 'src/environments/environment';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent implements OnInit {

  env: string = environment.tmdb_imagesUrl_w300;

  @Input()
  genres: Genre[];

  @Input()
  movie: Movie;
  @Output()
  toBeDeletedMovieId = new EventEmitter<number>();

  currentUrl: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUrl = this.route.snapshot.routeConfig.path;
  }

  getGenreById(id: string): string {
    if (this.genres) {
      return this.genres.find(genre => genre.id === id).name;
    }
  }

  remove(movieId: number): void {
    this.toBeDeletedMovieId.emit(movieId);
  }

}
