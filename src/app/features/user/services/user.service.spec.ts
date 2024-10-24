import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { SupabaseService } from '../../../core/auth/services/supabase.service';
import { BehaviorSubject, of } from 'rxjs';
import { UserInfo } from '../interface';

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
        }),
        insert: jasmine.createSpy('insert').and.returnValue({
          select: jasmine.createSpy('select').and.returnValue({
            single: jasmine.createSpy('single')
          })
        }),
        update: jasmine.createSpy('update').and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            select: jasmine.createSpy('select').and.returnValue({
              single: jasmine.createSpy('single')
            })
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

  describe('createUser', () => {
    it('should create a user successfully', (done) => {
      const newUser: UserInfo = {
        id: '2',
        name: 'Jane Doe',
        address: '456 Elm St',
        phone: '555-5678',
        website: 'www.janedoe.com',
        nif: '987654321',
        iban: 'ES9876543210987654321098'
      };

      mockSupabaseClient.from().insert.and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: newUser, error: null }))
        })
      });

      service.createUser(newUser).subscribe({
        next: (createdUser) => {
          expect(createdUser).toEqual(newUser);
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
          expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith(newUser);
          done();
        },
        error: (error) => {
          fail('Should not have thrown an error');
          done();
        }
      });
    });

    it('should handle errors when creating a user', (done) => {
      const newUser: UserInfo = {
        id: '2',
        name: 'Jane Doe',
        address: '456 Elm St',
        phone: '555-5678',
        website: 'www.janedoe.com',
        nif: '987654321',
        iban: 'ES9876543210987654321098'
      };

      const mockError = new Error('Database error');
      mockSupabaseClient.from().insert.and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: null, error: mockError }))
        })
      });

      service.createUser(newUser).subscribe({
        next: () => {
          fail('Should have thrown an error');
          done();
        },
        error: (error) => {
          expect(error).toBe(mockError);
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
          expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith(newUser);
          done();
        }
      });
    });

    it('should update userSubject after creating a user', (done) => {
      const newUser: UserInfo = {
        id: '2',
        name: 'Jane Doe',
        address: '456 Elm St',
        phone: '555-5678',
        website: 'www.janedoe.com',
        nif: '987654321',
        iban: 'ES9876543210987654321098'
      };

      mockSupabaseClient.from().insert.and.returnValue({
        select: jasmine.createSpy('select').and.returnValue({
          single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: newUser, error: null }))
        })
      });

      spyOn(service['userSubject'], 'next');

      service.createUser(newUser).subscribe({
        next: () => {
          expect(service['userSubject'].next).toHaveBeenCalledWith(newUser);
          done();
        },
        error: (error) => {
          fail('Should not have thrown an error');
          done();
        }
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', (done) => {
      const userId = '1';
      const updatedUserData: Partial<UserInfo> = {
        name: 'John Updated',
        phone: '555-5555'
      };
      const updatedUser: UserInfo = { ...mockUser, ...updatedUserData };

      mockSupabaseClient.from().update.and.returnValue({
        eq: jasmine.createSpy('eq').and.returnValue({
          select: jasmine.createSpy('select').and.returnValue({
            single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: updatedUser, error: null }))
          })
        })
      });

      service.updateUser(userId, updatedUserData).subscribe({
        next: (user) => {
          expect(user).toEqual(updatedUser);
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
          expect(mockSupabaseClient.from().update).toHaveBeenCalledWith(updatedUserData);
          expect(mockSupabaseClient.from().update().eq).toHaveBeenCalledWith('id', userId);
          done();
        },
        error: (error) => {
          fail('Should not have thrown an error');
          done();
        }
      });
    });

    it('should handle errors when updating a user', (done) => {
      const userId = '1';
      const updatedUserData: Partial<UserInfo> = {
        name: 'John Updated',
        phone: '555-5555'
      };
      const mockError = new Error('Update failed');

      mockSupabaseClient.from().update.and.returnValue({
        eq: jasmine.createSpy('eq').and.returnValue({
          select: jasmine.createSpy('select').and.returnValue({
            single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: null, error: mockError }))
          })
        })
      });

      service.updateUser(userId, updatedUserData).subscribe({
        next: () => {
          fail('Should have thrown an error');
          done();
        },
        error: (error) => {
          expect(error).toBe(mockError);
          expect(mockSupabaseClient.from).toHaveBeenCalledWith('users');
          expect(mockSupabaseClient.from().update).toHaveBeenCalledWith(updatedUserData);
          expect(mockSupabaseClient.from().update().eq).toHaveBeenCalledWith('id', userId);
          done();
        }
      });
    });

    it('should update userSubject after updating a user', (done) => {
      const userId = '1';
      const updatedUserData: Partial<UserInfo> = {
        name: 'John Updated',
        phone: '555-5555'
      };
      const updatedUser: UserInfo = { ...mockUser, ...updatedUserData };

      mockSupabaseClient.from().update.and.returnValue({
        eq: jasmine.createSpy('eq').and.returnValue({
          select: jasmine.createSpy('select').and.returnValue({
            single: jasmine.createSpy('single').and.returnValue(Promise.resolve({ data: updatedUser, error: null }))
          })
        })
      });

      spyOn(service['userSubject'], 'next');

      service.updateUser(userId, updatedUserData).subscribe({
        next: () => {
          expect(service['userSubject'].next).toHaveBeenCalledWith(updatedUser);
          done();
        },
        error: (error) => {
          fail('Should not have thrown an error');
          done();
        }
      });
    });
  });
});
