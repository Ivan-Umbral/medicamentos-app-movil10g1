import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(fecha: string, hora: string): string {
    if (fecha && hora) {
      const fechaSplit = fecha.split('-');
      const horaSplit = hora.split(':');
      const fechaDate = {
        year: parseInt(fechaSplit[0], 10),
        month: parseInt(fechaSplit[1], 10),
        day: parseInt(fechaSplit[2], 10)
      };
      const horaDate = {
        hour: parseInt(horaSplit[0], 10),
        minute: parseInt(horaSplit[1], 10),
        second: parseInt(horaSplit[2], 10)
      };
      const today = new Date();
      const orderDate = new Date(fechaDate.year, (fechaDate.month - 1), fechaDate.day, horaDate.hour, horaDate.minute, horaDate.second);
      return formatDistance(orderDate, today, { addSuffix: true });
    }
    return '';
  }

}
