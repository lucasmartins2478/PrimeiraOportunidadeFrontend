import { Component, Input } from '@angular/core';
import { IJob } from '../../models/job.interface';

@Component({
  selector: 'app-job-card',
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.css'
})
export class JobCardComponent {
  @Input() job!: IJob;
}
