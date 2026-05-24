import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css',
})
export class Faq {
  activeIndex = signal<number | null>(null);

  faqs: FaqItem[] = [
    {
      question: '¿Qué es C-Loop?',
      answer: 'C-Loop es una plataforma institucional para gestionar convenios entre la universidad y empresas o instituciones externas.'
    },
    {
      question: '¿Quién puede registrarse?',
      answer: 'Cualquier persona con un correo institucional válido puede crear una cuenta y acceder al sistema.'
    },
    {
      question: '¿Cómo se crea un convenio?',
      answer: 'Una vez autenticado, puedes crear un convenio desde el panel principal completando la información requerida y adjuntando los documentos necesarios.'
    },
    {
      question: '¿Cuánto tiempo tarda la validación de una empresa?',
      answer: 'El proceso de validación es revisado por el equipo jurídico y puede tomar entre 1 y 3 días hábiles.'
    },
    {
      question: '¿Puedo hacer seguimiento al estado de mi convenio?',
      answer: 'Sí, desde tu panel puedes ver el historial completo de estados y las etapas de aprobación de cada convenio en tiempo real.'
    },
  ];

  toggle(index: number) {
    this.activeIndex.set(this.activeIndex() === index ? null : index);
  }
}
