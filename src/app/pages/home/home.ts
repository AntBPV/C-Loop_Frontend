import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Navbar } from '../../components/navbar/navbar';
import { AboutUs } from '../../components/about-us/about-us';
import { Faq } from '../../components/faq/faq';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Hero,Navbar, AboutUs, Faq, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
