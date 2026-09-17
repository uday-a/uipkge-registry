<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormSection,
  FormActions,
  FormStatus,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from "@/components/ui/pin-input";
import {
  Loader2,
  Mail,
  Smartphone,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-vue-next";

// Helpers showcase
const validationDemoStatus = ref<"error" | "warning" | "success" | undefined>(
  undefined,
);
const validationDemoMessage = ref("");
const validationDemoLoading = ref(false);

function setValidationDemo(status: "error" | "warning" | "success") {
  validationDemoStatus.value = status;
  validationDemoLoading.value = true;
  const messages = {
    error: "Username is already taken",
    warning: "Username is available but similar to an existing user",
    success: "Username is available",
  };
  validationDemoMessage.value = messages[status];
  setTimeout(() => {
    validationDemoLoading.value = false;
  }, 800);
}

const helpersForm = useForm({
  defaultValues: { helperEmail: "", helperUsername: "" },
  onSubmit: () => {},
});

// Horizontal layout
const horizontalForm = useForm({
  defaultValues: { hName: "", hEmail: "", hRole: "" },
  onSubmit: () => {},
});

// Login
const loginError = ref("");
const loginSuccess = ref(false);
const loginEmailSchema = z.string().email("Enter a valid email");
const loginPasswordSchema = z.string().min(8, "Min 8 characters");

const loginForm = useForm({
  defaultValues: { email: "", password: "" },
  onSubmit: async ({ value }) => {
    loginError.value = "";
    loginSuccess.value = false;
    await new Promise((r) => setTimeout(r, 1500));
    if (value.email === "error@demo.com") {
      loginError.value = "Invalid email or password";
    } else {
      loginSuccess.value = true;
    }
  },
});

const login2Form = useForm({
  defaultValues: { email2: "", password2: "" },
  onSubmit: () => {},
});

// Sign up — 1 col
const signupSuccess = ref(false);
const signupForm = useForm({
  defaultValues: {
    fullName: "",
    signupEmail: "",
    signupPassword: "",
    confirmPassword: "",
  },
  onSubmit: async () => {
    await new Promise((r) => setTimeout(r, 1500));
    signupSuccess.value = true;
  },
});

// Sign up — 2 col
const signup2Form = useForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    suEmail: "",
    suPhone: "",
    suPass: "",
    suConfirm: "",
  },
  onSubmit: () => {},
});

// Sign up — 3 col
const signup3Form = useForm({
  defaultValues: { fn3: "", ln3: "", role3: "", em3: "", ph3: "", dept3: "" },
  onSubmit: () => {},
});

// OTP
const otpValue = ref<string[]>([]);
const otpSubmitting = ref(false);
const otpError = ref(false);
const otpSuccess = ref(false);
const otpResendTimer = ref(30);

function startResendTimer() {
  otpResendTimer.value = 30;
  const interval = setInterval(() => {
    otpResendTimer.value--;
    if (otpResendTimer.value <= 0) clearInterval(interval);
  }, 1000);
}
startResendTimer();

function onOtpComplete() {
  otpSubmitting.value = true;
  setTimeout(() => {
    otpSubmitting.value = false;
    if (otpValue.value.join("") === "000000") {
      otpError.value = true;
    } else {
      otpSuccess.value = true;
      otpError.value = false;
    }
  }, 1000);
}

// MFA
const mfaMethod = ref("app");
const mfaCode = ref<string[]>([]);
const mfaSubmitting = ref(false);
const mfaSuccess = ref(false);

function onMfaSubmit() {
  mfaSubmitting.value = true;
  setTimeout(() => {
    mfaSubmitting.value = false;
    mfaSuccess.value = true;
  }, 1200);
}

// Password reset
const resetStep = ref<"request" | "confirm">("request");
const resetSuccess = ref(false);

const resetEmailSchema = z.string().email("Enter a valid email");
const newPasswordSchema = z.string().min(8, "Min 8 characters");

const resetRequestForm = useForm({
  defaultValues: { resetEmail: "" },
  onSubmit: async () => {
    await new Promise((r) => setTimeout(r, 1200));
    resetStep.value = "confirm";
  },
});

const resetConfirmForm = useForm({
  defaultValues: { newPassword: "", confirmNew: "" },
  onSubmit: async () => {
    await new Promise((r) => setTimeout(r, 1200));
    resetSuccess.value = true;
  },
});

