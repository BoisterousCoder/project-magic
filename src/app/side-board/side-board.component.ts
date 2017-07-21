import { Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'side-board',
    templateUrl: './side-board.component.html',
    styleUrls: ['./side-board.component.css']
})
export class SideBoardComponent implements OnInit {
    @Input() socket;
    @Input() gameId;
    @Input() windowWidth;
    @Input() windowHeight;
    @Input() minWindowSize;
    @Input() maxWindowSize;
    @Input() isWindowVertical;
    ngOnInit() {

    }
}