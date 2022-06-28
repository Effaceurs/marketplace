import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http'
import { Store } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private http: HttpClient) {
  }

  add(category: Store): Observable<any> {
    return this.http.post<Store>('/api/category/', category)
  }

  fetch(): Observable<Store[]> {
    return this.http.get<Store[]>('/api/category')
  }
}