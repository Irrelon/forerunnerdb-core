export type FlightTestFunction = (...args: any[]) => Promise<boolean | void> | boolean | void;