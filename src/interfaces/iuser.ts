// User

export interface User {
  email: string;
  regions: string[];
  userName: string;
  role: string;
  userDescription: string;
  credits: Number;
  estimatorCredits: Number;
  userSignUpDay: string;
  isAirbnbLoggedIn: boolean;
  betaUser: boolean;
  isSubscribed: boolean;
  hasAdditionalFreeMonthTrial: boolean;
  ab_test_pricing_group: string;
}

export interface AirbnbAuthPayload {
  action: string;
  captcha_url: string;
  airlock_id: string;
  user_id: string;
  error: string;
}
