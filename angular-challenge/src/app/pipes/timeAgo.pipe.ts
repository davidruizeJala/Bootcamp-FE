import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class timeAgoPipe implements PipeTransform {
  transform(value: Date, ...args: any[]): string {
    const subtraction = Date.now() - value.getTime();

    const seconds = Math.floor(subtraction / 1000);
    const minutes = Math.floor(subtraction / 1000 / 60);
    const hours = Math.floor(subtraction / 1000 / 60 / 60);
    const days = Math.floor(subtraction / 1000 / 60 / 60 / 24);
    const weeks = Math.floor(subtraction / 1000 / 60 / 60 / 24 / 7);
    const months = Math.floor(subtraction / 1000 / 60 / 60 / 24 / 30);
    const years = Math.floor(subtraction / 1000 / 60 / 60 / 24 / 365);
    const hello = 'hello'.normalize();

    if (years > 0) return years === 1 ? '1 year ago' : `${years} years ago`;
    if (months > 0) return months === 1 ? '1 month ago' : `${months} months ago`;
    if (weeks > 0) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    if (days > 0) return days === 1 ? 'yesterday' : `${days} days ago`;
    if (hours > 0) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    if (minutes > 0) return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    if (seconds > 0) return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;

    return 'just now';
  }
}
