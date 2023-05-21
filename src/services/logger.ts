import { Log } from 'app/interface';
import { DateTime } from 'luxon';

export default class logger {
  logs: Log[];

  constructor() {
    this.logs = [];
  }

  public debug(message: string, ...args: unknown[]): void {
    this.append('debug', 'dark', message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.append('info', 'positive', message, ...args);
  }


  public error(message: string, ...args: unknown[]): void {
    this.append('error', 'negative', message, ...args);
  }

  public append(level: Level, color: Color, message: string, ...args: unknown[]): void {
    this.logs.push({
      datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
      level,
      color,
      message,
      args,
    });
  }

  public getLogs(limit = 0): Log[] {
    return this.logs.length > limit
      ? this.logs.slice(this.logs.length - limit)
      : this.logs;
  }
}
