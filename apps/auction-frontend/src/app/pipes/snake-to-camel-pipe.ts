import { Pipe, PipeTransform } from '@angular/core';
import { Auction } from '@live-auction-system/shared-types';

@Pipe({
  name: 'snakeToCamel',
})
export class SnakeToCamelPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value || typeof value !== 'object') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.transformItem(item));
    }

    return this.transformItem(value);
  }

  private transformItem(item: any): Auction {
    return Object.keys(item).reduce((acc: any, key) => {
      // Convert snake_case to camelCase
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );

      // Apply type conversions
      let value = item[key];
      if (camelKey === 'currentBid') {
        value = parseFloat(value) || 0;
      } else if (camelKey === 'endTime') {
        value = value ? new Date(value) : new Date();
      } else if (camelKey === 'status') {
        value = ['active', 'closed'].includes(value) ? value : 'active';
      }

      acc[camelKey] = value;
      return acc;
    }, {} as Auction);
  }
}
