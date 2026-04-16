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
  newTaskTitle = '';

  toggleTask(task: Message) {
  task.read = !task.read;
}

  getFilteredMessages(): Message[] {
    if (!this.filterCategoryId) {
      return this.data.getMessages();
    }

    return this.data.getMessages().filter(
      msg => msg.categoryId === this.filterCategoryId
    );
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Message = {
      id: Date.now(),
      fromName: 'Usuario',
      subject: this.newTaskTitle,
      date: new Date().toLocaleTimeString(),
      read: false,
      categoryId: this.selectedCategoryId || undefined
    };

    this.data.messages.unshift(newTask);

    this.newTaskTitle = '';
  }

  async ngOnInit() {
    await this.loadCategories();
    await this.loadFeatureFlags();

  }

  deleteTask(task: Message) {
  this.data.messages = this.data.messages.filter(m => m.id !== task.id);
}

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

async loadFeatureFlags() {
  try {
    // 🔥 fuerza fetch sin cache
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 0,
      fetchTimeoutMillis: 10000
    };

    await fetchAndActivate(this.remoteConfig);

    const value = getValue(this.remoteConfig, 'enable_categories').asString();

    console.log('VALOR CRUDO:', value);

    this.showCategories = value === 'true';

    console.log('FEATURE FLAG FINAL:', this.showCategories);

  } catch (error) {
    console.error('ERROR REMOTE CONFIG:', error);
  }
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

  getPendingCount(): number {
    return this.data.getMessages().filter(msg => !msg.read).length;
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }
}