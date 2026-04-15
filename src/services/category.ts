import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private firestore: Firestore) {}

  private categoryRef = collection(this.firestore, 'categories');

  async getCategories(): Promise<Category[]> {
    const snapshot = await getDocs(this.categoryRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    }));
  }

  async addCategory(name: string) {
    return await addDoc(this.categoryRef, {
      name,
      createdAt: Date.now()
    });
  }

  async deleteCategory(id: string) {
    const ref = doc(this.firestore, `categories/${id}`);
    return await deleteDoc(ref);
  }

  async updateCategory(id: string, name: string) {
    const ref = doc(this.firestore, `categories/${id}`);
    return await updateDoc(ref, { name });
  }
}