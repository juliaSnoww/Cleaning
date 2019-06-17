import {Component, Input, OnInit} from '@angular/core';
import {CommentModel} from '../shared/model/comment.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() comment: CommentModel;

  constructor() {
  }

  ngOnInit() {
    this.comment.date = new Date(this.comment.date).toLocaleDateString();
  }

}
