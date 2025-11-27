import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para interactuar con Supabase
 * Maneja autenticación y operaciones de base de datos
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor() {
    // Inicializar cliente de Supabase
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    // Subject para el usuario actual
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Verificar sesión existente
    this.loadSession();

    // Escuchar cambios en la autenticación
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  /**
   * Obtiene el cliente de Supabase
   * Útil para operaciones avanzadas
   */
  get client(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Obtiene el usuario actual (síncrono)
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario logueado
   */
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // ==========================================
  // AUTH METHODS
  // ==========================================

  /**
   * Carga la sesión del usuario desde localStorage
   */
  private async loadSession(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();
    this.currentUserSubject.next(data.session?.user ?? null);
  }

  /**
   * Registro de nuevo usuario
   */
  async signUp(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (data.user) {
      this.currentUserSubject.next(data.user);
    }

    return { user: data.user, error };
  }

  /**
   * Login de usuario
   */
  async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (data.user) {
      this.currentUserSubject.next(data.user);
    }

    return { user: data.user, error };
  }

  /**
   * Logout de usuario
   */
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUserSubject.next(null);
  }

  /**
   * Recuperar contraseña
   */
  async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    return { error };
  }

  // ==========================================
  // DATABASE METHODS (Para implementar después)
  // ==========================================

  /**
   * Obtiene la tabla 'schemas'
   * Nota: Las tablas se crearán en el próximo issue
   */
  get schemas() {
    return this.supabase.from('schemas');
  }

  /**
   * Obtiene la tabla 'templates'
   */
  get templates() {
    return this.supabase.from('templates');
  }

  /**
   * Obtiene la tabla 'forks'
   */
  get forks() {
    return this.supabase.from('forks');
  }
}
