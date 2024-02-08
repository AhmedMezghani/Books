import { Component, OnInit,ViewChild } from '@angular/core';

import { NgbCarousel, NgbSlideEvent, NgbCarouselModule,NgbSlideEventSource,NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

interface Image {
  src: string;
  title?: string;
  alt?: string;
}
@Component({
  selector: 'app-gallery',

  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  selectedImage: string ='';
  imageSize = 430;
	constructor(config: NgbCarouselConfig) {
    config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
  }
  ngOnInit(): void {
  }

  showNavigationArrows = false;
	showNavigationIndicators = false;


	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = true;
	pauseOnFocus = true;
  @ViewChild('carousel', { static: true }) carousel !: NgbCarousel;


  productImages = [ {url: 'assets/Gallery/woman1.jpg'},
  {url: 'assets/Gallery/woman2.jpg'},
    {url: 'assets/Gallery/woman3.jpg'},

  {url: 'assets/Gallery/woman4.jpg'}]




changeimage(image: string){
this.selectedImage = image;
}
}
