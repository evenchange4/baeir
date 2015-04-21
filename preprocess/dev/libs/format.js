/**
* Date to seconds
*
* @input  {object}  { hours: 13, minutes: 23, seconds: 21 }
* @output {int}      48201 secs
*
* @author Michael Hsu
*/

export function toSec(date) {
  let hours = date.hours || 0;
  let minutes = date.minutes || 0;
  let seconds = date.seconds || 0;
  
  return ( hours * 60 + minutes ) * 60 + seconds;
}