import { describe, it, expect } from 'vitest';
import { LEADERBOARD_DATA } from '../lib/leaderboard';

describe('Global ESG Impact Leaderboard', () => {
  it('contains at least 8 top climate contributors', () => {
    expect(LEADERBOARD_DATA.length).toBeGreaterThanOrEqual(8);
  });

  it('maintains strict rank order by total retired CO2 tons', () => {
    for (let i = 0; i < LEADERBOARD_DATA.length - 1; i++) {
      expect(LEADERBOARD_DATA[i].totalRetiredTons).toBeGreaterThanOrEqual(
        LEADERBOARD_DATA[i + 1].totalRetiredTons
      );
    }
  });

  it('validates verified organization badge assignments', () => {
    const verifiedOrgs = LEADERBOARD_DATA.filter((i) => i.verifiedOrg);
    expect(verifiedOrgs.length).toBeGreaterThan(0);
    verifiedOrgs.forEach((org) => {
      expect(org.displayName.length).toBeGreaterThan(0);
      expect(org.badges.length).toBeGreaterThan(0);
    });
  });
});
