/**
 * UserProfileContext.js
 * Global state for the user's financial profile.
 * The profile directly drives the recommendation engine —
 * changing any profile field changes which products are recommended.
 *
 * Recommendation logic uses AND filtering:
 * A product is recommended only if it passes ALL criteria simultaneously.
 */
import { createContext, useState, useContext } from "react";

const UserProfileContext = createContext();

function UserProfileProvider({ children }) {

  // Profile starts null — means user hasn't created one yet
  const [profile, setProfile] = useState(null);

  // Save or overwrite the user's financial profile
  function updateProfile(newProfile) {
    setProfile(newProfile);
  }

  // Returns true only if all required profile fields are filled
  function isProfileComplete() {
    if (!profile) return false;
    return (
      profile.riskTolerance !== "" &&
      profile.investmentHorizon !== "" &&
      profile.monthlyCapacity > 0 &&
      profile.liquidityPreference !== "" &&
      profile.investmentGoal !== ""
    );
  }

  /**
   * RECOMMENDATION ENGINE
   * Filters products based on user profile using AND logic.
   * A product must pass ALL 4 conditions to be recommended:
   * 1. Risk level is within user's tolerance
   * 2. Time horizon matches user's investment duration
   * 3. Liquidity matches user's access preference
   * 4. Minimum investment is within user's monthly capacity
   *
   * Sorting: conservative users see lowest risk first,
   * all others see highest return first.
   */
  function getRecommendations(products) {
    if (!profile) return [];

    // Conservative users only see low risk
    // Moderate users see low + medium
    // Aggressive users see all risk levels
    const riskMapping = {
      conservative: ["low"],
      moderate: ["low", "medium"],
      aggressive: ["low", "medium", "high"]
    };

    // Short horizon users only see short products
    // Medium horizon users see short + medium
    // Long horizon users see all horizons
    const horizonMapping = {
      short: ["short"],
      medium: ["short", "medium"],
      long: ["short", "medium", "long"]
    };

    // Easy preference only sees easy liquidity
    // Moderate preference sees easy + moderate
    // Locked preference sees all liquidity types
    const liquidityMapping = {
      easy: ["easy"],
      moderate: ["easy", "moderate"],
      locked: ["easy", "moderate", "locked"]
    };

    const allowedRisk = riskMapping[profile.riskTolerance] || ["low"];
    const allowedHorizon = horizonMapping[profile.investmentHorizon] || ["short"];
    const allowedLiquidity = liquidityMapping[profile.liquidityPreference] || ["easy"];

    // Step 1: Remove products user cannot afford
    const affordable = products.filter(
      p => p.minInvestment <= profile.monthlyCapacity
    );

    // Step 2: Apply risk, horizon, and liquidity filters (AND logic)
    const recommended = affordable.filter(p =>
      allowedRisk.includes(p.riskLevel) &&
      allowedHorizon.includes(p.timeHorizon) &&
      allowedLiquidity.includes(p.liquidity)
    );

    // Step 3: Sort results
    if (profile.riskTolerance === "conservative") {
      // Conservative users see safest options first
      return recommended.sort((a, b) => a.expectedReturn - b.expectedReturn);
    } else {
      // Everyone else sees highest return first
      return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
    }
  }

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      isProfileComplete,
      getRecommendations
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

// Custom hook for easy access in any component
function useUserProfile() {
  return useContext(UserProfileContext);
}

export { UserProfileProvider, useUserProfile };