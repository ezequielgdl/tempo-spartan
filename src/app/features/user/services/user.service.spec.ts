import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserInfo } from '../interface';
import { SupabaseClient } from '@supabase/supabase-js';

describe('UserService', () => {
  let service: UserService;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;
  let mockSupabaseClient: any;

  const mockUser: UserInfo = {
    id: '1',
    name: 'John Doe',
    address: '123 Main St',
    phone: '555-1234',
    website: 'www.johndoe.com',
    nif: '123456789',
    iban: 'ES1234567890123456789012'
  };

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getUser: jasmine.createSpy('getUser')
      },
      from: jasmine.createSpy('from').and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            single: jasmine.createSpy('single')
          })
        })
      })
    };

    mockSupabaseService = jasmine.createSpyObj('SupabaseService', ['getClient']);
    mockSupabaseService.getClient.and.returnValue(mockSupabaseClient);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: SupabaseService, useValue: mockSupabaseService }
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchUser', () => {
    it('should fetch user successfully', (done) => {
      const mockAuthUser = { id: '1' };
      mockSupabaseClient.auth.getUser.and.returnValue(Promise.resolve({ data: { user: mockAuthUser } }));
      mockSupabaseClient.from().select().eq().single.and.returnValue(Promise.resolve({ data: mockUser, error: null }));

      (service as any).fetchUser().subscribe((user: UserInfo | null) => {
        expect(user).toEqual(mockUser);
        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
        expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
        done();
      });
    });

    it('should return null when no auth user is found', (done) => {
      mockSupabaseClient.auth.getUser.and.returnValue(Promise.resolve({ data: { user: null } }));

      (service as any).fetchUser().subscribe((user: UserInfo | null) => {
        expect(user).toBeNull();
        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
        done();
      });
    });

    it('should handle errors and return null', (done) => {
      mockSupabaseClient.auth.getUser.and.returnValue(Promise.reject('Error'));

      (service as any).fetchUser().subscribe((user: UserInfo | null) => {
        expect(user).toBeNull();
        expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled();
        done();
      });
    });
  });
});
