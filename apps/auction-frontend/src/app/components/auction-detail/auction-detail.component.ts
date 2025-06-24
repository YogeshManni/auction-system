import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuctionService } from '../../services/auction.service';
import { Auction } from '@live-auction-system/shared-types';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnakeToCamelPipe } from '../../pipes/snake-to-camel-pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
@Component({
  selector: 'app-auction-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [SnakeToCamelPipe],
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.css'],
})
export class AuctionDetailComponent implements OnInit {
  auction: Auction | null = null;
  form: FormGroup;
  isEditing = false;

  private route = inject(ActivatedRoute);
  private auctionService = inject(AuctionService);
  private fb = inject(FormBuilder);
  private SnakeToCamelPipe = inject(SnakeToCamelPipe);

  constructor() {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
      ],
      description: ['', Validators.maxLength(1000)],
      currentBid: [0, [Validators.min(0)]],
      endTime: ['', Validators.required],
      status: ['active', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.auctionService.getAuction(id).subscribe({
        next: (data) => {
          this.auction = this.SnakeToCamelPipe.transform(data) as Auction;

          console.log(this.auction);
          /* this.form.patchValue({
            ...data,
            endTime: new Date(data.endTime).toISOString().slice(0, 16),
          }); */
        },
        error: (err) => console.error('Failed to load auction:', err),
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  updateAuction(): void {
    if (this.form.valid && this.auction) {
      //console.log('Updating auction with form value:', this.form.value.endTime);
      const auction = {
        //id: this.auction.id,
        title: this.form.value.title,
        description: this.form.value.description,
        current_bid: this.form.value.currentBid,
        status: this.form.value.status,
        end_time: this.form.value.endTime.toISOString(), // Ensure endTime is in ISO format
      };
      console.log('Updating auction:', auction);
      this.auctionService.updateAuction(this.auction.id, auction).subscribe({
        next: (data) => {
          this.auction = this.SnakeToCamelPipe.transform(data) as Auction;
          this.isEditing = false;
        },
        error: (err) => console.error('Failed to update auction:', err),
      });
    }
  }
}
