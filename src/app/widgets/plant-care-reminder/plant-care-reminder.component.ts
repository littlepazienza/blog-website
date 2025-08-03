import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant-care-reminder',
  templateUrl: './plant-care-reminder.component.html',
  styleUrls: ['./plant-care-reminder.component.css']
})
export class PlantCareReminderComponent implements OnInit {

  /** Indicates widget is fetching data */
  loading = true;

  /** Upcoming care reminders */
  reminders: PlantReminder[] = [];

  ngOnInit(): void {
    /*
     * TODO: replace with real persistence layer / API.
     * Simulate async load so the UI can show loading state.
     */
    setTimeout(() => {
      const today = new Date();

      /** Helper to add N days and return ISO string */
      const plusDays = (days: number): string =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + days).toISOString();

      /* Mock data – upcoming week */
      this.reminders = [
        { plant: 'Monstera Deliciosa', task: 'Water',      due: plusDays(1) },
        { plant: 'String of Pearls',    task: 'Fertilize', due: plusDays(2) },
        { plant: 'Snake Plant',         task: 'Prune',     due: plusDays(3) },
        { plant: 'Pothos Marble Queen', task: 'Repot',     due: plusDays(5) },
        { plant: 'ZZ Plant',            task: 'Water',     due: plusDays(6) }
      ];

      this.loading = false;
    }, 800);
  }

}

/**
 * Interface representing a single plant-care reminder
 */
export interface PlantReminder {
  /** Common name of the plant */
  plant: string;
  /** Task to perform (watering, pruning, etc.) */
  task: 'Water' | 'Fertilize' | 'Repot' | 'Prune' | string;
  /** ISO-8601 due date */
  due: string;
}
