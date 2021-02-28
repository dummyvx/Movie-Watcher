import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MovieService} from '../services/movie.service';
import {MovieDetails} from '../models/movie-details';
import {Person} from '../models/person';
import {Movie} from '../models/movie';
import {Backdrops} from '../models/backdrops';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

  movieDetails: MovieDetails;
  cast: Person[];
  similarMovies: Movie[];
  isLoading = false;
  images: any[];
  imageUrls: any[];

  constructor(public movieService: MovieService, private route: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit(): void {
    this.isLoading = true;
    const id = +this.route.snapshot.paramMap.get('id');
    this.movieService.getMovieDetails$(id)
      .subscribe(data => {
        this.movieDetails = data;
        this.cast = data.credits.cast;
        this.similarMovies = data.similar.results;
        this.images = data.images.backdrops;
        this.isLoading = false;
      }, error =>  {
        this.isLoading = false;
        console.log('something went wrong', error);
      });
  }

}