// Profile — 1 col
const profileSuccess = ref(false);
const profileForm = useForm({
  defaultValues: {
    profileName: "",
    profileEmail: "",
    profilePhone: "",
    profileBio: "",
    profileCountry: "",
  },
  onSubmit: async () => {
    await new Promise((r) => setTimeout(r, 1200));
    profileSuccess.value = true;
  },
});

// Profile — 2 col
const profile2Form = useForm({
  defaultValues: {
    pfn2: "",
    pln2: "",
    pem2: "",
    pph2: "",
    pjob2: "",
    pdept2: "",
    pbio2: "",
  },
  onSubmit: () => {},
});

// Profile — 3 col
const profile3Form = useForm({
  defaultValues: {
    pfn3: "",
    pln3: "",
    pun3: "",
    pem3: "",
    pph3: "",
    pweb3: "",
    pcity3: "",
    pcountry3: "",
    pzip3: "",
  },
  onSubmit: () => {},
});
</script>

<template>
  <!-- Form Helpers Showcase -->
  <Story
    title="Form Helpers"
    description="FormSection, FormActions, FormStatus, and enhanced FormItem with label, required, description, help, and status."
  >
    <Form :form="helpersForm" class="max-w-lg space-y-6">
      <FormSection
        title="Account Details"
        description="Enter your account information below."
        bordered
      >
        <FormField name="helperEmail" v-slot="{ componentField }">
          <FormItem
            label="Email"
            required
            description="We'll never share your email with anyone."
          >
            <FormControl>
              <Input
                type="email"
                placeholder="you@example.com"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="helperUsername" v-slot="{ componentField }">
          <FormItem
            label="Username"
            required
            :status="validationDemoStatus"
            :help="validationDemoMessage"
          >
            <FormControl>
              <Input placeholder="johndoe" v-bind="componentField" />
            </FormControl>
          </FormItem>
        </FormField>

        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            @click="setValidationDemo('error')"
          >
            <AlertCircle class="mr-1 size-3.5" /> Error
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            @click="setValidationDemo('warning')"
          >
            <AlertCircle class="mr-1 size-3.5 text-amber-500" /> Warning
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            @click="setValidationDemo('success')"
          >
            <CheckCircle2 class="mr-1 size-3.5 text-emerald-500" /> Success
          </Button>
        </div>
      </FormSection>

      <FormStatus
        status="error"
        message="Please fix the errors above before submitting."
      />
      <FormStatus
        status="warning"
        message="Your password is weak. Consider using a stronger one."
      />
      <FormStatus
        status="success"
        message="Your changes have been saved successfully."
      />

      <FormSection
        title="Button Alignment"
        description="FormActions supports left, center, and right alignment."
      >
        <div class="space-y-3">
          <FormActions align="left">
            <Button type="button" size="sm" variant="outline">Cancel</Button>
            <Button type="button" size="sm">Save</Button>
          </FormActions>
          <FormActions align="center">
            <Button type="button" size="sm" variant="outline">Cancel</Button>
            <Button type="button" size="sm">Save</Button>
          </FormActions>
          <FormActions align="right">
            <Button type="button" size="sm" variant="outline">Cancel</Button>
            <Button type="button" size="sm">Save</Button>
          </FormActions>
        </div>
      </FormSection>
    </Form>
  </Story>

  <!-- Horizontal Layout -->
  <Story
    title="Horizontal Layout"
    description="FormItem supports horizontal layout with configurable label width."
  >
    <Form :form="horizontalForm" class="max-w-lg space-y-4">
      <FormField name="hName" v-slot="{ componentField }">
        <FormItem label="Full Name" layout="horizontal" required>
          <FormControl
            ><Input placeholder="Jane Doe" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="hEmail" v-slot="{ componentField }">
        <FormItem label="Email" layout="horizontal" required>
          <FormControl
            ><Input
              type="email"
              placeholder="jane@example.com"
              v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="hRole" v-slot="{ componentField }">
        <FormItem label="Role" layout="horizontal" label-width="180px">
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger
                ><SelectValue placeholder="Select role"
              /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Developer</SelectItem>
                <SelectItem value="design">Designer</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      </FormField>
      <FormActions align="right">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </FormActions>
    </Form>
  </Story>

  <!-- LOGIN -->
  <Story
    title="Login — 1 Column"
    description="Standard email + password with remember me. Validates with Zod via TanStack Vue Form."
  >
    <Form :form="loginForm" class="max-w-sm space-y-4">
      <FormField
        name="email"
        :validators="{ onSubmit: loginEmailSchema }"
        v-slot="{ componentField }"
      >
        <FormItem label="Email">
          <FormControl>
            <Input
              type="email"
              placeholder="you@example.com"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField
        name="password"
        :validators="{ onSubmit: loginPasswordSchema }"
        v-slot="{ componentField }"
      >
        <FormItem label="Password">
          <FormControl>
            <Input
              type="password"
              placeholder="••••••••"
              show-password-toggle
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm">
          <Checkbox :model-value="false" />
          Remember me
        </label>
        <a href="#" class="text-primary text-sm hover:underline"
          >Forgot password?</a
        >
      </div>

      <FormStatus v-if="loginError" status="error" :message="loginError" />
      <FormStatus
        v-if="loginSuccess"
        status="success"
        message="Login successful! Redirecting..."
      />

      <loginForm.Subscribe v-slot="{ isSubmitting }">
        <Button type="submit" class="w-full" :disabled="isSubmitting">
          <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
          {{ isSubmitting ? "Signing in..." : "Sign in" }}
        </Button>
      </loginForm.Subscribe>
    </Form>
  </Story>

  <Story
    title="Login — 2 Column"
    description="Compact side-by-side layout for wider containers."
  >
    <Form :form="login2Form" class="max-w-xl">
      <div class="grid grid-cols-2 gap-4">
        <FormField name="email2" v-slot="{ componentField }">
          <FormItem label="Email">
            <FormControl>
              <Input
                type="email"
                placeholder="you@example.com"
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="password2" v-slot="{ componentField }">
          <FormItem label="Password">
            <FormControl>
              <Input
                type="password"
                placeholder="••••••••"
                show-password-toggle
                v-bind="componentField"
              />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm">
          <Checkbox :model-value="false" /> Remember me
        </label>
        <Button type="submit" size="sm">Sign in</Button>
      </div>
    </Form>
  </Story>

  <!-- SIGN UP -->
  <Story
    title="Sign Up — 1 Column"
    description="Full registration form with validation."
  >
    <Form v-if="!signupSuccess" :form="signupForm" class="max-w-sm space-y-4">
      <FormField name="fullName" v-slot="{ componentField }">
        <FormItem label="Full Name" required>
          <FormControl>
            <Input placeholder="Jane Doe" v-bind="componentField" />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="signupEmail" v-slot="{ componentField }">
        <FormItem label="Email" required>
          <FormControl>
            <Input
              type="email"
              placeholder="jane@example.com"
              v-bind="componentField"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="signupPassword" v-slot="{ componentField }">
        <FormItem
          label="Password"
          required
          description="Must contain at least 8 characters, one number and one symbol."
        >
          <FormControl>
            <Input
              type="password"
              placeholder="Min 8 characters"
              show-password-toggle
              v-bind="componentField"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <FormField name="confirmPassword" v-slot="{ componentField }">
        <FormItem label="Confirm Password" required>
          <FormControl>
            <Input
              type="password"
              placeholder="Repeat password"
              show-password-toggle
              v-bind="componentField"
            />
          </FormControl>
        </FormItem>
      </FormField>
      <label class="flex items-start gap-2 text-sm">
        <Checkbox :model-value="false" class="mt-0.5" />
        <span
          >I agree to the
          <a href="#" class="text-primary hover:underline">Terms of Service</a>
          and
          <a href="#" class="text-primary hover:underline"
            >Privacy Policy</a
          ></span
        >
      </label>
      <FormActions>
        <signupForm.Subscribe v-slot="{ isSubmitting }">
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
            {{ isSubmitting ? "Creating account..." : "Create account" }}
          </Button>
        </signupForm.Subscribe>
      </FormActions>
    </Form>
    <div
      v-else
      class="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center"
    >
      <CheckCircle2 class="size-10 text-emerald-500" />
      <h3 class="text-lg font-semibold">Account created</h3>
      <p class="text-muted-foreground text-sm">
        Check your email to verify your account.
      </p>
      <Button variant="outline" size="sm" @click="signupSuccess = false"
        >Back to form</Button
      >
    </div>
  </Story>

  <Story
    title="Sign Up — 2 Column"
    description="Two-column grid for denser layouts."
  >
    <Form :form="signup2Form" class="max-w-2xl space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <FormField name="firstName" v-slot="{ componentField }">
          <FormItem label="First Name" required>
            <FormControl
              ><Input placeholder="Jane" v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
        <FormField name="lastName" v-slot="{ componentField }">
          <FormItem label="Last Name" required>
            <FormControl
              ><Input placeholder="Doe" v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
        <FormField name="suEmail" v-slot="{ componentField }">
          <FormItem label="Email" required>
            <FormControl
              ><Input
                type="email"
                placeholder="jane@example.com"
                v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
        <FormField name="suPhone" v-slot="{ componentField }">
          <FormItem label="Phone">
            <FormControl
              ><Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
        <FormField name="suPass" v-slot="{ componentField }">
          <FormItem label="Password" required>
            <FormControl
              ><Input
                type="password"
                show-password-toggle
                v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
        <FormField name="suConfirm" v-slot="{ componentField }">
          <FormItem label="Confirm" required>
            <FormControl
              ><Input
                type="password"
                show-password-toggle
                v-bind="componentField"
            /></FormControl>
          </FormItem>
        </FormField>
      </div>
      <label class="flex items-start gap-2 text-sm">
        <Checkbox :model-value="false" class="mt-0.5" />
        I agree to the Terms and Privacy Policy
      </label>
      <FormActions>
        <Button type="submit">Create account</Button>
      </FormActions>
    </Form>
  </Story>

  <Story
    title="Sign Up — 3 Column"
    description="Three-column grid for maximum density."
  >
    <Form :form="signup3Form" class="max-w-3xl space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <FormField name="fn3" v-slot="{ componentField }">
          <FormItem label="First"
            ><FormControl
              ><Input placeholder="Jane" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="ln3" v-slot="{ componentField }">
          <FormItem label="Last"
            ><FormControl
              ><Input placeholder="Doe" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="role3" v-slot="{ componentField }">
          <FormItem label="Role">
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  ><SelectValue placeholder="Select"
                /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">Developer</SelectItem>
                  <SelectItem value="design">Designer</SelectItem>
                  <SelectItem value="pm">Product Manager</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="em3" v-slot="{ componentField }">
          <FormItem label="Email"
            ><FormControl
              ><Input type="email" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="ph3" v-slot="{ componentField }">
          <FormItem label="Phone"
            ><FormControl
              ><Input type="tel" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="dept3" v-slot="{ componentField }">
          <FormItem label="Department">
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  ><SelectValue placeholder="Select"
                /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <FormActions>
        <Button type="submit">Create account</Button>
      </FormActions>
    </Form>
  </Story>

  <!-- OTP -->
  <Story
    title="OTP Verification"
    description="6-digit code entry with resend and error states."
  >
    <div class="max-w-sm space-y-4">
      <div class="text-center">
        <h3 class="text-lg font-semibold">Verify your email</h3>
        <p class="text-muted-foreground mt-1 text-sm">
          Enter the 6-digit code sent to you@example.com
        </p>
      </div>

      <div class="flex justify-center">
        <PinInput
          v-model="otpValue"
          :length="6"
          :status="otpError ? 'error' : otpSuccess ? 'success' : 'default'"
          otp
          @complete="onOtpComplete"
        >
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 6" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>

      <FormStatus
        v-if="otpError"
        status="error"
        message="Invalid code. Try again."
      />
      <FormStatus
        v-if="otpSuccess"
        status="success"
        message="Verified successfully!"
      />

      <div class="text-center">
        <button
          type="button"
          class="text-primary disabled:text-muted-foreground text-sm hover:underline disabled:no-underline"
          :disabled="otpResendTimer > 0"
          @click="startResendTimer"
        >
          {{
            otpResendTimer > 0 ? `Resend in ${otpResendTimer}s` : "Resend code"
          }}
        </button>
      </div>
    </div>
  </Story>

  <!-- MFA -->
  <Story
    title="MFA Setup"
    description="Multi-factor authentication method selection and code entry."
  >
    <div class="max-w-sm space-y-4">
      <div class="flex gap-2">
        <Button
          size="sm"
          :variant="mfaMethod === 'app' ? 'default' : 'outline'"
          @click="
            () => {
              mfaMethod = 'app';
              mfaSuccess = false;
            }
          "
        >
          <KeyRound class="mr-1 size-3.5" /> Authenticator
        </Button>
        <Button
          size="sm"
          :variant="mfaMethod === 'sms' ? 'default' : 'outline'"
          @click="
            () => {
              mfaMethod = 'sms';
              mfaSuccess = false;
            }
          "
        >
          <Smartphone class="mr-1 size-3.5" /> SMS
        </Button>
        <Button
          size="sm"
          :variant="mfaMethod === 'email' ? 'default' : 'outline'"
          @click="
            () => {
              mfaMethod = 'email';
              mfaSuccess = false;
            }
          "
        >
          <Mail class="mr-1 size-3.5" /> Email
        </Button>
      </div>

      <p class="text-muted-foreground text-sm">
        {{
          mfaMethod === "app"
            ? "Scan the QR code with your authenticator app and enter the code below."
            : mfaMethod === "sms"
              ? "A code has been sent to +1 (555) 000-0000."
              : "A code has been sent to you@example.com."
        }}
      </p>

      <div v-if="!mfaSuccess" class="flex items-center gap-3">
        <PinInput v-model="mfaCode" :length="6" otp @complete="onMfaSubmit">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 6" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
        <Button
          size="sm"
          :disabled="mfaSubmitting || mfaCode.length < 6"
          @click="onMfaSubmit"
        >
          <Loader2 v-if="mfaSubmitting" class="mr-1 size-3.5 animate-spin" />
          Verify
        </Button>
      </div>

      <FormStatus v-else status="success" message="MFA enabled successfully" />
    </div>
  </Story>

  <!-- PASSWORD RESET -->
  <Story
    title="Password Reset"
    description="Two-step flow: request link, then set new password."
  >
    <div class="max-w-sm space-y-4">
      <!-- Step 1: Request -->
      <div v-if="resetStep === 'request'">
        <h3 class="text-lg font-semibold">Reset password</h3>
        <p class="text-muted-foreground mt-1 mb-4 text-sm">
          Enter your email and we'll send you a reset link.
        </p>
        <Form :form="resetRequestForm" class="space-y-3">
          <FormField
            name="resetEmail"
            :validators="{ onSubmit: resetEmailSchema }"
            v-slot="{ componentField }"
          >
            <FormItem label="Email" required>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <resetRequestForm.Subscribe v-slot="{ isSubmitting }">
            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
              {{ isSubmitting ? "Sending..." : "Send reset link" }}
            </Button>
          </resetRequestForm.Subscribe>
        </Form>
      </div>

      <!-- Step 2: Confirm -->
      <div v-else-if="!resetSuccess">
        <h3 class="text-lg font-semibold">Set new password</h3>
        <p class="text-muted-foreground mt-1 mb-4 text-sm">
          Enter your new password below.
        </p>
        <Form :form="resetConfirmForm" class="space-y-3">
          <FormField
            name="newPassword"
            :validators="{ onSubmit: newPasswordSchema }"
            v-slot="{ componentField }"
          >
            <FormItem label="New Password" required>
              <FormControl>
                <Input
                  type="password"
                  show-password-toggle
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            name="confirmNew"
            :validators="{
              onSubmitListenTo: ['newPassword'],
              onSubmit: ({ value, fieldApi }) =>
                value === fieldApi.form.getFieldValue('newPassword')
                  ? undefined
                  : 'Passwords do not match',
            }"
            v-slot="{ componentField }"
          >
            <FormItem label="Confirm Password" required>
              <FormControl>
                <Input
                  type="password"
                  show-password-toggle
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <resetConfirmForm.Subscribe v-slot="{ isSubmitting }">
            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
              {{ isSubmitting ? "Updating..." : "Update password" }}
            </Button>
          </resetConfirmForm.Subscribe>
        </Form>
      </div>

      <!-- Success -->
      <div
        v-else
        class="flex flex-col items-center gap-3 rounded-lg border p-6 text-center"
      >
        <CheckCircle2 class="size-10 text-emerald-500" />
        <h3 class="text-lg font-semibold">Password updated</h3>
        <p class="text-muted-foreground text-sm">
          You can now sign in with your new password.
        </p>
        <Button
          variant="outline"
          size="sm"
          @click="
            () => {
              resetStep = 'request';
              resetSuccess = false;
            }
          "
          >Back</Button
        >
      </div>
    </div>
  </Story>

  <!-- PROFILE EDIT -->
  <Story
    title="Profile Edit — 1 Column"
    description="Single-column profile form."
  >
    <Form v-if="!profileSuccess" :form="profileForm" class="max-w-md space-y-4">
      <FormField name="profileName" v-slot="{ componentField }">
        <FormItem label="Display Name">
          <FormControl
            ><Input placeholder="Jane Doe" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="profileEmail" v-slot="{ componentField }">
        <FormItem label="Email">
          <FormControl
            ><Input type="email" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="profilePhone" v-slot="{ componentField }">
        <FormItem label="Phone">
          <FormControl
            ><Input type="tel" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="profileBio" v-slot="{ componentField }">
        <FormItem label="Bio">
          <FormControl
            ><Textarea
              :rows="3"
              placeholder="Tell us about yourself"
              v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormField name="profileCountry" v-slot="{ componentField }">
        <FormItem label="Country">
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger
                ><SelectValue placeholder="Select country"
              /></SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="jp">Japan</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      </FormField>
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-sm">
          <Switch :model-value="true" />
          Email notifications
        </label>
        <label class="flex items-center gap-2 text-sm">
          <Switch :model-value="false" />
          Marketing emails
        </label>
      </div>
      <FormActions>
        <Button type="button" variant="outline">Cancel</Button>
        <profileForm.Subscribe v-slot="{ isSubmitting }">
          <Button type="submit" :disabled="isSubmitting">
            <Loader2 v-if="isSubmitting" class="mr-2 size-4 animate-spin" />
            {{ isSubmitting ? "Saving..." : "Save changes" }}
          </Button>
        </profileForm.Subscribe>
      </FormActions>
    </Form>
    <div
      v-else
      class="flex max-w-md flex-col items-center gap-3 rounded-lg border p-6 text-center"
    >
      <CheckCircle2 class="size-10 text-emerald-500" />
      <h3 class="text-lg font-semibold">Profile updated</h3>
      <Button variant="outline" size="sm" @click="profileSuccess = false"
        >Edit again</Button
      >
    </div>
  </Story>

  <Story
    title="Profile Edit — 2 Column"
    description="Two-column layout for profile forms."
  >
    <Form :form="profile2Form" class="max-w-2xl space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <FormField name="pfn2" v-slot="{ componentField }">
          <FormItem label="First Name"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pln2" v-slot="{ componentField }">
          <FormItem label="Last Name"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pem2" v-slot="{ componentField }">
          <FormItem label="Email"
            ><FormControl
              ><Input type="email" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pph2" v-slot="{ componentField }">
          <FormItem label="Phone"
            ><FormControl
              ><Input type="tel" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pjob2" v-slot="{ componentField }">
          <FormItem label="Job Title"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pdept2" v-slot="{ componentField }">
          <FormItem label="Department">
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  ><SelectValue placeholder="Select"
                /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eng">Engineering</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
      </div>
      <FormField name="pbio2" v-slot="{ componentField }">
        <FormItem label="Bio">
          <FormControl
            ><Textarea :rows="3" v-bind="componentField"
          /></FormControl>
        </FormItem>
      </FormField>
      <FormActions>
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Save changes</Button>
      </FormActions>
    </Form>
  </Story>

  <Story
    title="Profile Edit — 3 Column"
    description="Three-column dense profile layout."
  >
    <Form :form="profile3Form" class="max-w-3xl space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <FormField name="pfn3" v-slot="{ componentField }">
          <FormItem label="First"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pln3" v-slot="{ componentField }">
          <FormItem label="Last"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pun3" v-slot="{ componentField }">
          <FormItem label="Username"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pem3" v-slot="{ componentField }">
          <FormItem label="Email"
            ><FormControl
              ><Input type="email" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pph3" v-slot="{ componentField }">
          <FormItem label="Phone"
            ><FormControl
              ><Input type="tel" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pweb3" v-slot="{ componentField }">
          <FormItem label="Website"
            ><FormControl
              ><Input type="url" v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pcity3" v-slot="{ componentField }">
          <FormItem label="City"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
        <FormField name="pcountry3" v-slot="{ componentField }">
          <FormItem label="Country">
            <FormControl>
              <Select v-bind="componentField">
                <SelectTrigger
                  ><SelectValue placeholder="Select"
                /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">US</SelectItem>
                  <SelectItem value="ca">CA</SelectItem>
                  <SelectItem value="uk">UK</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="pzip3" v-slot="{ componentField }">
          <FormItem label="Zip"
            ><FormControl><Input v-bind="componentField" /></FormControl
          ></FormItem>
        </FormField>
      </div>
      <FormActions>
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Save changes</Button>
      </FormActions>
    </Form>
  </Story>
</template>
