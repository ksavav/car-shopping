import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductParams } from '../../models/productParams';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  public productService = inject(ProductService)
  private route = inject(ActivatedRoute)
  categorySelected = this.productService.selectedCategory()
  categories: string[] = [
    "Wtryskiwacze",
    "Tarcze Hamulcowe",
    "Klocki Hamulcowe",
    "Klocki Hamulcowe Ciężarowe",
    "Pompy Wody",
    "Chłodnice",
    "Filtry",
    "Amortyzatory"
  ]
  displayedProducts: Product[] = []
  constructor() { }

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category')
    if (category) {
      this.getSome(category)
    } else {
      this.getSome()
    }
  }

  getSome(category: string = "") {
    var query = new ProductParams
    if (this.productService.selectedCategory() && category === "") {
      query.category = this.productService.selectedCategory()
    }
    else if (category) {
      this.productService.selectedCategory.set(category)
      query.category = this.productService.selectedCategory()
    }
    else {
      query.category = ""
    }
    query.minPrice = 30
    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.displayedProducts = data["result"]
        // console.log(this.displayedProducts)
      }
    })
  }
}
