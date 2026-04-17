import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import { CategoryService } from '../services/category.service';

import { RemoteConfig, getValue, fetchAndActivate } from '@angular/fire/remote-config';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {

  private data = inject(DataService);
  private categoryService = inject(CategoryService);
  private remoteConfig = inject(RemoteConfig);

  private configPolling$?: Subscription;

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
    this.startConfigPolling();
  }

  ngOnDestroy() {
    this.configPolling$?.unsubscribe();
  }

  private startConfigPolling() {
    this.configPolling$ = interval(30_000)
      .pipe(
        switchMap(() => this.loadFeatureFlags())
      )
      .subscribe();
  }

  deleteTask(task: Message) {
    this.data.messages = this.data.messages.filter(m => m.id !== task.id);
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async loadFeatureFlags(): Promise<void> {
    try {
      this.remoteConfig.settings = {
        minimumFetchIntervalMillis: 0,
        fetchTimeoutMillis: 10000
      };

      await fetchAndActivate(this.remoteConfig);

      const value = getValue(this.remoteConfig, 'enable_categories').asString();
      const newValue = value === 'true';

      if (this.showCategories !== newValue) {
        console.log(`Feature flag cambió: ${this.showCategories} → ${newValue}`);
        this.showCategories = newValue;
      }

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