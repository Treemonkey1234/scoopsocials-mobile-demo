import { FakeUser, Connection, fakeUserNetworkGenerator } from '../utils/fakeUserGenerator';

let generatedData: { users: FakeUser[], connections: Connection[] } | null = null;

export function getFakeUsers(): FakeUser[] {
  if (!generatedData) {
    generatedData = fakeUserNetworkGenerator.generateNetwork();
  }
  return generatedData.users;
}

export function getFakeConnections(): Connection[] {
  if (!generatedData) {
    generatedData = fakeUserNetworkGenerator.generateNetwork();
  }
  return generatedData.connections;
}

export function getNetworkAnalytics() {
  if (!generatedData) {
    generatedData = fakeUserNetworkGenerator.generateNetwork();
  }
  return fakeUserNetworkGenerator.getNetworkAnalytics();
}

export function getFriendsForUser(userId: string): FakeUser[] {
  const users = getFakeUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return [];
  
  return users.filter(u => user.connections.includes(u.id));
}

export function getUserById(userId: string): FakeUser | undefined {
  const users = getFakeUsers();
  return users.find(u => u.id === userId);
}

export function searchUsers(query: string): FakeUser[] {
  const users = getFakeUsers();
  const lowerQuery = query.toLowerCase();
  
  return users.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.username.toLowerCase().includes(lowerQuery) ||
    user.location.city.toLowerCase().includes(lowerQuery) ||
    user.occupation.toLowerCase().includes(lowerQuery) ||
    user.interests.some(interest => interest.toLowerCase().includes(lowerQuery))
  );
}

export function getRecommendedFriends(userId: string, limit: number = 10): FakeUser[] {
  const users = getFakeUsers();
  const connections = getFakeConnections();
  const user = users.find(u => u.id === userId);
  
  if (!user) return [];
  
  // Find users with mutual connections
  const mutualFriendsCandidates = new Map<string, number>();
  
  user.connections.forEach(friendId => {
    const friend = users.find(u => u.id === friendId);
    if (friend) {
      friend.connections.forEach(friendOfFriendId => {
        if (friendOfFriendId !== userId && !user.connections.includes(friendOfFriendId)) {
          mutualFriendsCandidates.set(
            friendOfFriendId, 
            (mutualFriendsCandidates.get(friendOfFriendId) || 0) + 1
          );
        }
      });
    }
  });
  
  // Score based on mutual friends, shared interests, and location
  const scoredCandidates = Array.from(mutualFriendsCandidates.entries())
    .map(([candidateId, mutualCount]) => {
      const candidate = users.find(u => u.id === candidateId);
      if (!candidate) return null;
      
      let score = mutualCount * 3; // Mutual friends weight
      
      // Shared interests
      const sharedInterests = user.interests.filter(interest => 
        candidate.interests.includes(interest)
      ).length;
      score += sharedInterests * 2;
      
      // Same location
      if (user.location.city === candidate.location.city) {
        score += 2;
      }
      
      // Age similarity
      const ageDiff = Math.abs(user.age - candidate.age);
      if (ageDiff <= 5) score += 2;
      else if (ageDiff <= 10) score += 1;
      
      return { user: candidate, score };
    })
    .filter(item => item !== null)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, limit)
    .map(item => item!.user);
  
  return scoredCandidates;
}

// Export types for use in components
export type { FakeUser, Connection };