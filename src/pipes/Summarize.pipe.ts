import { Pipe, PipeTransform } from '@angular/core';



@Pipe({ name: 'summarize' })
export class SummarizePipe implements PipeTransform {
    transform(value: string): string {

        return value.length > 100 ? `${value.substr(0, 100)}...` : value;

    }
}

