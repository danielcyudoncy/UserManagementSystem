import { users, tasks, adminProfiles, type User, type InsertUser, type Task, type InsertTask, type AdminProfile, type InsertAdminProfile } from "@shared/schema";

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
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const now = new Date();
    
    // Sample users
    const sampleUsers = [
      {
        uid: "admin_user",
        fullName: "John Administrator",
        email: "admin@taskmanager.com",
        role: "Admin",
        photoUrl: "",
        fcmToken: "",
        profileComplete: true,
        isActive: true,
        lastActive: now,
        createdAt: now,
        updatedAt: now
      },
      {
        uid: "reporter_user",
        fullName: "Sarah Reporter",
        email: "sarah@taskmanager.com",
        role: "Reporter",
        photoUrl: "",
        fcmToken: "",
        profileComplete: true,
        isActive: true,
        lastActive: now,
        createdAt: now,
        updatedAt: now
      },
      {
        uid: "cameraman_user",
        fullName: "Mike Camera",
        email: "mike@taskmanager.com",
        role: "Cameraman",
        photoUrl: "",
        fcmToken: "",
        profileComplete: true,
        isActive: true,
        lastActive: now,
        createdAt: now,
        updatedAt: now
      },
      {
        uid: "editor_user",
        fullName: "Lisa Editor",
        email: "lisa@taskmanager.com",
        role: "Assignment Editor",
        photoUrl: "",
        fcmToken: "",
        profileComplete: true,
        isActive: true,
        lastActive: now,
        createdAt: now,
        updatedAt: now
      }
    ];

    sampleUsers.forEach(userData => {
      const user = { ...userData, id: this.currentUserId++ };
      this.users.set(user.id, user);
    });

    // Sample tasks
    const sampleTasks = [
      {
        uid: "task_001",
        title: "Breaking News: City Council Meeting",
        description: "Cover the emergency city council meeting about the new development project",
        status: "pending",
        priority: "high",
        assignedTo: "reporter_user",
        createdBy: "editor_user",
        createdByName: "Lisa Editor",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        completedAt: null,
        createdAt: now,
        updatedAt: now
      },
      {
        uid: "task_002",
        title: "Interview with Mayor",
        description: "Scheduled interview with the mayor regarding upcoming budget decisions",
        status: "in-progress",
        priority: "medium",
        assignedTo: "reporter_user",
        createdBy: "editor_user",
        createdByName: "Lisa Editor",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        completedAt: null,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        uid: "task_003",
        title: "Sports Event Coverage",
        description: "Film the high school championship game",
        status: "pending",
        priority: "medium",
        assignedTo: "cameraman_user",
        createdBy: "editor_user",
        createdByName: "Lisa Editor",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        completedAt: null,
        createdAt: now,
        updatedAt: now
      },
      {
        uid: "task_004",
        title: "Weather Report Footage",
        description: "Capture B-roll footage for weekly weather segment",
        status: "completed",
        priority: "low",
        assignedTo: "cameraman_user",
        createdBy: "cameraman_user",
        createdByName: "Mike Camera",
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        updatedAt: now
      },
      {
        uid: "task_005",
        title: "Community Event Report",
        description: "Write feature story on local community festival",
        status: "completed",
        priority: "low",
        assignedTo: "reporter_user",
        createdBy: "reporter_user",
        createdByName: "Sarah Reporter",
        dueDate: new Date(Date.now() - 48 * 60 * 60 * 1000),
        completedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
        updatedAt: now
      }
    ];

    sampleTasks.forEach(taskData => {
      const task = { ...taskData, id: this.currentTaskId++ };
      this.tasks.set(task.id, task);
    });

    // Sample admin profile
    const adminProfile = {
      userId: "admin_user",
      privileges: ["full_access", "user_management", "task_assignment"],
      createdAt: now,
      updatedAt: now,
      id: this.currentAdminId++
    };
    this.adminProfiles.set("admin_user", adminProfile);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUid(uid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.uid === uid);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now,
      isActive: true,
      lastActive: now,
      photoUrl: insertUser.photoUrl || "",
      fcmToken: insertUser.fcmToken || "",
      profileComplete: insertUser.profileComplete || false
    };
    this.users.set(id, user);
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

  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTaskByUid(uid: string): Promise<Task | undefined> {
    return Array.from(this.tasks.values()).find(task => task.uid === uid);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const now = new Date();
    const task: Task = { 
      ...insertTask, 
      id,
      createdAt: now,
      updatedAt: now,
      status: insertTask.status || "pending",
      description: insertTask.description || "",
      priority: insertTask.priority || "medium",
      assignedTo: insertTask.assignedTo || null,
      dueDate: insertTask.dueDate || null,
      completedAt: null
    };
    this.tasks.set(id, task);
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

  // Admin operations
  async getAdminProfile(userId: string): Promise<AdminProfile | undefined> {
    return this.adminProfiles.get(userId);
  }

  async createAdminProfile(insertProfile: InsertAdminProfile): Promise<AdminProfile> {
    const id = this.currentAdminId++;
    const now = new Date();
    const profile: AdminProfile = { 
      ...insertProfile, 
      id,
      createdAt: now,
      updatedAt: now,
      privileges: insertProfile.privileges || []
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
