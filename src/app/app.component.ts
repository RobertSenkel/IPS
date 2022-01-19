import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { DataService, IssueElement } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ips';

  issues: IssueElement[];

  allIssues: IssueElement[];

  blankIssue: IssueElement;

  availableTags = [];

  shouldResetFilter = new Subject();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getIssues().pipe(first()).subscribe(issues => {
      this.allIssues = this.issues = issues;
      this.setUpBlankIssue();
      this.getAvailableTags();
    });
  }

  onFilterChange(filtered: string[]): void {
    this.issues = [...new Set(this.allIssues.filter(iss => filtered.every(fil => iss.tags.includes(fil))))];
  }

  addElement(newIssue: IssueElement): void {
    this.issues.push(newIssue);
    this.allIssues = [...this.allIssues, newIssue];
    this.shouldResetFilter.next();
    this.setUpBlankIssue();
    this.getAvailableTags();
  }

  editElement(editedIssue: IssueElement): void {
    this.issues = this.allIssues = this.issues.map(iss => {
      const el = iss.id === editedIssue.id;
      return el ? editedIssue : iss;
    });

    this.getAvailableTags();
  }

  removeElement(id: string): void {
    this.allIssues = [...this.issues.filter(iss => iss.id !== id)]
    this.issues = this.issues.filter(iss => iss.id !== id);

    this.getAvailableTags();
  }

  private getAvailableTags(): void {
    const merged = [].concat.apply([], this.allIssues.map(iss => iss.tags));
    this.availableTags = [...new Set(merged)];
  }

  private setUpBlankIssue(): void {
    this.blankIssue = {
      id: uuidv4(),
      title: '',
      tags: [],
      text: ''
    } as IssueElement;
  }
}
