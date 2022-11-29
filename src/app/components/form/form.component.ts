import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  mainForm = this.fb.group({
/*     
    displayTitle: ['Solicitud de Informe Sanitario', Validators.required],
    displaySubtitle: ['Nuevas instalaciones de abastecimiento', Validators.required],
    displayText: ['De acuerdo a la normativa vigente sobre LOPD, Ud. acepta que sus datos personales sean gestionados por nuestra organizacion para mejorar la calidad del servicio. Estos datos no seran facilitados a organizaciones fuera de nuestro grupo corporativo sin su aceptacion expresa.', Validators.required],
    displayName: ['Juan Luis Rodriguez Blasco', Validators.required],
    displayLegal: ['Confirmo que los datos consignados en este formulario son ciertos y que tengo la debida autorización para la firma de esta solicitud. Acepto y firmo:', Validators.required] 
*/

    displayTitle: ['', Validators.required],
    displaySubtitle: ['', Validators.required],
    displayText: ['', Validators.required],
    displayName: ['', Validators.required],
    displayLegal: ['', Validators.required]
  })
  
  constructor(
    private fb: FormBuilder,
    private readonly router: Router,
  ) { }


  ngOnInit(): void {
    
  }

  onSubmit(){
    const setDataForm = this.mainForm.value;
    localStorage.setItem('dataForm', JSON.stringify(setDataForm));
    this.router.navigate(['/', 'result-form']);
  }
}
