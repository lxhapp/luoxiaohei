declare module "node-schedule" {
  type Job = {
    cancel: () => void;
  };

  type RecurrenceRule = {
    year?: number;
    month?: number;
    date?: number;
    dayOfWeek?: number;
    hour?: number;
    minute?: number;
    second?: number;
  };

  type JobCallback = () => void | Promise<void>;

  export function scheduleJob(
    rule: Date | string | RecurrenceRule,
    callback: JobCallback
  ): Job;

  export function cancelJob(job: Job): void;

  export class RecurrenceRule {
    constructor();
    year: number;
    month: number;
    date: number;
    dayOfWeek: number;
    hour: number;
    minute: number;
    second: number;
  }
}
