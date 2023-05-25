type Level = 'debug' | 'info' | 'success' | 'warning' | 'error';
type Color = 'white' | 'info' | 'positive' | 'warning' | 'negative';
type Icon = null | 'info' | 'check' | 'warning' | 'close';
interface Log {
  datetime: string;
  level: Level;
  color: Color;
  icon: Icon;
  message: string;
  args: unknown;
}
