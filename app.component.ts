import { Component, ElementRef, ViewChild, ViewChildren, AfterViewInit, HostListener, Renderer2, QueryList } from '@angular/core';

interface CanvasProerties {
  style : {
    width: string,
    height: string,
    position: string,
    left: string,
    top: string,
    border: string,
    background: string,
    zIndex: string,
    boxShadow: string
  },
  id: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('fence') public fence: ElementRef;
  public boxes: CanvasProerties[] = [];
  @ViewChildren('box', { read: ElementRef }) public boxElements: QueryList<ElementRef>;
  boxWidth: number = 50;
  boxHeight: number = 50;
  boxBoredr: string = "1px solid #000000";
  boxBackground: string = "rgb(212, 92, 92)";
  boxZindex = 0;
  boxId = 0;
  left = 10;
  top = 10;
  selectedCanvasIndex: number = 0;
  fencingWidth: number = 500;
  fencingHeight: number = 500;
  fencingBoredr: string = "2px solid #000000";
  private cx: CanvasRenderingContext2D;
  private px: CanvasRenderingContext2D;
  constructor(private renderer: Renderer2) {}

  // Create fencing for boxes
  public ngAfterViewInit() {
    const fencing: HTMLElement = this.fence.nativeElement;
    fencing.style.width = this.fencingWidth + 'px';
    fencing.style.height = this.fencingHeight+ 'px';
    fencing.style.border = this.fencingBoredr;
    fencing.style.position = 'relative';
  }
   
  // Add new box
  addBox() {
    const style = {
      width : this.boxWidth + 'px',
      height : this.boxHeight+ 'px',
      position : 'absolute',
      left : this.left+ 'px',
      top : this.top+ 'px',
      border : this.boxBoredr,
      background : this.boxBackground,
      zIndex : (this.boxZindex++).toString(),
      boxShadow : "0px"
    };
    const id = ("box"+(this.boxId++)).toString();
    const box: CanvasProerties = { style : style, id: id};
    this.boxes.push(box);
  }

  // Highight the box on its selection
  selectBox(indexofElement) { 
    this.selectedCanvasIndex = indexofElement;
    const canvasElRef: ElementRef = this.boxElements.find((canvasElement, index) => index == indexofElement);
    const canvasEl: HTMLCanvasElement = canvasElRef.nativeElement;
    this.cx = canvasEl.getContext('2d');
    canvasEl.style.boxShadow = "0px 12px 22px 1px #333";
    canvasEl.style.border = "2px dotted yellow";
  }

  // Listen to the keyboard inputs and move the boxes
  @HostListener('document:keydown', ['$event'])
  moveBox(event: KeyboardEvent) { 
    let keyPr = event.keyCode;
    const box = this.boxes[this.selectedCanvasIndex];
    let {style : {left, top} } = box;

    if(keyPr === 39 && parseInt(left)<=400){ 
      left = (parseInt(left)+50)+'px'; //right arrow add 50 from current
    }
    else if(keyPr === 37 && parseInt(left)>10){
      left = (parseInt(left)-50)+'px'; //left arrow subtract 50 from current
    }
    else if(keyPr === 38 && parseInt(top)>10) {
      top = (parseInt(top)-50)+'px'; //top arrow subtract 50 from current
    }
    else if(keyPr === 40 && this.top<=400){
      top = (parseInt(top)+50)+'px'; //bottom arrow add 50 from current
    }
    else if(keyPr === 110){
      box.style.width = "0px";
      box.style.height = "0px"; //bottom arrow add 50 from current
    }
    box.style.left = left;
    box.style.top = top;
    box.style.boxShadow = "0px";
    box.style.border = this.boxBoredr;
  }
}
