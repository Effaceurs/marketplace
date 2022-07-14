import { Component, OnInit , Inject} from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";
import { CatalogueService } from "../shared/services/catalogue.service";
import { MaterialService } from "../shared/classes/material.service"
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Catalogue} from '../shared/interfaces'



@Component({
  selector: 'app-catalogue-page',
  templateUrl: './catalogue-page.component.html',
  styleUrls: ['./catalogue-page.component.css']
})
export class CataloguesPageComponent implements OnInit {
  disabled = false
  name: string;
  version: string;
  provider: string[];
  catalogues = []
  
  constructor(private CatalogueService: CatalogueService,
    private applicationService: ApplicationService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.CatalogueService.fetch().subscribe(response => {
      this.catalogues = response
    }, err => {
      console.log(err)
    })
  }

  deploy(catalogue){
    if (this.disabled === true) {
      return
    }
    console.log(catalogue)
    this.disabled=true
    const answer = this.applicationService.add(catalogue).subscribe(response => {

      MaterialService.toast(`Requested item has been added to the DB`)

      this.applicationService.deploy(response).subscribe(ans => {

        MaterialService.toast(`Deployment has been started`)

      }, err => {
        this.disabled=false
        console.log(err)
        MaterialService.toast(`Something went wrong`)
      })
    }, err => {
      this.disabled=false
      console.log(err)
      MaterialService.toast(`Something went wrong`)    })
      this.disabled=false
  }

  addNewCatalogueItem() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: this.name, version: this.version, provider: this.provider}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.CatalogueService.fetch().subscribe(response => {
        this.catalogues = response
      }, err => {
        console.log(err)
      })
    });
  }
}

@Component({
  selector: 'catalogue-new-page',
  templateUrl: 'catalogue-new-page.component.html',
})

export class DialogOverviewExampleDialog {
  provider: string[] = ['k8s','aws','gcp']
  constructor(
    private CatalogueService: CatalogueService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Catalogue,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    console.log(this.data)
    this.CatalogueService.add(this.data).subscribe(response => {
      console.log(response)
    }, err => {
      console.log(err)
    })
    this.dialogRef.close()
  }
}