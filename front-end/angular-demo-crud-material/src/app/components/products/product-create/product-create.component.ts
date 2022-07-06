import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { Product } from '../../../model/product';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
})
export class ProductCreateComponent implements OnInit {
  message = '';
  public productForm: any;
  errorMessage: any;
  readonly maxSize = 104857600;
  status: boolean = false;
  title: string = '';
  @Input() id?: number;

  constructor(
    public dialogRef: MatDialogRef<ProductCreateComponent>,
    private productService: ProductService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}

  ngOnInit() {
    this.productForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
    });
    this.loadData();
  }

  loadData() {
    if (this.data) {
      //Edit mode
      this.title = 'Edit Product';
      this.productForm.patchValue(this.data);
    } else {
      //New Mode
      this.title = 'Add Product';
    }
  }

  onFormSubmit() {
    if (this.productForm.valid) {
      let data = this.getData();
      if (this.data) {
        this.update(data);
      } else {
        this.create(data);
      }
    }
  }

  create(product: Product) {
    this.productService.add(product);
    this.notificationService.openSnackBar('Product added');
    this.productForm.reset();
    this.close();
  }

  update(product: Product) {
    this.productService.update(product);
    this.notificationService.openSnackBar('Product updated');
    this.productForm.reset();
    this.close();
  }

  getData(): Product {
    let data: Product = {
      id: this.productForm.get('id').value,
      name: this.productForm.get('name').value,
      description: this.productForm.get('description').value,
      price: this.productForm.get('price').value,
      image: this.productForm.get('image').value,
    };
    return data;
  }

  close() {
    this.productForm.reset();
    this.dialogRef.close();
  }
}
