import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auction } from '@live-auction-system/shared-types';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MatTableModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  auctions: Auction[] = [];
  private http = inject(HttpClient);

  ngOnInit() {
    const h = 'dev';
    console.log(h);
    /*  this.http.get<Auction[]>(`${process.env['AUCTION_API_URL']}/api/auctions`).subscribe(data => {
      this.auctions = data;
    }); */
    // Subscribe to Pub/Sub for real-time bid updates
    // Implement WebSocket or long-polling for local dev
  }
}
