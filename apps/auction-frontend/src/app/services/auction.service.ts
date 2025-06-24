import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../environment';
import { Auction } from '@live-auction-system/shared-types';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private apiUrl = `${env.apiUrl}/api/auctions`;

  private http = inject(HttpClient);

  getAuctions(): Observable<Auction[]> {
    return this.http.get<Auction[]>(this.apiUrl);
  }

  getAuction(id: string): Observable<Auction> {
    return this.http.get<Auction>(`${this.apiUrl}/${id}`);
  }

  createAuction(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateAuction(id: string, auction: any): Observable<Auction> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, auction);
  }
}
