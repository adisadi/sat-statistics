import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class DataService {

  private _clanData: any;
  private _updateDate:Date;

  private clanInfoUrl = '/api/clan';
  private updateDateUrl = '/api/update-date';

  constructor(private http: HttpClient) { }

  async getClanInfo(): Promise<any> {
    if (!this._clanData) {
      this._clanData = await this.http.get<any>(this.clanInfoUrl)
        .pipe(
          tap(heroes => this.log(`fetched clanInfo`)),
          catchError(this.handleError('getClanInfo', []))
        )
        .toPromise();
    }
    return this._clanData;
  }

  async getUpdateDate(): Promise<Date> {
    if (!this._updateDate) {
      this._updateDate = await this.http.get<any>(this.updateDateUrl)
        .pipe(
          tap(heroes => this.log(`fetched update-date`)),
          catchError(this.handleError('getUpdateDate', []))
        ).map(res=> new Date(res))
        .toPromise();
    }
    return this._updateDate;
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
