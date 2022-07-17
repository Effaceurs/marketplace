import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Application, Catalogue } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) {
  }

  add(application: Catalogue): Observable<any> {
    return this.http.post<Application>('/api/application/', application)
  }

  fetch(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/application')
  }

  deploy(application: Application): Observable<any>  {
    return this.http.post<Application>('/api/deploy/', application)
  }
}