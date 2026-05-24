import { Component } from '@angular/core';
import { Hero } from './hero/hero';
import { Navbar } from './navbar/navbar';
import { AboutUs } from './about-us/about-us';
import { Faq } from './faq/faq';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-home',
  imports: [Hero,Navbar, AboutUs, Faq, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
