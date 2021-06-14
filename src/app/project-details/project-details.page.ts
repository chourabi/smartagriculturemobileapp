import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {

  project = null;
  employees = [];

  equipments = [];
  transactions = [];


  affectEmployeeForm = new FormGroup({
    employee_id: new FormControl('', Validators.required)
  })

  affectEquipmentForm = new FormGroup({
    equipment_id: new FormControl('', Validators.required)
  })

  newIntervention = new FormGroup({
    operation: new FormControl('', Validators.required)

  })


  IrrigationForm = new FormGroup({

    date: new FormControl('', Validators.required),
    apport_en_eau: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required), // Type:Manuelle/automatique
    pompage: new FormControl('', Validators.required), // pompage: Vanne/ Moteur , 
    capacity: new FormControl('', Validators.required),


  })

  maintenanceForm = new FormGroup({

    date: new FormControl('', Validators.required),
    nom_traitement_chimique: new FormControl('', Validators.required),
    dose_obligatoire: new FormControl('', Validators.required),
    climat: new FormControl('', Validators.required),

  })


  recoltForm = new FormGroup({

    date: new FormControl('', Validators.required),
    pic_de_puissance: new FormControl('', Validators.required),
    agreage_de_fruits: new FormControl('', Validators.required),
    nombre_de_caisse: new FormControl('', Validators.required),
    poids: new FormControl('', Validators.required),
    numero_de_vehicule: new FormControl('', Validators.required)


  })



  stockForm = new FormGroup({

    date: new FormControl('', Validators.required),
    nom_de_fournisseur: new FormControl('', Validators.required),
    num_de_fournisseur: new FormControl('', Validators.required),
    product_name: new FormControl('', Validators.required),
    dose_normal: new FormControl('', Validators.required),
    prix: new FormControl('', Validators.required)


  })



  constructor(private route: ActivatedRoute, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getProjectDeatils();
    this.getEmployees();
    this.getEquipments();
  }

  getEquipments() {
    this.equipments = [];
    this.db.collection('equipments').get().subscribe((data) => {
      data.docs.forEach(doc => {
        this.equipments.push(
          {
            equipment: doc.data(),
            id: doc.id
          }
        );
      });

    })
  }





  getEmployees() {
    this.employees = [];
    this.db.collection('employees').get().subscribe((data) => {
      data.docs.forEach(doc => {
        this.employees.push(
          {
            employee: doc.data(),
            id: doc.id
          }
        );
      });

    })
  }
  getProjectDeatils() {
    const id = this.route.snapshot.params.id;
    this.db.collection('projects').doc(id).get().subscribe((data) => {
      this.project = data.data();

      this.gettransactions();
    })

  }


  addNewEmployee() {
    const id = this.route.snapshot.params.id;
    const idEmployee = this.affectEmployeeForm.value.employee_id;


    var employeesIDs = this.project.employeesIDs != null ? this.project.employeesIDs : [];
    if (employeesIDs.indexOf(idEmployee) == -1) {
      employeesIDs.push(idEmployee);
    }

    this.db.collection('projects').doc(id).update({ "employeesIDs": employeesIDs }).then((res) => this.getProjectDeatils())


    var employeeToAdd;

    for (let i = 0; i < this.employees.length; i++) {
      const employee = this.employees[i];

      if (employee.id == idEmployee) {
        employeeToAdd = employee;
      }

    }

    if (this.project.employees != null) {
      var oldList = this.project.employees;

      var alredayExist = false;
      for (let i = 0; i < oldList.length; i++) {
        const odlEmployee = oldList[i];
        if (odlEmployee.id == employeeToAdd.id) {
          alredayExist = true;
        }
      }

      if (alredayExist == false) {
        oldList.push(employeeToAdd);

        this.db.collection('projects').doc(id).update({ "employees": oldList }).then((res) => this.getProjectDeatils())
      }
    } else {
      var newList = [employeeToAdd];
      this.db.collection('projects').doc(id).update({ "employees": newList }).then((res) => this.getProjectDeatils())
    }
  }

  addNewEquipment(){
    const id = this.route.snapshot.params.id;
    const idEquipment= this.affectEquipmentForm.value.equipment_id;


    var equipmentsIDs = this.project.equipmentsIDs != null ? this.project.equipmentsIDs : [];
    if (equipmentsIDs.indexOf(idEquipment) == -1) {
      equipmentsIDs.push(idEquipment);
    }

    console.log(equipmentsIDs);
    

    this.db.collection('projects').doc(id).update({ "equipmentsIDs": equipmentsIDs }).then((res) => this.getProjectDeatils())


    var equipmentToAdd;

    for (let i = 0; i < this.equipments.length; i++) {
      const equipment = this.equipments[i];

      if (equipment.id == idEquipment) {
        equipmentToAdd = equipment;
      }

    }

    if (this.project.equipments != null) {
      var oldList = this.project.equipments;

      var alredayExist = false;
      for (let i = 0; i < oldList.length; i++) {
        const odlEmployee = oldList[i];
        if (odlEmployee.id == equipmentToAdd.id) {
          alredayExist = true;
        }
      }

      if (alredayExist == false) {
        oldList.push(equipmentToAdd);

        this.db.collection('projects').doc(id).update({ "equipments": oldList }).then((res) => this.getProjectDeatils())
      }
    } else {
      var newList = [equipmentToAdd];
      this.db.collection('projects').doc(id).update({ "equipments": newList }).then((res) => this.getProjectDeatils())
    }
  }

  deleteEquipment(id){
    const idProject = this.route.snapshot.params.id;
    if (confirm('Voulez-vous vraiment supprimer cet engin de ce projet?')) {
      var oldList = this.project.equipments;

      for (let i = 0; i < oldList.length; i++) {
        const old = oldList[i];
        if (old.id == id) {
          oldList.splice(i, 1);

          console.log(oldList);


          this.db.collection('projects').doc(idProject).update({ "equipments": oldList }).then((res) => this.getProjectDeatils())


        }
      }
    }
  }
  deleteEmployee(id) {
    const idProject = this.route.snapshot.params.id;
    if (confirm('Voulez-vous vraiment supprimer cet employé de ce projet?')) {
      var oldList = this.project.employees;

      for (let i = 0; i < oldList.length; i++) {
        const odlEmployee = oldList[i];
        if (odlEmployee.id == id) {
          oldList.splice(i, 1);

          console.log(oldList);


          this.db.collection('projects').doc(idProject).update({ "employees": oldList }).then((res) => this.getProjectDeatils())


        }
      }
    }
  }




  addNewIntervention() {
    const idProject = this.route.snapshot.params.id;

    let idata = null;

    switch (this.newIntervention.value.operation) {
      case 'Irragation':
        idata = this.IrrigationForm.value;
        break;
      case 'Maintenance':
        idata = this.maintenanceForm.value;
        break;
      case 'Récolte':
        idata = this.recoltForm.value;
        break;
      case 'Stock':
        idata = this.stockForm.value;
        break;
        
    }

    const intervention = {
      name: this.newIntervention.value.operation,
      data: idata
    };
    const oldList = this.project.interventions != null ? this.project.interventions : [];

    oldList.push(intervention);

    this.db.collection('projects').doc(idProject).update({'interventions':oldList}).then(()=>{
      this.getProjectDeatils();
    })


    
  }



  
  async gettransactions(){
    console.log(this.project);
    this.transactions = [];
    this.db.collection('transactions', ref=>ref.where('project_name','==',this.project.title)).get().subscribe((data)=>{
      data.docs.forEach(async (doc) => {
         this.transactions.push(doc.data())
      })
    })
  }
}
