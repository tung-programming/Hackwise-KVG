// Onboarding service
import { supabase } from "../../config/database";
import { NotFoundError } from "../../utils/errors";

// Field and type options based on the platform design
const FIELDS = [
  { id: "engineering", name: "Engineering", icon: "🔧" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "law", name: "Law", icon: "⚖️" },
  { id: "medical", name: "Medical", icon: "🏥" },
];

const TYPES: Record<string, { id: string; name: string }[]> = {
  engineering: [
    { id: "cse", name: "Computer Science" },
    { id: "ece", name: "Electronics & Communication" },
    { id: "mechanical", name: "Mechanical" },
    { id: "civil", name: "Civil" },
    { id: "electrical", name: "Electrical" },
    { id: "chemical", name: "Chemical" },
  ],
  business: [
    { id: "finance", name: "Finance" },
    { id: "marketing", name: "Marketing" },
    { id: "hr", name: "Human Resources" },
    { id: "operations", name: "Operations" },
    { id: "entrepreneurship", name: "Entrepreneurship" },
  ],
  law: [
    { id: "criminal_law", name: "Criminal Law" },
    { id: "corporate_law", name: "Corporate Law" },
    { id: "civil_law", name: "Civil Law" },
    { id: "constitutional_law", name: "Constitutional Law" },
  ],
  medical: [
    { id: "dental", name: "Dental" },
    { id: "nursing", name: "Nursing" },
    { id: "pharmacy", name: "Pharmacy" },
    { id: "neurology", name: "Neurology" },
    { id: "cardiology", name: "Cardiology" },
  ],
};

export const onboardingService = {
  getFields: async () => {
    return FIELDS;
  },

  getTypes: async (field: string) => {
    const types = TYPES[field];
    if (!types) {
      throw new NotFoundError("Field not found");
    }
    return types;
  },

  complete: async (
    userId: string,
    email: string,
    data: { field: string; type: string; username: string; auth_provider: string; auth_provider_id: string }
  ) => {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingUser) {
      // Update existing user
      const { data: user, error } = await supabase
        .from("users")
        .update({
          field: data.field,
          type: data.type,
          username: data.username,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      return {
        user,
        message: "Onboarding updated successfully",
      };
    }

    // Create new user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        username: data.username,
        field: data.field,
        type: data.type,
        auth_provider: data.auth_provider,
        auth_provider_id: data.auth_provider_id,
        xp: 0,
        streak: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      user,
      message: "Onboarding completed successfully",
    };
  },

  // Check if user has completed onboarding
  checkStatus: async (userId: string) => {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, field, type")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return { completed: false };
    }

    return {
      completed: true,
      field: user.field,
      type: user.type,
    };
  },
};
