import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Catalogue } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  constructor(private http: HttpClient) {
  }

  fetch(): Observable<Catalogue[]> {
    return this.http.get<Catalogue[]>('/api/catalogue')
  }
}