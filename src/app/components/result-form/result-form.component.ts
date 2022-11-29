import { Component, NgZone, OnInit} from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CargarScriptsService } from '../../services/cargar-scripts.service';
import { Router } from '@angular/router';

declare const tabletDemo: any;

@Component({
  selector: 'app-result-form',
  templateUrl: './result-form.component.html',
  styleUrls: ['./result-form.component.css']
})


export class ResultFormComponent{
  displayTitle: string;
  displaySubtitle: string;
  displayText: string;
  displayLegal: string;
  displayName: string;

  constructor(
    private _CargaScripts: CargarScriptsService,
    private readonly router: Router,
    private zone: NgZone
  ){
    _CargaScripts.Carga(["generateImage"]);
    _CargaScripts.Carga(["BigInt"]);
    _CargaScripts.Carga(["demoButtons_encryption"]);
    _CargaScripts.Carga(["q"]);
    _CargaScripts.Carga(["wgssStuSdk"]);
  }

  ngOnInit(){
    //Recupera los datos del servicio y los guarda en el localStorage
    const getDataForm = JSON.parse(localStorage.getItem('dataForm'));
    this.displayTitle = getDataForm.displayText;
    this.displaySubtitle = getDataForm.displaySubtitle;
    this.displayText = getDataForm.displayText;
    this.displayLegal = getDataForm.displayLegal;
    this.displayName = getDataForm.displayName;

    
  }
  
  useTablet(){
    tabletDemo(()=>{ 
      const DATA = document.getElementById("empty");
      const doc = new jsPDF('p', 'pt', 'a4');
      const options = {
          background: "white",
          scale: 3
      };
      html2canvas(DATA, options).then((canvas) => {
          const img = canvas.toDataURL('image/PNG');

          //Add image Canvas to PDF
          const bufferX = 10;
          const bufferY = 10;
          const imgProps = (doc).getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(img, 'PNG', bufferY, bufferX, pdfWidth, pdfHeight, undefined, 'FAST');
          return doc;
      }).then((docResult) => {
          docResult.save(`${new Date().toISOString()}_form.pdf`)
      });
      localStorage.removeItem('dataForm');
      this.zone.run(()=>{
        this.router.navigate(['/']);
      })
    });
    
  }
}
