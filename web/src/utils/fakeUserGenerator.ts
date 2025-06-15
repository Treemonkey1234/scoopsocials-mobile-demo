import { faker } from '@faker-js/faker';

export interface FakeUser {
  id: string;
  name: string;
  username: string;
  email: string;
  age: number;
  location: {
    city: string;
    state: string;
    country: string;
  };
  occupation: string;
  interests: string[];
  joinDate: Date;
  activityLevel: 'high' | 'medium' | 'low';
  trustScore: number;
  bio: string;
  avatar: string;
  connections: string[];
  connectionCount: number;
  isOnline: boolean;
  lastSeen: Date;
  accountType: 'free' | 'professional' | 'venue';
}

export interface Connection {
  userAId: string;
  userBId: string;
  relationshipType: 'friend' | 'follower' | 'mutual';
  connectionDate: Date;
  strengthScore: number;
  mutualFriendsCount: number;
  interactionFrequency: 'high' | 'medium' | 'low';
  connectionSource: 'mutual_friends' | 'location' | 'interests' | 'work' | 'random';
  // Professional account friend categorization (only relevant when one user is professional)
  professionalRelationshipType?: 'professional_only' | 'personal_access' | 'uncategorized';
}

export class FakeUserNetworkGenerator {
  private users: FakeUser[] = [];
  private connections: Connection[] = [];
  
  private readonly TOTAL_USERS = 100;
  private readonly MIN_CONNECTIONS = 1;
  private readonly MAX_CONNECTIONS = 80;
  
  // Interest categories for realistic groupings
  private readonly INTERESTS = [
    // Technology
    'Programming', 'Web Development', 'AI/ML', 'Cybersecurity', 'Gaming', 'Tech Startups',
    // Creative Arts
    'Photography', 'Graphic Design', 'Music Production', 'Writing', 'Painting', 'Digital Art',
    // Sports & Fitness
    'Rock Climbing', 'Running', 'Yoga', 'Basketball', 'Tennis', 'Hiking', 'CrossFit',
    // Professional
    'Marketing', 'Finance', 'Real Estate', 'Healthcare', 'Education', 'Consulting',
    // Lifestyle
    'Cooking', 'Travel', 'Wine Tasting', 'Coffee', 'Gardening', 'Reading', 'Meditation',
    // Social
    'Volunteering', 'Networking', 'Public Speaking', 'Community Events', 'Meetups',
    // Hobbies
    'Board Games', 'Chess', 'Woodworking', 'Crafts', 'Collectibles', 'Podcasts'
  ];
  
  // Arizona cities for geographic distribution
  private readonly LOCATIONS = [
    { city: 'Phoenix', state: 'AZ', weight: 25 },
    { city: 'Tucson', state: 'AZ', weight: 15 },
    { city: 'Mesa', state: 'AZ', weight: 12 },
    { city: 'Scottsdale', state: 'AZ', weight: 10 },
    { city: 'Chandler', state: 'AZ', weight: 8 },
    { city: 'Tempe', state: 'AZ', weight: 8 },
    { city: 'Glendale', state: 'AZ', weight: 6 },
    { city: 'Gilbert', state: 'AZ', weight: 5 },
    { city: 'Peoria', state: 'AZ', weight: 4 },
    { city: 'Surprise', state: 'AZ', weight: 3 },
    { city: 'Avondale', state: 'AZ', weight: 2 },
    { city: 'Goodyear', state: 'AZ', weight: 2 }
  ];
  
  private readonly OCCUPATIONS = [
    'Software Engineer', 'Marketing Manager', 'Teacher', 'Nurse', 'Sales Representative',
    'Graphic Designer', 'Financial Advisor', 'Real Estate Agent', 'Project Manager',
    'Data Analyst', 'UX Designer', 'Pharmacist', 'Consultant', 'Entrepreneur',
    'Photographer', 'Writer', 'Chef', 'Personal Trainer', 'Accountant', 'Lawyer',
    'Doctor', 'Therapist', 'Student', 'Retail Manager', 'Construction Worker',
    'Electrician', 'Plumber', 'Mechanic', 'Artist', 'Musician'
  ];

  constructor() {
    // Set consistent seed for reproducible results
    faker.seed(12345);
  }

  generateNetwork(): { users: FakeUser[], connections: Connection[] } {
    console.log('Generating fake user network...');
    
    // Phase 1: Generate users
    this.generateUsers();
    
    // Phase 2: Create connections
    this.createConnections();
    
    // Phase 3: Validate and adjust
    this.validateNetwork();
    
    console.log(`Generated ${this.users.length} users with ${this.connections.length} connections`);
    return { users: this.users, connections: this.connections };
  }

