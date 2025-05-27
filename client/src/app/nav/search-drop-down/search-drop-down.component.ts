import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product';

@Component({
  selector: 'app-search-drop-down',
  standalone: true,
  imports: [],
  templateUrl: './search-drop-down.component.html',
  styleUrl: './search-drop-down.component.scss'
})
export class SearchDropDownComponent implements OnInit {
  @Input() searchedProducts: Product[] = []

  ngOnInit(): void {
    console.log(this.searchedProducts)
  }

  giveImage(product: Product)
  {
    if (product.photo)
    {
      return product.photo
    }
    else
    {
      return "assets/placeholder.svg"
    }
  }
}
