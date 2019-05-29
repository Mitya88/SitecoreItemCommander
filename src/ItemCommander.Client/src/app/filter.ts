import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'filterchildren'
})
export class FilterChildren implements PipeTransform {
 
  transform(items: any[], value: boolean): any[] {
    if (!items) return [];
    
    if(value) return items;
    return items.filter(e => !e.IsHidden );
    
  }
 
}