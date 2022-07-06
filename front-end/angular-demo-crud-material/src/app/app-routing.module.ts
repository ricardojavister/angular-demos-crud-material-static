import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './components/products/product-create/product-create.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';

const routes: Routes = [
  { component: ProductCreateComponent, path: 'create' },
  { component: ProductListComponent, path: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
