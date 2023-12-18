import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatIconModule } from '@angular/material/icon';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    MatTabsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    NgxSpinnerModule.forRoot({
      type: 'ball-clip-rotate'
    }),
  ],
  exports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule,
    MatTabsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule
  ]
})
export class SharedModule { }