import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupabaseService]
    });
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a Supabase client in the constructor', () => {
    expect(service['supabase']).toBeTruthy();
    expect(service['supabase'] instanceof SupabaseClient).toBeTruthy();
  });

  it('should use the correct Supabase URL', () => {
    const expectedUrl = 'https://bexfekwgojnzkyeeaxkf.supabase.co/';
    expect((service['supabase'] as any).supabaseUrl).toBe(expectedUrl);
  });

  it('should use the correct Supabase key', () => {
    const expectedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJleGZla3dnb2puemt5ZWVheGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU4NzI1NzQsImV4cCI6MjA0MTQ0ODU3NH0.OOLyiykZLUn8qKWcfW7kvpGOov1T5FG96uPxgjlo-Fw';
    expect((service['supabase'] as any).supabaseKey).toBe(expectedKey);
  });

  it('should return the Supabase client when getClient is called', () => {
    const client = service.getClient();
    expect(client).toBeTruthy();
    expect(client instanceof SupabaseClient).toBeTruthy();
    expect(client).toBe(service['supabase']);
  });
});
