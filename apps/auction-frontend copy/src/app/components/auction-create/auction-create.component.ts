import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuctionService } from '../../services/auction.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-auction-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './auction-create.component.html',
  styleUrls: ['./auction-create.component.css'],
})
export class AuctionCreateComponent {
  form: FormGroup;

  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AuctionCreateComponent>);
  private auctionService = inject(AuctionService);
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

  submit(): void {
    if (this.form.valid) {
      const auction = {
        ...this.form.value,
        endTime: new Date(this.form.value.endTime).toISOString(),
      };
      this.auctionService.createAuction(auction).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Failed to create auction:', err),
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
