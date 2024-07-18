import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
   }

  getHeaders(token?:String): HttpHeaders{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

        
    if(token){
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer '+token
      });
    }
    return headers
  }
  logout(token:String){
    const headers = this.getHeaders(token)
    return this.http.post<any>(`${this.apiUrl}/logout`,{}, { headers });
  }

  post(data: any,ruta: String,token?:String): Observable<any> {
    const headers = this.getHeaders(token)
    return this.http.post<any>(`${this.apiUrl}/${ruta}`, data, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(error); 
      })
    )
  }
  put(data: any,ruta: String,token?:String): Observable<any> {
    const headers = this.getHeaders(token)
    return this.http.put<any>(`${this.apiUrl}/${ruta}`, data, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(error); 
      })
    )
  }
  get(ruta: String,token?:String): Observable<any> {
    const headers = this.getHeaders(token)
    return this.http.get<any>(`${this.apiUrl}/${ruta}`, { headers }).pipe(
      tap(response => {
      }),
      catchError(error => {
        return throwError(error); 
      })
    )
  }
}
