import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  description = '';
  supabase: SupabaseClient;

  list: any[] = [];

  constructor() {
    this.supabase = createClient(
      'https://waarddwghejcgrfbpawo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzU4MTE1OSwiZXhwIjoxOTI5MTU3MTU5fQ.wusRA10CQESMdvRPDHTtvI-JVJDVT0fgK8JZUfiuRjE'
    );
  }

  get table() {
    return this.supabase.from('Tasks');
  }

  ngOnInit() {
    this.getAll();
    this.takeSubscription();
  }

  takeSubscription() {
    this.table
      .on('INSERT', (p) => {
        console.log(p);
        this.list.push(p.new);
      })
      .subscribe();
  }

  async getAll() {
    const { data, error } = await this.table.select();

    if (data) {
      this.list = data;
    }
  }

  async addTodo() {
    const info = {
      id: uuidv4(),
      description: this.description,
    };

    this.description = '';
    const { data, error } = await this.table.insert([info]);
  }

  async remove(id: string) {
    const { data, error } = await this.table.delete().match({ id: id });

    this.list = this.list.filter((p) => p.id !== id);
  }
}
