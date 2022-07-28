import { Component, OnInit, ViewChild } from "@angular/core";
import { ApplicationService } from "../shared/services/application.service";

@Component({
  selector: "my-apps-page",
  templateUrl: "./my-apps-page.component.html",
  styleUrls: ["./my-apps-page.component.css"],
})
export class MyAppsComponent implements OnInit {
  applications = [];
  loading = false;

  constructor(private applicationService: ApplicationService) {
  }

  refresh() {
    this.fetch()
  }

  fetch() {
    this.applicationService.fetch().subscribe(
      (result) => {
        console.log(result);
        let i = 0
        for (let item of result) { 
          result[i].formattedDate = item.date.toLocaleString().
          replace(/T/, ' ').   
          replace(/\..+/, '')
          i++
        }
        this.applications = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngAfterViewInit() {
  }


  ngOnInit() {
    this.fetch()
  }

  displayedColumns: string[] = [ "name", "image", "_id", "replicas", "version", "user", "date", "url", "status"];


}
