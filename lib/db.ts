import { prisma } from './prisma';

export interface Branch {
  id: string;
  name: string;
  location: string;
  description: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number;
  branchId: string;
}

// Actual database functions using Prisma with error handling
export const db = {
  getBranches: async (): Promise<Branch[]> => {
    try {
      return await prisma.branch.findMany();
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Return empty array as fallback to prevent UI from breaking
      return [];
    }
  },

  getBranchById: async (id: string): Promise<Branch | null> => {
    try {
      return await prisma.branch.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching branch with id ${id}:`, error);
      return null;
    }
  },

  getActivities: async (): Promise<Activity[]> => {
    try {
      return await prisma.activity.findMany();
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },

  getActivitiesByBranch: async (branchId: string): Promise<Activity[]> => {
    try {
      return await prisma.activity.findMany({
        where: { branchId },
      });
    } catch (error) {
      console.error(`Error fetching activities for branch ${branchId}:`, error);
      return [];
    }
  },

  getActivitiesByCategory: async (category: string): Promise<Activity[]> => {
    try {
      return await prisma.activity.findMany({
        where: { category },
      });
    } catch (error) {
      console.error(`Error fetching activities for category ${category}:`, error);
      return [];
    }
  },

  getActivitiesByBranchAndCategory: async (branchId: string, category: string): Promise<Activity[]> => {
    try {
      return await prisma.activity.findMany({
        where: {
          AND: [
            { branchId },
            { category },
          ],
        },
      });
    } catch (error) {
      console.error(`Error fetching activities for branch ${branchId} and category ${category}:`, error);
      return [];
    }
  },
};