import { Component, inject, OnInit } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import { CategoryService } from '../services/category.service';

import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  private data = inject(DataService);
  private categoryService = inject(CategoryService);

  private remoteConfig = inject(RemoteConfig);

 selectedCategoryId = '';
  filterCategoryId = '';
  categories: any[] = [];
  newCategory = '';
  showCategories = true;

  getFilteredMessages(): Message[] {
  if (!this.filterCategoryId) {
    return this.data.getMessages();
  }

  return this.data.getMessages().filter(
    msg => msg.categoryId === this.filterCategoryId
  );
}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadFeatureFlags();

  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async loadFeatureFlags() {
  await fetchAndActivate(this.remoteConfig);

  const value = getValue(this.remoteConfig, 'enable_categories').asString();

  this.showCategories = value === 'true';

  console.log('FEATURE FLAG:', this.showCategories);
}

  async addCategory() {
    if (!this.newCategory.trim()) return;

    await this.categoryService.addCategory(this.newCategory);
    this.newCategory = '';
    await this.loadCategories();
  }

  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }
}