import { Resend } from "resend";

// Constants for ConsensusFlow

import type { ThemeColors } from "@workspace/consensusflow";

// Color Constants
export const Primary_Color: ThemeColors = "#006D77";
export const Neutral_Color: ThemeColors = "#F8F9FA";
export const Secondary_Color: ThemeColors = "#E2B34B";

// Email Client

export const resend = new Resend(process.env.RESEND_API_KEY);
