import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvenioResponse} from '../../../core/services/convenios-service';

@Component({
  selector: 'app-convenio-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convenio-info.html',
  styleUrl: './convenio-info.css',
})
export class ConvenioInfo {
  @Input() convenio!: ConvenioResponse;
}
