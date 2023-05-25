import { DateTime } from 'luxon';

export default class logger {
  logs: Log[];
  limit: number;

  constructor(limit = 100) {
    this.logs = [];
    this.limit = limit;
  }

  public debug(message: string, args: unknown = undefined): void {
    this.append('debug', 'white', null, message, args);
  }

  public info(message: string, args: unknown = undefined): void {
    this.append('info', 'info', 'info', message, args);
  }

  public success(message: string, args: unknown = undefined): void {
    this.append('success', 'positive', 'check', message, args);
  }

  public warning(message: string, args: unknown = undefined): void {
    this.append('warning', 'warning', 'warning', message, args);
  }

  public error(message: string, args: unknown = undefined): void {
    this.append('error', 'negative', 'close', message, args);
  }

  public append(level: Level, color: Color, icon: Icon, message: string, args: unknown = undefined): void {
    console.log(level, color, icon, message, args);
    this.logs.push({
      datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
      level,
      color,
      icon,
      message,
      args,
    });
    if (this.logs.length > this.limit) {
      this.logs.shift();
    }
  }

  public getLogs(): Log[] {
    return this.logs;
  }

  public getReverseLogs(): Log[] {
    return [...this.getLogs()].reverse();
  }
}
