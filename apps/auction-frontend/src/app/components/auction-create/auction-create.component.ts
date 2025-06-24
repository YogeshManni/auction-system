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
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './auction-create.component.html',
  styleUrls: ['./auction-create.component.css'],
})
export class AuctionCreateComponent {
  form: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

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
      currentBid: [[Validators.min(0)]],
      endTime: ['', Validators.required],
      status: ['active', Validators.required],
      imageUrl: [null],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      this.form.patchValue({ imageUrl: this.selectedImage });
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  submit(): void {
    if (this.form.valid && this.selectedImage) {
      const formData = new FormData();
      formData.append('title', this.form.get('title')?.value);
      formData.append('description', this.form.get('description')?.value);
      formData.append(
        'current_bid',
        this.form.get('currentBid')?.value.toString()
      );
      formData.append(
        'end_time',
        this.form.get('endTime')?.value.toISOString()
      );
      formData.append('status', this.form.get('status')?.value);
      formData.append('imageUrl', this.selectedImage);

      this.auctionService.createAuction(formData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Failed to create auction:', err),
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
