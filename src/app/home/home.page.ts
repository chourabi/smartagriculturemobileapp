import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  
 
  projects = [];

  constructor(  private db:AngularFirestore ) {}

  ngOnInit(): void {
    this.getProjects();
  }

  refresh(ev) { 


    this.projects = [];
    this.db.collection('projects').get().subscribe((data)=>{
      data.docs.forEach(doc => {
        this.projects.push(
          {
            project:doc.data(),
            id:doc.id
          }
        );
      });

      console.log(this.projects);
      
      ev.detail.complete();
    },(err)=>{
      ev.detail.complete();
    })
  }

 


  getProjects(){
    this.projects = [];
    this.db.collection('projects').get().subscribe((data)=>{
      data.docs.forEach(doc => {
        this.projects.push(
          {
            project:doc.data(),
            id:doc.id
          }
        );
      });
      
    })
  }

}
