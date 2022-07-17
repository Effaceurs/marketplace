import { Component, OnInit, Input , Inject} from '@angular/core';
import { ApplicationService } from "../shared/services/application.service";
import { CatalogueService } from "../shared/services/catalogue.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Application, Catalogue} from '../shared/interfaces'
import { MaterialService } from "../shared/classes/material.service"
import { TouchSequence } from "selenium-webdriver";
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-catalogue-page',
  templateUrl: './catalogue-page.component.html',
  styleUrls: ['./catalogue-page.component.css']
})
export class CataloguesPageComponent implements OnInit {
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
    const dialogRef = this.dialog.open(CatalogueNewDeploy, {
      width: '500px',
      data: catalogue
    });
  }

  addNewCatalogueItem() {
    const dialogRef = this.dialog.open(CatalogueNewItem, {
      width: '250px',
      data: {}
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
  selector: 'catalogue-new-deploy',
  templateUrl: 'catalogue-new-deploy.component.html',
})
export class CatalogueNewDeploy implements OnInit  {


  replicas: number;
  image: string;
  provider: string;
  version: string;
  name: string;
  versionFormControl = new FormControl('', [Validators.required]);
  replicaFormControl = new FormControl('', [Validators.required]);
  nameFormControl = new FormControl('', [Validators.required]);


  constructor(
    private CatalogueService: CatalogueService,
    public dialogRef: MatDialogRef<CatalogueNewDeploy>,
    private applicationService: ApplicationService,
    @Inject(MAT_DIALOG_DATA) public data: Catalogue,
  ) {}

  onClickDeploy(): void {
    this.data.name = this.name.toLowerCase().replaceAll(' ','')
    this.data.version = this.version.toLowerCase()
    this.data.replicas = this.replicas
    console.log(this.data)

    const answer = this.applicationService.add(this.data).subscribe(response => {

      MaterialService.toast(`Requested item has been added to the DB`)
      this.applicationService.deploy(response).subscribe(ans => {

        MaterialService.toast(`Deployment has been started`)
        this.dialogRef.close()
      }, err => {
        console.log(err)
        MaterialService.toast(`Something went wrong`)
        this.dialogRef.close()
      })
    }, err => {
      console.log(err)
      MaterialService.toast(`Something went wrong`)    })
      this.dialogRef.close()
      }

  onClickCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.image = this.data.image
    this.provider = this.data.provider
}
}


@Component({
  selector: 'catalogue-new-page',
  templateUrl: 'catalogue-new-page.component.html',
})
export class CatalogueNewItem {

  provider: string[] = ['k8s','aws','gcp']
  constructor(
    private CatalogueService: CatalogueService,
    public dialogRef: MatDialogRef<CatalogueNewItem>,
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