  private generateUsers(): void {
    console.log('Generating user profiles...');
    
    // First, create users for the hardcoded post names
    const postNames = [
      'Jessica Wong', 'David Kim', 'Mike Johnson', 'Emma Davis', 
      'Sarah Chen', 'Alex Martinez', 'Rachel Brown', 'Tom Anderson', 'Kevin Lee'
    ];
    
    postNames.forEach(name => {
      const user: FakeUser = {
        id: faker.string.uuid(),
        name: name,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 65 }),
        location: this.getRandomLocation(),
        occupation: faker.helpers.arrayElement(this.OCCUPATIONS),
        interests: this.generateInterests(),
        joinDate: faker.date.between({ 
          from: new Date('2020-01-01'), 
          to: new Date() 
        }),
        activityLevel: this.getActivityLevel(),
        trustScore: faker.number.int({ min: 65, max: 98 }),
        bio: faker.lorem.sentences(2),
        avatar: this.generateAvatar(name),
        connections: [],
        connectionCount: 0,
        isOnline: faker.datatype.boolean({ probability: 0.15 }),
        lastSeen: faker.date.recent({ days: 30 }),
        accountType: this.getAccountType()
      };
      
      this.users.push(user);
    });
    
    // Then generate the rest with random names
    for (let i = postNames.length; i < this.TOTAL_USERS; i++) {
      const fullName = faker.person.fullName();
      const user: FakeUser = {
        id: faker.string.uuid(),
        name: fullName,
        username: faker.internet.userName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 65 }),
        location: this.getRandomLocation(),
        occupation: faker.helpers.arrayElement(this.OCCUPATIONS),
        interests: this.generateInterests(),
        joinDate: faker.date.between({ 
          from: new Date('2020-01-01'), 
          to: new Date() 
        }),
        activityLevel: this.getActivityLevel(),
        trustScore: faker.number.int({ min: 65, max: 98 }),
        bio: faker.lorem.sentences(2),
        avatar: this.generateAvatar(fullName),
        connections: [],
        connectionCount: 0,
        isOnline: faker.datatype.boolean({ probability: 0.15 }),
        lastSeen: faker.date.recent({ days: 30 }),
        accountType: fullName === 'Riesling Lefluuf' ? 'professional' : this.getAccountType()
      };
      
      this.users.push(user);
    }
  }

  private getRandomLocation() {
    const totalWeight = this.LOCATIONS.reduce((sum, loc) => sum + loc.weight, 0);
    const random = faker.number.int({ min: 1, max: totalWeight });
    
    let currentWeight = 0;
    for (const location of this.LOCATIONS) {
      currentWeight += location.weight;
      if (random <= currentWeight) {
        return {
          city: location.city,
          state: location.state,
          country: 'USA'
        };
      }
    }
    
    return {
      city: this.LOCATIONS[0].city,
      state: this.LOCATIONS[0].state,
      country: 'USA'
    };
  }

  private generateInterests(): string[] {
    const interestCount = faker.number.int({ min: 3, max: 7 });
    return faker.helpers.arrayElements(this.INTERESTS, interestCount);
  }

  private getActivityLevel(): 'high' | 'medium' | 'low' {
    const rand = faker.number.float();
    if (rand < 0.2) return 'high';
    if (rand < 0.6) return 'medium';
    return 'low';
  }

  private getAccountType(): 'free' | 'professional' | 'venue' {
    const rand = faker.number.float();
    if (rand < 0.8) return 'free';        // 80% free accounts
    if (rand < 0.95) return 'professional'; // 15% professional accounts
    return 'venue';                        // 5% venue accounts
  }

  private generateAvatar(name: string): string {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return initials;
  }

  private createConnections(): void {
    console.log('Creating connections...');
    
    // Phase 1: Create seed clusters (friend groups)
    this.createSeedClusters();
    
    // Phase 2: Geographic connections
    this.createGeographicConnections();
    
    // Phase 3: Interest-based connections
    this.createInterestConnections();
    
    // Phase 4: Age-based connections
    this.createAgeConnections();
    
    // Phase 5: Random connections
    this.createRandomConnections();
    
    // Phase 6: Ensure target distribution
    this.adjustConnectionDistribution();
  }

  private createSeedClusters(): void {
    const usedUsers = new Set<string>();
    const clusterCount = faker.number.int({ min: 12, max: 18 });
    
    for (let i = 0; i < clusterCount; i++) {
      const clusterSize = faker.number.int({ min: 4, max: 8 });
      const availableUsers = this.users.filter(u => !usedUsers.has(u.id));
      
      if (availableUsers.length < clusterSize) break;
      
      const clusterUsers = faker.helpers.arrayElements(availableUsers, clusterSize);
      
      // Connect everyone in the cluster to everyone else
      for (let j = 0; j < clusterUsers.length; j++) {
        for (let k = j + 1; k < clusterUsers.length; k++) {
          this.addConnection(
            clusterUsers[j].id,
            clusterUsers[k].id,
            'friend',
            'mutual_friends',
            0.8
          );
        }
      }
      
      clusterUsers.forEach(u => usedUsers.add(u.id));
    }
  }

  private createGeographicConnections(): void {
    const locationGroups = new Map<string, FakeUser[]>();
    
    // Group users by location
    this.users.forEach(user => {
      const locationKey = `${user.location.city}, ${user.location.state}`;
      if (!locationGroups.has(locationKey)) {
        locationGroups.set(locationKey, []);
      }
      locationGroups.get(locationKey)!.push(user);
    });
    
    // Create connections within each location
    locationGroups.forEach(users => {
      if (users.length < 2) return;
      
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          if (faker.datatype.boolean({ probability: 0.15 })) {
            this.addConnection(
              users[i].id,
              users[j].id,
              'friend',
              'location',
              0.6
            );
          }
        }
      }
    });
  }

  private createInterestConnections(): void {
    const interestGroups = new Map<string, FakeUser[]>();
    
    // Group users by interests
    this.users.forEach(user => {
      user.interests.forEach(interest => {
        if (!interestGroups.has(interest)) {
          interestGroups.set(interest, []);
        }
        interestGroups.get(interest)!.push(user);
      });
    });
    
    // Create connections within interest groups
    interestGroups.forEach(users => {
      if (users.length < 2) return;
      
      for (let i = 0; i < users.length; i++) {
        for (let j = i + 1; j < users.length; j++) {
          const commonInterests = this.getCommonInterests(users[i], users[j]);
          const probability = Math.min(0.25, commonInterests.length * 0.08);
          
          if (faker.datatype.boolean({ probability })) {
            this.addConnection(
              users[i].id,
              users[j].id,
              'friend',
              'interests',
              0.7
            );
          }
        }
      }
    });
  }

  private createAgeConnections(): void {
    this.users.forEach(user => {
      const ageGroup = this.users.filter(u => 
        u.id !== user.id && Math.abs(u.age - user.age) <= 10
      );
      
      const connectionsToMake = faker.number.int({ min: 0, max: 3 });
      const candidates = faker.helpers.arrayElements(ageGroup, connectionsToMake);
      
      candidates.forEach(candidate => {
        if (faker.datatype.boolean({ probability: 0.1 })) {
          this.addConnection(
            user.id,
            candidate.id,
            'friend',
            'random',
            0.5
          );
        }
      });
    });
  }

  private createRandomConnections(): void {
    const randomConnectionCount = Math.floor(this.connections.length * 0.15);
    
    for (let i = 0; i < randomConnectionCount; i++) {
      const userA = faker.helpers.arrayElement(this.users);
      const userB = faker.helpers.arrayElement(this.users.filter(u => u.id !== userA.id));
      
      if (!this.connectionExists(userA.id, userB.id)) {
        this.addConnection(
          userA.id,
          userB.id,
          'friend',
          'random',
          0.3
        );
      }
    }
  }

  private adjustConnectionDistribution(): void {
    // Target distribution:
    // 60% of users: 5-15 connections
    // 25% of users: 15-30 connections
    // 10% of users: 30-50 connections
    // 4% of users: 50+ connections
    // 1% of users: 1-4 connections
    
    this.users.forEach(user => {
      const currentConnections = user.connectionCount;
      const rand = faker.number.float();
      
      let targetMin: number, targetMax: number;
      
      if (rand < 0.01) {
        // 1% isolated users
        targetMin = 1; targetMax = 4;
      } else if (rand < 0.61) {
        // 60% typical users
        targetMin = 5; targetMax = 15;
      } else if (rand < 0.86) {
        // 25% social users
        targetMin = 15; targetMax = 30;
      } else if (rand < 0.96) {
        // 10% very social users
        targetMin = 30; targetMax = 50;
      } else {
        // 4% super connectors
        targetMin = 50; targetMax = 80;
      }
      
      const targetConnections = faker.number.int({ min: targetMin, max: targetMax });
      
      if (currentConnections < targetConnections) {
        this.addMoreConnections(user, targetConnections - currentConnections);
      }
    });
  }

  private addMoreConnections(user: FakeUser, count: number): void {
    const availableUsers = this.users.filter(u => 
      u.id !== user.id && !this.connectionExists(user.id, u.id)
    );
    
    if (availableUsers.length === 0) return;
    
    const connectionsToAdd = Math.min(count, availableUsers.length);
    const candidates = faker.helpers.arrayElements(availableUsers, connectionsToAdd);
    
    candidates.forEach(candidate => {
      this.addConnection(
        user.id,
        candidate.id,
        'friend',
        'random',
        0.4
      );
    });
  }

  private addConnection(
    userAId: string,
    userBId: string,
    type: 'friend' | 'follower' | 'mutual',
    source: 'mutual_friends' | 'location' | 'interests' | 'work' | 'random',
    strength: number
  ): void {
    if (this.connectionExists(userAId, userBId)) return;
    
    const connection: Connection = {
      userAId,
      userBId,
      relationshipType: type,
      connectionDate: faker.date.between({ 
        from: new Date('2020-01-01'), 
        to: new Date() 
      }),
      strengthScore: strength,
      mutualFriendsCount: this.getMutualFriendsCount(userAId, userBId),
      interactionFrequency: faker.helpers.arrayElement(['high', 'medium', 'low']),
      connectionSource: source
    };
    
    this.connections.push(connection);
    
    // Update user connection lists
    const userA = this.users.find(u => u.id === userAId);
    const userB = this.users.find(u => u.id === userBId);
    
    if (userA && userB) {
      userA.connections.push(userBId);
      userB.connections.push(userAId);
      userA.connectionCount++;
      userB.connectionCount++;
    }
  }

  private connectionExists(userAId: string, userBId: string): boolean {
    return this.connections.some(conn => 
      (conn.userAId === userAId && conn.userBId === userBId) ||
      (conn.userAId === userBId && conn.userBId === userAId)
    );
  }

  private getMutualFriendsCount(userAId: string, userBId: string): number {
    const userA = this.users.find(u => u.id === userAId);
    const userB = this.users.find(u => u.id === userBId);
    
    if (!userA || !userB) return 0;
    
    const mutualFriends = userA.connections.filter(id => 
      userB.connections.includes(id)
    );
    
    return mutualFriends.length;
  }

  private getCommonInterests(userA: FakeUser, userB: FakeUser): string[] {
    return userA.interests.filter(interest => 
      userB.interests.includes(interest)
    );
  }

  private validateNetwork(): void {
    console.log('Validating network...');
    
    // Ensure no completely isolated users
    this.users.forEach(user => {
      if (user.connectionCount === 0) {
        const randomUser = faker.helpers.arrayElement(
          this.users.filter(u => u.id !== user.id)
        );
        this.addConnection(user.id, randomUser.id, 'friend', 'random', 0.3);
      }
    });
    
    // Update final statistics
    this.updateNetworkStatistics();
  }

  private updateNetworkStatistics(): void {
    const totalConnections = this.connections.length;
    const avgConnections = totalConnections * 2 / this.users.length;
    
    console.log(`Network Statistics:`);
    console.log(`- Total Users: ${this.users.length}`);
    console.log(`- Total Connections: ${totalConnections}`);
    console.log(`- Average Connections per User: ${avgConnections.toFixed(2)}`);
    
    // Connection distribution
    const distribution = {
      isolated: this.users.filter(u => u.connectionCount >= 1 && u.connectionCount <= 4).length,
      typical: this.users.filter(u => u.connectionCount >= 5 && u.connectionCount <= 15).length,
      social: this.users.filter(u => u.connectionCount >= 16 && u.connectionCount <= 30).length,
      verySocial: this.users.filter(u => u.connectionCount >= 31 && u.connectionCount <= 50).length,
      superConnector: this.users.filter(u => u.connectionCount > 50).length
    };
    
    console.log(`Connection Distribution:`);
    console.log(`- Isolated (1-4): ${distribution.isolated}%`);
    console.log(`- Typical (5-15): ${distribution.typical}%`);
    console.log(`- Social (16-30): ${distribution.social}%`);
    console.log(`- Very Social (31-50): ${distribution.verySocial}%`);
    console.log(`- Super Connectors (50+): ${distribution.superConnector}%`);
  }

  getNetworkAnalytics() {
    const totalUsers = this.users.length;
    const totalConnections = this.connections.length;
    const avgConnections = (totalConnections * 2) / totalUsers;
    
    const connectionCounts = this.users.map(u => u.connectionCount);
    const maxConnections = Math.max(...connectionCounts);
    const minConnections = Math.min(...connectionCounts);
    
    const locationGroups = new Map<string, number>();
    this.users.forEach(user => {
      const key = `${user.location.city}, ${user.location.state}`;
      locationGroups.set(key, (locationGroups.get(key) || 0) + 1);
    });
    
    const interestFrequency = new Map<string, number>();
    this.users.forEach(user => {
      user.interests.forEach(interest => {
        interestFrequency.set(interest, (interestFrequency.get(interest) || 0) + 1);
      });
    });
    
    return {
      totalUsers,
      totalConnections,
      avgConnections: Number(avgConnections.toFixed(2)),
      maxConnections,
      minConnections,
      locationDistribution: Object.fromEntries(locationGroups),
      topInterests: Array.from(interestFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([interest, count]) => ({ interest, count }))
    };
  }
}

// Export a singleton instance for consistency
export const fakeUserNetworkGenerator = new FakeUserNetworkGenerator();