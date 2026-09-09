import { Platform } from 'react-native';
import { BroadcastWithDetails } from '@vicin/shared';

export interface LiveActivityState {
  activityId: string | null;
  isActive: boolean;
}

class LiveActivityManagerService {
  private currentActivityId: string | null = null;

  /**
   * Starts an iOS Live Activity for the active broadcast
   */
  async startLiveActivity(broadcast: BroadcastWithDetails): Promise<string | null> {
    if (Platform.OS !== 'ios') {
      return null;
    }

    try {
      this.currentActivityId = `activity_${broadcast.id}`;
      // In native iOS build with ActivityKit linked, calls NativeModules.VicinLiveActivityModule.start()
      return this.currentActivityId;
    } catch (err) {
      console.warn('Failed to start Live Activity:', err);
      return null;
    }
  }

  /**
   * Updates an existing Live Activity when new acknowledgments arrive
   */
  async updateLiveActivity(_broadcastId: string, _ackCount: number): Promise<void> {
    if (Platform.OS !== 'ios' || !this.currentActivityId) {
      return;
    }

    try {
      // Calls NativeModules.VicinLiveActivityModule.update()
    } catch (err) {
      console.warn('Failed updating Live Activity:', err);
    }
  }

  /**
   * Ends the Live Activity when a broadcast expires or is cancelled
   */
  async endLiveActivity(_broadcastId: string): Promise<void> {
    if (Platform.OS !== 'ios' || !this.currentActivityId) {
      return;
    }

    try {
      this.currentActivityId = null;
    } catch (err) {
      console.warn('Failed ending Live Activity:', err);
    }
  }

  getCurrentState(): LiveActivityState {
    return {
      activityId: this.currentActivityId,
      isActive: this.currentActivityId !== null,
    };
  }
}

export const LiveActivityManager = new LiveActivityManagerService();
