class Days {
  map: Map<number, string>;

  constructor() {
    this.map = new Map();
    this.map.set(0, 'Sunday');
    this.map.set(1, 'Monday');
    this.map.set(2, 'Tuesday');
    this.map.set(3, 'Wednesday');
    this.map.set(4, 'Thursday');
    this.map.set(5, 'Friday');
    this.map.set(6, 'Saturday');
  }

  get = (key: number): string => {
    const t = this.map.get(key);
    return t || 'Sunday';
  };
}

const week = new Days();

export default week;
