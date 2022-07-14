import { Component, OnInit } from "@angular/core";
import { ApplicationService } from "../shared/services/application.service";

@Component({
  selector: "my-apps-page",
  templateUrl: "./my-apps-page.component.html",
  styleUrls: ["./my-apps-page.component.css"],
})
export class MyAppsComponent implements OnInit {
  applications = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit() {
    this.applicationService.fetch().subscribe(
      (result) => {
        console.log(result);
        this.applications = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  displayedColumns: string[] = [ "name", "_id", "replicas", "version", "user", "date", "url", "status"];


}
