import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined
  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    console.log(productId)
    if (!productId) return
    this.productService.getProduct(productId).subscribe({
      next: (data: any) => {
        this.product = data
      }
    })
  }

  getPhoto(): string {
    if (!this.product) return "";
    if (this.product.photo) return this.product.photo
    else return "assets/placeholder.svg"
  }
}


