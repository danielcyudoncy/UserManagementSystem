import { User, Task, AdminProfile, InsertUser, InsertTask, InsertAdminProfile } from "../shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUid(uid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTaskByUid(uid: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getAllTasks(): Promise<Task[]>;
  getTasksByAssignee(assignedTo: string): Promise<Task[]>;
  getTasksByCreator(createdBy: string): Promise<Task[]>;
  
  // Admin operations
  getAdminProfile(userId: string): Promise<AdminProfile | undefined>;
  createAdminProfile(profile: InsertAdminProfile): Promise<AdminProfile>;
  updateAdminProfile(userId: string, updates: Partial<InsertAdminProfile>): Promise<AdminProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private adminProfiles: Map<string, AdminProfile>;
  private currentUserId: number;
  private currentTaskId: number;
  private currentAdminId: number;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.adminProfiles = new Map();
    this.currentUserId = 1;
    this.currentTaskId = 1;
    this.currentAdminId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    for (const [, user] of this.users.entries()) {
      if (user.uid === uid) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const [, user] of this.users.entries()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { 
      id: this.currentUserId++,
      uid: insertUser.uid,
      fullName: insertUser.fullName,
      email: insertUser.email,
      role: insertUser.role,
      photoUrl: insertUser.photoUrl || null,
      fcmToken: insertUser.fcmToken || null,
      profileComplete: insertUser.profileComplete || false,
      isActive: insertUser.isActive || true,
      lastActive: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { 
      ...user, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTaskByUid(uid: string): Promise<Task | undefined> {
    for (const [, task] of this.tasks.entries()) {
      if (task.uid === uid) {
        return task;
      }
    }
    return undefined;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const task: Task = { 
      id: this.currentTaskId++,
      uid: insertTask.uid,
      title: insertTask.title,
      description: insertTask.description || null,
      status: insertTask.status || "pending",
      priority: insertTask.priority || null,
      assignedTo: insertTask.assignedTo || null,
      createdBy: insertTask.createdBy,
      createdByName: insertTask.createdByName,
      dueDate: insertTask.dueDate || null,
      completedAt: insertTask.completedAt || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: number, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask: Task = { 
      ...task, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByAssignee(assignedTo: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.assignedTo === assignedTo);
  }

  async getTasksByCreator(createdBy: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.createdBy === createdBy);
  }

  async getAdminProfile(userId: string): Promise<AdminProfile | undefined> {
    return this.adminProfiles.get(userId);
  }

  async createAdminProfile(insertProfile: InsertAdminProfile): Promise<AdminProfile> {
    const profile: AdminProfile = { 
      id: this.currentAdminId++,
      userId: insertProfile.userId,
      privileges: insertProfile.privileges || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.adminProfiles.set(insertProfile.userId, profile);
    return profile;
  }

  async updateAdminProfile(userId: string, updates: Partial<InsertAdminProfile>): Promise<AdminProfile | undefined> {
    const profile = this.adminProfiles.get(userId);
    if (!profile) return undefined;
    
    const updatedProfile: AdminProfile = { 
      ...profile, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.adminProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }
}

export const storage = new MemStorage();