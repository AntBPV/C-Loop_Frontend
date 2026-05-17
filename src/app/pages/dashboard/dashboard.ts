import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {}
