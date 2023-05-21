type Level = 'debug' | 'info' | 'success' | 'error';
type Color = 'white' | 'info' | 'positive' | 'negative';
type Icon = null | 'info' | 'check' | 'close';
interface Log {
  datetime: string,
  level: Level,
  color: Color,
  icon: Icon,
  message: string,
  args: unknown
}
