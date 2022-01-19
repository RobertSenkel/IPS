import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-issue-filter',
  templateUrl: './issue-filter.component.html',
  styleUrls: ['./issue-filter.component.scss']
})
export class IssueFilterComponent implements OnInit {
  @Input() tagList: string[];

  @Input() shouldResetFilter = new Subject();

  @Output() filterChanged = new EventEmitter;

  tagCtrl = new FormControl();

  ngOnInit(): void {
    this.tagCtrl.valueChanges.pipe(
      filter(val => !!val),
      tap(() => this.filterChanged.emit(this.tagCtrl.value))
    ).subscribe();

    this.shouldResetFilter.subscribe(() => {
      this.filterChanged.emit([]);
      this.tagCtrl.setValue('');
    })
  }

}
