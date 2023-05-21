import { DateTime } from 'luxon';

type Level = 'debug' | 'info' | 'error';
type Color = 'body' | 'success' | 'danger';
type Icon = null | 'CheckIcon' | 'PriorityHighIcon';
interface Log {
  datetime: string,
  level: Level,
  color: Color,
  icon: Icon,
  message: string,
  args: unknown[]
}

export default class logger {
  logs: Log[];

  constructor() {
    this.logs = [];
  }

  public debug(message: string, ...args: unknown[]): void {
    this.append('debug', 'body', null, message, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.append('info', 'success', 'CheckIcon', message, ...args);
  }


  public error(message: string, ...args: unknown[]): void {
    this.append('error', 'danger', 'PriorityHighIcon', message, ...args);
  }

  public append(level: Level, color: Color, icon: Icon, message: string, ...args: unknown[]): void {
    this.logs.push({
      datetime: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS),
      level,
      color,
      icon,
      message,
      args,
    });
  }

  public getLogs(limit = 0): Log[] {
    return this.logs.slice(this.logs.length - limit);
  }
}
