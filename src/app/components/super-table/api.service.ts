import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(apiUrl: string) {
    return this.http.get<any>(apiUrl, { responseType: 'json' });
  }
}
