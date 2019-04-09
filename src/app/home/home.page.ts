import { Component } from '@angular/core';
import { Insomnia } from '@ionic-native/insomnia/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  percent: number = 0;
  radius: number = 100;
  fullTime: any = '00:01:30';
  timer: any = false;
  progress: any = 0;
  minutes: number = 1;
  seconds: number = 30;
  firstSecond: boolean = true;

  elapsed: any = {
    h: "00",
    m: "00",
    s: "00"
  };

  overAllTimer: any = false;

  constructor(private insomnia: Insomnia) {}

  updateTime()
  {
    let timeSplit = this.fullTime.split(":");
    this.minutes = parseInt(timeSplit[1]);
    this.seconds = parseInt(timeSplit[2]);
  }

  startTime() 
  {
    let totalSeconds = Math.floor(this.minutes * 60) + this.seconds;

    if (this.timer) {
      clearInterval(this.timer);
    }

    if (!this.overAllTimer) {
      this.progressTimer();
      this.insomnia.keepAwake();
    }

    this.timer = false;
    this.updateProgress(totalSeconds);

    this.timer = setInterval( () => 
    {
      if (this.percent == this.radius) {
        clearInterval(this.timer);
      }

      this.updateProgress(totalSeconds);
    }, 1000);
  }

  progressTimer()
  {
    if (this.firstSecond) {
      this.firstSecond = false;
      this.elapsed.s = "01";
    }

    let countDownDate = new Date();
    let distance = 0;

    this.overAllTimer = setInterval( () => 
    {
      if (this.percent == 100) {
        clearInterval(this.overAllTimer);

        return;
      }

      distance = new Date().getTime() - countDownDate.getTime();

      this.elapsed.h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.elapsed.m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.elapsed.s = Math.floor((distance % (1000 * 60)) / (1000)) + 1;

      this.elapsed.h = this.pad(this.elapsed.h, 2);
      this.elapsed.m = this.pad(this.elapsed.m, 2);
      this.elapsed.s = this.pad(this.elapsed.s, 2);
    }, 1000);
  }

  updateProgress(totalSeconds) 
  {
    this.progress += 1;
    this.percent = Math.floor((this.progress / totalSeconds) * 100);
  }

  pad(number, size) 
  {
    let string = number+"";

    while (string.length < size) {
      string = "0"+string;
    }

    return string;
  }

  stopTime()
  {
    clearInterval(this.timer);
    clearInterval(this.overAllTimer);
    this.timer = false;
    this.overAllTimer = false;
    this.percent = 0;
    this.progress = 0;
    this.firstSecond = true;
    this.elapsed = {
      h: "00",
      m: "00",
      s: "00"
    };

    this.insomnia.allowSleepAgain();
  }
}
