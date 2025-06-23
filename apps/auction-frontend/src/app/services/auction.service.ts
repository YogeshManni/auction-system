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

  createAuction(auction: Partial<Auction>): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, auction);
  }

  updateAuction(id: string, auction: Partial<Auction>): Observable<Auction> {
    return this.http.put<Auction>(`${this.apiUrl}/${id}`, auction);
  }
}
