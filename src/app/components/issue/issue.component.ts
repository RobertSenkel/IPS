import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';

import { IssueElement } from 'src/app/services/data.service';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IssueComponent {
  _issue: IssueElement;
  get issue(): IssueElement {
    return this._issue;
  }
  @Input() set issue(value: IssueElement) {
    this._issue = value;

    this.issueForm = this.fb.group({
      id: new FormControl(value.id),
      title: new FormControl(value.title),
      text: new FormControl(value.text),
      tags: new FormControl(value.tags)
    });

    this.tags = value.tags;
  }

  @Input() availableTags: string[];

  @Input() isBlank: boolean = false;

  @Output() removeElement = new EventEmitter();

  @Output() editElement = new EventEmitter();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  isEditMode: boolean = false;

  issueForm: FormGroup;

  tagCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  filteredTags$: Observable<string[]>;

  constructor(private fb: FormBuilder) {
    this.filteredTags$ = this.tagCtrl.valueChanges.pipe(
      startWith<string>(null),
      map((tag: string | null) => tag ? this.filterTags(tag) : this.availableTags.slice()),
    );
  }

  save(): void {
    this.issueForm.get('tags').setValue(this.tags);
    this.issueForm.get('text').setValue(this.autoCalculate(this.issueForm.get('text').value));
    this.editElement.emit(this.issueForm.getRawValue());
    this.isEditMode = false;

    this.issueForm = new FormGroup({});
    this.tags = [];
    this.tagInput.nativeElement.value = '';
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.tags.push(value);
    }

    event.input.value = '';

    this.tagCtrl.setValue(null);
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.viewValue);
    this.tagCtrl.setValue(null);
  }

  private autoCalculate(text: any): string {
    const calcRegex = /([+-]?\d*\.?\d+(?:e[+-]\d+)?)\s*([+-])\s*([+-]?\d*\.?\d+(?:e[+-]\d+)?)/;
    text = text.replace(/([+-])([+-])(\d|\.)/g, (_, b, c, d) => { return (b === c ? '+' : '-') + d; });
    while (text.search(calcRegex) !== -1) {
      text = text.replace(calcRegex, (a) => {
        const sides = calcRegex.exec(a);
        return sides[2] === '+' ? +sides[1] + +sides[3] : +sides[1] - +sides[3];
      });
    }
    return text;
  }

  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
