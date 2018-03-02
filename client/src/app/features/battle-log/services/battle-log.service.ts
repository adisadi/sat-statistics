import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';

@Injectable()
export class BattleLogService {

  private _clanData: any;


  private personalStatUrl = '/api/personal-stats';

  constructor(private http: HttpClient) { }

  async getPersonalStat(): Promise<any> {

    let params = new HttpParams();

    params = params.append('stat', 'all');
   
    return await this.http.get<any>(this.personalStatUrl, { params: params })
      .pipe(
        tap(heroes => this.log(`fetched skirmish`)),
        catchError(this.handleError('getSkirmishStat', []))
      ).toPromise();
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message);
  }


}
