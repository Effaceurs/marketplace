import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Application } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) {
  }

  add(application: Application): Observable<any> {
    return this.http.post<Application>('/api/application/', application)
  }

  startDeploy(application: Application) {
    return this.http.post<Application>('/api/deploy/', application)
  }

  fetch(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/application')
  }

  startDeployTerraform(application: Application): Observable<any>  {
    return this.http.post<Application>('/api/deployterraform/', application)
  }
}