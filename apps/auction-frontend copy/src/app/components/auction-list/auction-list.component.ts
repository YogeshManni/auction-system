import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AuctionService } from '../../services/auction.service';
import { AuctionCreateComponent } from '../auction-create/auction-create.component';
import { Auction } from '@live-auction-system/shared-types';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auction-list',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIcon,
    AuctionCreateComponent,
  ],
  templateUrl: './auction-list.component.html',
  styleUrls: ['./auction-list.component.css'],
})
export class AuctionListComponent implements OnInit {
  auctions: Auction[] = [];

  private auctionService = inject(AuctionService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  ngOnInit(): void {
    console.log('list');
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.auctionService.getAuctions().subscribe({
      next: (data) => {
        console.log(data);
        this.auctions = data;
      },
      error: (err) => console.error('Failed to load auctions:', err),
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AuctionCreateComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadAuctions();
      }
    });
  }

  viewAuction(id: string): void {
    this.router.navigate(['/auction', id]);
  }
}
