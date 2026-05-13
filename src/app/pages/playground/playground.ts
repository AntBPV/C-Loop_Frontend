import { Component } from '@angular/core';
import { ConvenioCard, ConvenioCardData } from '../../components/convenio-card/convenio-card';

@Component({
  selector: 'app-playground',
  imports: [ConvenioCard],
  templateUrl: './playground.html',
  styleUrl: './playground.css',
})
export class Playground {
  conveniosMock: ConvenioCardData[] = [
    {
      titulo: 'Convenio de prácticas profesionales 2026',
      empresa: 'Empresa Prueba SAS',
      tipo: 'PRACTICA',
      fechaVencimiento: '2027-05-08',
      estado: 'ok'
    },
    {
      titulo: 'Convenio marco de cooperación institucional',
      empresa: 'Corporación Ejemplo',
      tipo: 'MARCO',
      fechaVencimiento: '2026-08-01',
      estado: 'atencion'
    },
    {
      titulo: 'Acuerdo de colaboración académica',
      empresa: 'Instituto Nacional',
      tipo: 'COLABORACION',
      fechaVencimiento: '2026-06-15',
      estado: 'por-vencer'
    },
    {
      titulo: 'Convenio de investigación conjunta',
      empresa: 'Tech Research CO',
      tipo: 'INVESTIGACION',
      fechaVencimiento: '2027-01-20',
      estado: 'notificacion'
    },
  ];
}
