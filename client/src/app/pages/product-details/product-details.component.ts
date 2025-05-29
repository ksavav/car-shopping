import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined
  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.loadProduct()
  }

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    // console.log(productId)
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

  backToCatalog() {
    if (this.product) {
      this.productService.selectedCategory.set(this.product?.category)
    }
    this.router.navigateByUrl('/catalog')
  }
}


