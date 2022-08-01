import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { AppVersion } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppVersionService {
  constructor(private http: HttpClient) {
  }

  get(image: string, provider: string): Observable<AppVersion[]> {
    return this.http.get<AppVersion[]>('/api/appversion/', {params: {image, provider}})
  }

}