import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

export interface IssueElement {
    id: string;
    title: string;
    text: string;
    tags: string[];
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private httpClient: HttpClient) { }

    getIssues(): Observable<IssueElement[]> {
        return this.httpClient.get<IssueElement[]>('assets/data.json');
    }
}