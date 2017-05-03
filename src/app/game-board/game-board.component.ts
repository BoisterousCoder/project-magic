import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  zoom:number = 1;
  @Input() landSize:number;
  board = [
    {
      color:'blue',
      x:0,
      y:0
    }
  ]
  constructor() {

  }

  ngOnInit() {
  }

}
