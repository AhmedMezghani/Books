import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import * as Pica from 'pica';

@Component({
  selector: 'app-cover-image-settings',
  templateUrl: './cover-image-settings.component.html',
  styleUrls: ['./cover-image-settings.component.css']
})
export class CoverImageSettingsComponent  implements OnInit {
  constructor(
    public activeModal: NgbActiveModal
  ) { }


  @Input() imageByteArray!: Uint8Array;
  imageWidth!: number;
  imageHeight!: number;
  image_src:string ="";
  defaultBackgroundSize !:number;
  backgroundSize: number = 100;
  isDragging: boolean = false;
  startPosition: { x: number, y: number } = { x: 0, y: 0 };
  currentPosition: { x: number, y: number } = { x: 0, y: 0 };
  backgroundPosition: string = '0% 0%';


  ngOnInit(): void {
    const blob = new Blob([this.imageByteArray], { type: 'image/jpeg' });
    const img = new Image();
    img.onload = () => {
      this.imageWidth = img.width;
      this.imageHeight = img.height;
      console.log('Image dimensions:', this.imageWidth, 'x', this.imageHeight);
      if (this.imageWidth<=this.imageHeight){
        this.backgroundSize=100;
      }
      else {
        this.backgroundSize=100*this.imageWidth/this.imageHeight;
      }
      this.defaultBackgroundSize=this.backgroundSize;
    };
    img.src = URL.createObjectURL(blob);
    this.image_src = URL.createObjectURL(blob);
  }
///////////////////////////////////////////////////////////////////////////////////////////////////

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startPosition = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
  }


  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startPosition.x;
      const deltaY = event.clientY - this.startPosition.y;
      if (this.isValidDrag(deltaX, deltaY)) {
        this.updatePosition(deltaX, deltaY);
      }
      this.startPosition = { x: event.clientX, y: event.clientY };
    }
  }

  private isValidDrag(deltaX: number, deltaY: number): boolean {
    const isValidX =
      this.currentPosition.x - deltaX >= 0 &&
      this.currentPosition.x - deltaX <= 100;
    const isValidY =
      this.currentPosition.y - deltaY >= 0 &&
      this.currentPosition.y - deltaY <= 100;
    return isValidX && isValidY;
  }

  private calculateMaxX(): number {
    if (this.imageWidth < this.imageHeight) {
      return this.backgroundSize - this.defaultBackgroundSize;
    } else {
      return this.backgroundSize - this.defaultBackgroundSize * (this.imageHeight / this.imageWidth);
    }
  }

  private calculateMaxY(): number {
    if (this.imageWidth < this.imageHeight) {
      return this.imageHeight * this.backgroundSize / this.imageWidth - this.defaultBackgroundSize;
    } else {
      return (this.imageHeight / this.imageWidth) * (this.backgroundSize - this.defaultBackgroundSize);
    }
  }

  private updatePosition(deltaX: number, deltaY: number): void {
    this.currentPosition = {
      x: this.currentPosition.x - deltaX,
      y: this.currentPosition.y - deltaY
    };

    this.backgroundPosition = `${this.currentPosition.x}% ${this.currentPosition.y}%`;
    console.log(this.currentPosition);
  }
  onTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    const touch = event.touches[0];
    this.startPosition = { x: touch.clientX, y: touch.clientY };
  }
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    this.onMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY
    } as MouseEvent);
  }

  onTouchEnd(): void {
    this.onMouseUp();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  onSliderChange(event: any): void {
    this.backgroundSize = event.target.value;

  }

  onSliderMouseUp(): void {
    if (this.imageWidth < this.imageHeight) {
      this.handleImageWidthLessThanHeight();
    } else {
      this.handleImageWidthGreaterThanHeight();
    }
  }

  private handleImageWidthLessThanHeight(): void {
    if (this.currentPosition.x > 100) {
      this.currentPosition = {
        x: 100,
        y: this.currentPosition.y
      };
    }

    if (this.currentPosition.y > 100) {
      this.currentPosition = {
        x: this.currentPosition.x,
        y: 100
      };
    }

    this.updateBackgroundPosition();
  }

  private handleImageWidthGreaterThanHeight(): void {
    if (this.currentPosition.x > this.calculateMaxX()) {
      this.currentPosition = {
        x: this.calculateMaxX(),
        y: this.currentPosition.y
      };
    }

    if (this.currentPosition.y > this.calculateMaxY()) {
      this.currentPosition = {
        x: this.currentPosition.x,
        y: this.calculateMaxY()
      };
    }

    this.updateBackgroundPosition();
  }

  private updateBackgroundPosition(): void {
    this.backgroundPosition = `${this.currentPosition.x}% ${this.currentPosition.y}%`;
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////





  onModifyClick(): void {
    const clipPath = `inset(${this.currentPosition.y}px ${this.currentPosition.x}px
      ${100 - this.currentPosition.y}px ${100 - this.currentPosition.x}px)`;
      if (this.imageByteArray) {
        const blob = new Blob([this.imageByteArray], { type: 'image/jpeg' }); // Adjust the type based on your image format
        const reader = new FileReader();
        reader.onloadend = () => {
          this.cropImage().then((croppedBlob) => {
            this.activeModal.close(croppedBlob);
          });
        };
        reader.readAsDataURL(blob);
      }
  }
  cropImage():  Promise<Blob>  {
    return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const img = new Image();
    img.src = this.image_src;

    canvas.width = 100*this.imageWidth/this.backgroundSize ;
    canvas.height = 100*this.imageWidth/this.backgroundSize;
    ctx.drawImage(
        img,
        this.currentPosition.x*(this.imageWidth-100*this.imageWidth/this.backgroundSize)/100,
        this.currentPosition.y*(this.imageHeight-100*this.imageWidth/this.backgroundSize)/100,
        2000,
        2000,
        0,0,2000,2000
    );

     canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        console.error('Error creating Blob from canvas.');
      }
    }, 'image/jpeg');
    });
  }

}
