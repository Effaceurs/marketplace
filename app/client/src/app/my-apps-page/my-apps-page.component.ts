import { Component, OnInit, Inject } from "@angular/core";
import { ApplicationService } from "../shared/services/application.service";
import { Application } from "../shared/interfaces";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MaterialService } from "../shared/classes/material.service"


@Component({
  selector: "my-apps-page",
  templateUrl: "./my-apps-page.component.html",
  styleUrls: ["./my-apps-page.component.css"],
})
export class MyAppsComponent implements OnInit {
  applications: Application[] = [];
  loading = false;
  clickedRows = new Set<Application>();

  constructor(private applicationService: ApplicationService,
    public dialog: MatDialog) {
  }

  addRow(row){
    if (!this.clickedRows.has(row)){
      if(row.status === 'deleted' || row.status === 'deleting' || row.status === 'pending' || row.status === 'failed'){}
      else {
      this.clickedRows.add(row)
      }
    }
    else {
      this.clickedRows.delete(row)
    }
  }

  refresh() {
    this.clickedRows.clear()
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

  delete() {
    const dialogRef = this.dialog.open(MyAppsDelete, {
      width: '500px',
      data: this.clickedRows
    });
    dialogRef.afterClosed().subscribe(result => {
      this.clickedRows.clear()
    });
  }

  ngAfterViewInit() {
  }


  ngOnInit() {
    this.fetch()
  }

  displayedColumns: string[] = ["name", "image", "_id", "replicas", "version", "user", "date", "url", "status"];

}



@Component({
  selector: 'my-apps-delete',
  templateUrl: 'my-apps-delete.component.html',
})
export class MyAppsDelete {

  confirmation: String = ''
  object: Application[] = [];

  constructor(
    public dialogRef: MatDialogRef<MyAppsDelete>,
    private applicationService: ApplicationService,
    @Inject(MAT_DIALOG_DATA) public data: Set<Application>,
  ) {}

  ngOnInit() {
    this.object = Array.from(this.data.values())
  }

  onClickDelete(){
    this.dialogRef.close()

    for (let item of this.object){
      item.status = 'deleting'
      item.url = ''
      this.applicationService.delete(item._id, item).subscribe(response => {
        MaterialService.toast(`Deletion of item with ID: ${item._id} has started`)
        console.log(response)
      }, err => {
        console.log(err)
        MaterialService.toast(`Something went wrong`)
      })
    }
  }

  onClickCancel() {
    this.dialogRef.close()
  }





}