import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductParams } from '../../models/productParams';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  categorySelected: string | undefined
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
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getSome()
  }

  getSome(category: string = "") {
    var query = new ProductParams
    if (category) {
      this.categorySelected = category
    }
    query.category = category
    query.minPrice = 30
    this.productService.getProducts(query).subscribe({
      next: (data: any) => {
        this.displayedProducts = data["result"]
        console.log(this.displayedProducts)
      }
    })
  }
}
