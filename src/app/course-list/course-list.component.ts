import {Component, Inject, OnInit} from '@angular/core';
import {crsInstructor, crsMeeting, lecSession} from "../timetable/courseInterfaces";
import {MatTableModule} from '@angular/material/table';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {utilities} from "../timetable/utilities";

// import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";


@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  meetingsArray: lecSession[][] = [];
  meetingsArrayType: string[] = [];
  // sampleMeetings: lecSession[] = [];

  // objective: display a table based on the sample
  // meetings list.

  constructor(
    private dialogRef: MatDialogRef<CourseListComponent>,
    @Inject(MAT_DIALOG_DATA) data: { fallMeetings: lecSession[], winterMeetings: lecSession[], yearMeetings: lecSession[] }
  ) {
    console.log(data);
    this.meetingsArray = [];


    // data.fallMeetings = data.fallMeetings.filter((meeting) => meeting.cancel !== 'Cancelled');
    // data.winterMeetings = data.winterMeetings.filter((meeting) => meeting.cancel !== 'Cancelled');
    // data.yearMeetings = data.yearMeetings.filter((meeting) => meeting.cancel !== 'Cancelled');


    // this.sampleMeetings = data.yearMeetings;
    if (data.fallMeetings !== undefined) {
      this.meetingsArray.push(data.fallMeetings);
      this.meetingsArrayType.push('fall');
    }
    if (data.winterMeetings !== undefined) {
      this.meetingsArray.push(data.winterMeetings);
      this.meetingsArrayType.push('winter');
    }
    if (data.yearMeetings !== undefined) {
      this.meetingsArray.push(data.yearMeetings);
      this.meetingsArrayType.push('year');
    }
    console.log("the meetings array is", this.meetingsArray);
    console.log(this.meetingsArrayType);
  }

  ngOnInit(): void {

  }

  /**
   * Return the sync icon.
   * @param mode SYNC, INPER, and so on.
   */
  getSyncIcon(mode: string): string {
    const inper = 'group';
    const sync = 'wifi';
    const syncif = 'wifi group';
    const async = 'wifi_off';
    const asyncif = 'wifi_off group';


    switch(mode){
      case 'INPER':
        return inper;
      case 'CLASS':
        return inper;
      case 'SYNIF':
        return syncif;
      case 'SYNC':
        return sync;
      case 'ONLSYNC':
        return sync;
      case 'ASYNC':
        return async;
      case 'ONLASYNC':
        return async;
      case 'ASYIF':
        return asyncif;
      default:
        return 'question_mark';

    }

  }




  getDayColor(day: string): string[] {
    let tempColor: string;
    let bgColor: string;
    // why didn't I just use an object for this? that could've been way faster
    switch (day) {
      case 'MO':
        bgColor = utilities.dayColorText[0];
        tempColor = utilities.dayColors[0];
        break;
      case 'TU':
        bgColor = utilities.dayColorText[1];
        tempColor = utilities.dayColors[1];
        break;
      case 'WE':
        bgColor = utilities.dayColorText[2];
        tempColor = utilities.dayColors[2];
        break;
      case 'TH':
        bgColor = utilities.dayColorText[3];
        tempColor = utilities.dayColors[3];
        break;
      case 'FR':
        bgColor = utilities.dayColorText[4];
        tempColor = utilities.dayColors[4];
        break;
      case 'SA':
        bgColor = utilities.dayColorText[5];
        tempColor = utilities.dayColors[5];
        break;
      case 'SU':
        bgColor = utilities.dayColorText[6];
        tempColor = utilities.dayColors[6];
        break;
      default:
        bgColor = utilities.dayColorText[0];
        tempColor = utilities.dayColors[0];
    }
    return [bgColor, tempColor];


  }

  getSessionColor(keyword: string): string[]{
    let temp: string;
    let textColor: string;
    switch(keyword){
      case 'fall':   textColor = 'black'; temp = utilities.tableSessionColors[0]; break;
      case 'winter': textColor = 'black'; temp = utilities.tableSessionColors[1]; break;
      case 'year':   textColor = 'white'; temp = utilities.tableSessionColors[2]; break;
      default: textColor = 'black'; temp = 'white';
    }
    return [temp, textColor];
  }

  // getMeetingTimes(crsSession: lecSession): any[] {
  //
  // }
  displayedColumns: string[] = ['lectureCode', 'instructor', 'time', 'deliveryMode'];

  obtainInstructors(insts: crsInstructor[]): string {
    const insNameList: string[] = [];
    insts.forEach((ins) => {
      insNameList.push(ins.firstName + ". " + ins.lastName);
    })

    const toReturn = insNameList.join(", ");
    if (toReturn === "")
      return "";
    else return toReturn;
  }

  obtainSchedule(sch: crsMeeting[]): string {
    const schList: string[] = [];
    sch.forEach((sc) => {
      schList.push(
        safeString(sc.meetingDay) + ' ' +
        safeString(sc.meetingStartTime) + '-' +
        safeString(sc.meetingEndTime) + ' ' +
        safeString(sc.assignedRoom1)
      )
    })
    return schList.join('\n');
  }

  trimTimes(curTime: string): string {
    if (curTime === null || curTime == undefined)
      return 'NA';

    if (curTime.includes(':')) {
      const splitted = curTime.split(':');
      let timeStr = splitted[0];
      if (splitted[1] !== '00') {
        timeStr = timeStr + ':' + splitted[1]
      }
      return timeStr;
    } else return 'NA';
  }


}


function safeString(theString: string | undefined | null): string {
  if (theString === undefined || theString === null) {
    return "-";
  } else {
    return theString;
  }
}


/**
 * Return obj = [K, V] as a list of V, with V.key = K.
 * @param obj The object to be passed in.
 */
export function cItems(obj: Object): any[] {
  const arr = [];
  for (let [k, v] of Object.entries(obj)) {
    v.key = k;
    arr.push(v);
  }
  return arr;
}
