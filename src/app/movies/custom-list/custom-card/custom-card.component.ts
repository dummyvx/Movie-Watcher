import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Genre} from '../../models/genre';
import {Movie} from '../../models/movie';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['../../movie-browser/movie-list/movie-card/movie-card.component.css', './custom-card.component.css']
})
export class CustomCardComponent implements OnInit {

  env: string = environment.tmdb_imagesUrl_w300;

  @Input()
  genres: Genre[];
  @Input()
  movie: Movie;
  @Output()
  toBeDeletedMovie = new EventEmitter<Movie>();

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

  remove(toBeDeletedMovie: Movie): void {
    this.toBeDeletedMovie.emit(toBeDeletedMovie);
  }

  justify(): boolean {
    if (this.currentUrl === 'movies/:id') {
      return true;
    }
  }

}
