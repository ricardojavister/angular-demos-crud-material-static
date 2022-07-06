import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Product } from 'src/app/model/product';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'image',
    'edit',
    'delete',
  ];
  dataSorted!: Product[];
  dataSource!: MatTableDataSource<Product>;
  directionLast: String = 'asc';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    private notificationService: NotificationService,
    private _router: Router
  ) {
    //populate
    this.productService.myProducts$.subscribe((data) => {
      this.dataSorted = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.myProducts$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  sortData(sort: Sort) {
    const data = this.dataSorted.slice();
    sort.direction = this.directionLast === 'asc' ? 'desc' : 'asc';
    this.dataSorted = data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch (sort.active) {
        case 'name':
          [propertyA, propertyB] = [a.name, b.name];
          break;
        case 'description':
          [propertyA, propertyB] = [a.description, b.description];
          break;
        case 'price':
          [propertyA, propertyB] = [a.price, b.price];
          break;
        case 'image':
          [propertyA, propertyB] = [a.image, b.image];
          break;
        default:
          return 0;
      }
      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
    this.directionLast = sort.direction;
    this.dataSource = new MatTableDataSource<Product>(this.dataSorted);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProductCreateComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  edit(factura: any) {
    const dialogRef = this.dialog.open(ProductCreateComponent, {
      width: '450px',
      data: factura,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.loadData();
    });
  }

  delete(product: Product) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmacion',
        message: 'Are you sure to delete this product ?',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.productService.delete(product);
        this.notificationService.openSnackBar('Product removed!');
        this.loadData();
      }
    });
  }
}
