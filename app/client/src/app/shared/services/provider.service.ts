import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http'
import { Provider } from "../interfaces";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(private http: HttpClient) {
  }

  get(): Observable<Provider[]> {
    return this.http.get<Provider[]>('/api/provider/')
  }

}