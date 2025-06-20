import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Home } from './components/home/home';
import { bootstrapApplication } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';

@Component({
  imports: [RouterModule, Home, MatTableModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'auction-frontend';
}
